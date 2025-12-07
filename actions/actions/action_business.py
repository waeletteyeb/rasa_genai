# ============================================================================
# ACTIONS BUSINESS - Actions métier pour le chatbot
# ============================================================================

"""Actions métier : tickets, callbacks, logging, etc."""

from typing import Any, Text, Dict, List
from datetime import datetime
import uuid
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, SessionStarted, ActionExecuted

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.logger import logger


class ActionCreateTicket(Action):
    """Crée un ticket de support"""
    
    def name(self) -> Text:
        return "action_create_ticket"
    
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        ticket_id = f"TKT-{uuid.uuid4().hex[:6].upper()}"
        user_name = tracker.get_slot("user_name") or "Utilisateur"
        user_email = tracker.get_slot("user_email") or ""
        
        logger.info(f"Ticket created: {ticket_id}", user=user_name, email=user_email)
        
        dispatcher.utter_message(
            text=f"✅ Ticket créé avec succès !\n"
                 f"📝 Numéro: {ticket_id}\n"
                 f"⏱️ Délai de traitement: 24-48h"
        )
        
        return [SlotSet("ticket_number", ticket_id)]


class ActionGetTicketStatus(Action):
    """Récupère le statut d'un ticket"""
    
    def name(self) -> Text:
        return "action_get_ticket_status"
    
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        ticket_number = tracker.get_slot("ticket_number")
        
        if not ticket_number:
            dispatcher.utter_message(text="Quel est votre numéro de ticket ?")
            return []
        
        dispatcher.utter_message(
            text=f"📋 Ticket {ticket_number}\n"
                 f"Status: En cours de traitement\n"
                 f"Un conseiller vous contactera sous 24h."
        )
        return []


class ActionRequestCallback(Action):
    """Enregistre une demande de rappel"""
    
    def name(self) -> Text:
        return "action_request_callback"
    
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        user_name = tracker.get_slot("user_name") or "Client"
        user_phone = tracker.get_slot("user_phone")
        
        if not user_phone:
            dispatcher.utter_message(text="Quel est votre numéro de téléphone ?")
            return []
        
        logger.info(f"Callback requested", user=user_name, phone=user_phone)
        
        dispatcher.utter_message(
            text=f"📞 Demande de rappel enregistrée !\n"
                 f"Nous vous rappellerons au {user_phone} dans les plus brefs délais."
        )
        return []


class ActionLogConversation(Action):
    """Log la conversation pour analytics"""
    
    def name(self) -> Text:
        return "action_log_conversation"
    
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        events = tracker.events
        messages = [e for e in events if e.get("event") == "user"]
        
        logger.info(
            "Conversation logged",
            sender_id=tracker.sender_id,
            message_count=len(messages),
            duration_seconds=len(messages) * 30  # estimation
        )
        return []


class ActionGetUserInfo(Action):
    """Récupère les infos utilisateur des slots"""
    
    def name(self) -> Text:
        return "action_get_user_info"
    
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        return [
            SlotSet("user_name", tracker.get_slot("user_name")),
            SlotSet("user_email", tracker.get_slot("user_email")),
            SlotSet("user_phone", tracker.get_slot("user_phone"))
        ]


class ActionSendFeedback(Action):
    """Enregistre le feedback utilisateur"""
    
    def name(self) -> Text:
        return "action_send_feedback"
    
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        feedback = tracker.get_slot("user_feedback")
        logger.info(f"Feedback received: {feedback}", sender_id=tracker.sender_id)
        
        dispatcher.utter_message(text="Merci pour votre retour ! 🙏")
        return []


class ActionSessionStart(Action):
    """Initialise une nouvelle session"""
    
    def name(self) -> Text:
        return "action_session_start"
    
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        logger.info(f"New session started", sender_id=tracker.sender_id)
        
        return [
            SessionStarted(),
            ActionExecuted("action_listen")
        ]
