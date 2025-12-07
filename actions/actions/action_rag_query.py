# ============================================================================
# ACTION RAG QUERY - Action Rasa pour le pipeline RAG
# ============================================================================

"""Action Rasa qui exécute une requête RAG complète"""

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import time

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.rag_pipeline import get_rag_pipeline
from utils.logger import logger


class ActionRAGQuery(Action):
    """
    Action Rasa qui exécute le pipeline RAG
    Récupère les documents pertinents et génère une réponse via LLM
    """
    
    def name(self) -> Text:
        return "action_rag_query"
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        """
        Exécute la requête RAG
        
        Args:
            dispatcher: Pour envoyer des messages
            tracker: État de la conversation
            domain: Configuration du domaine
            
        Returns:
            List[Dict]: Événements Rasa (slots à mettre à jour)
        """
        start_time = time.time()
        sender_id = tracker.sender_id
        user_message = tracker.latest_message.get("text", "")
        intent = tracker.latest_message.get("intent", {}).get("name", "unknown")
        confidence = tracker.latest_message.get("intent", {}).get("confidence", 0)
        
        logger.info(
            f"RAG Query started for user {sender_id}",
            message=user_message[:100],
            intent=intent,
            confidence=confidence
        )
        
        try:
            # Exécuter le pipeline RAG
            rag_pipeline = get_rag_pipeline()
            response = rag_pipeline.query(user_message)
            
            # Envoyer la réponse
            dispatcher.utter_message(text=response.answer)
            
            # Si des sources sont disponibles, les mentionner
            if response.sources and response.confidence > 0.6:
                sources_text = ", ".join([s["source"] for s in response.sources[:3]])
                dispatcher.utter_message(
                    text=f"📚 Sources: {sources_text}"
                )
            
            duration_ms = (time.time() - start_time) * 1000
            
            logger.log_action(
                action_name=self.name(),
                sender_id=sender_id,
                intent=intent,
                confidence=confidence,
                response=response.answer,
                duration_ms=duration_ms,
                success=True
            )
            
            return [
                SlotSet("rag_response", response.answer),
                SlotSet("rag_context", response.context_used[:500] if response.context_used else None)
            ]
            
        except Exception as e:
            logger.error(
                f"Erreur RAG Query: {str(e)}",
                exc_info=True,
                sender_id=sender_id
            )
            
            dispatcher.utter_message(
                text="Je rencontre un problème technique. Souhaitez-vous parler à un conseiller ?"
            )
            
            return [SlotSet("rag_response", None)]
