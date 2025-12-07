# ============================================================================
# ACTION ROUTER - Routing basé sur la confiance NLU
# ============================================================================

"""Actions de routing vers RAG ou réponses standard selon la confiance"""

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, FollowupAction

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.config import config
from utils.logger import logger


class ActionRouter(Action):
    """
    Router intelligent basé sur la confiance NLU
    Si confiance < seuil → déclenche RAG
    Si confiance >= seuil → laisse Rasa Core gérer
    """
    
    def name(self) -> Text:
        return "action_router"
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        
        confidence = tracker.latest_message.get("intent", {}).get("confidence", 0)
        intent = tracker.latest_message.get("intent", {}).get("name", "unknown")
        threshold = config.rag.confidence_threshold
        
        logger.info(
            f"Router: intent={intent}, confidence={confidence:.2f}, threshold={threshold}",
            sender_id=tracker.sender_id
        )
        
        events = [SlotSet("nlu_confidence", confidence)]
        
        if confidence < threshold:
            logger.info(f"Low confidence ({confidence:.2f} < {threshold}), routing to RAG")
            dispatcher.utter_message(text="Je recherche dans notre documentation...")
            events.append(FollowupAction("action_rag_query"))
        else:
            logger.info(f"High confidence ({confidence:.2f}), using standard response")
        
        return events


class ActionCheckConfidence(Action):
    """Vérifie le niveau de confiance NLU et stocke dans un slot"""
    
    def name(self) -> Text:
        return "action_check_confidence"
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        
        confidence = tracker.latest_message.get("intent", {}).get("confidence", 0)
        threshold = config.rag.confidence_threshold
        
        return [
            SlotSet("nlu_confidence", confidence),
            SlotSet("current_topic", "rag" if confidence < threshold else "standard")
        ]
