# ============================================================================
# ACTION FALLBACK - Gestion des cas de fallback
# ============================================================================

"""Action de fallback par défaut quand aucune autre action ne convient"""

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import UserUtteranceReverted, FollowupAction

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.logger import logger


class ActionDefaultFallback(Action):
    """
    Action de fallback par défaut
    Tente d'utiliser RAG avant de demander reformulation
    """
    
    def name(self) -> Text:
        return "action_default_fallback"
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        
        user_message = tracker.latest_message.get("text", "")
        sender_id = tracker.sender_id
        
        logger.warning(
            f"Fallback triggered for user {sender_id}",
            message=user_message[:100]
        )
        
        # Compteur de fallbacks consécutifs
        fallback_count = tracker.get_slot("fallback_count") or 0
        fallback_count += 1
        
        if fallback_count >= 3:
            dispatcher.utter_message(
                text="Je n'arrive pas à comprendre vos demandes. "
                     "Souhaitez-vous parler à un conseiller humain ?"
            )
            return [UserUtteranceReverted()]
        
        # Premier fallback → tenter RAG
        dispatcher.utter_message(
            text="Laissez-moi chercher dans notre base de connaissances..."
        )
        
        return [FollowupAction("action_rag_query")]
