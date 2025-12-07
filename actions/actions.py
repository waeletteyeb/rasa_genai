# ============================================================================
# RASA ACTION SERVER - Point d'entrée principal
# Serveur d'actions custom avec LLM + RAG
# ============================================================================

"""
Action Server pour le Chatbot Hybride Sofrecom
Intègre :
- Pipeline RAG avec ChromaDB
- Intégration OpenAI (GPT-4 + Embeddings)
- Routing basé sur la confiance NLU
- Logging structuré
"""

# Import des actions custom
from actions.action_rag_query import ActionRAGQuery
from actions.action_router import ActionRouter, ActionCheckConfidence
from actions.action_fallback import ActionDefaultFallback
from actions.action_business import (
    ActionCreateTicket,
    ActionGetTicketStatus,
    ActionRequestCallback,
    ActionLogConversation,
    ActionGetUserInfo,
    ActionSendFeedback,
    ActionSessionStart
)

# Export de toutes les actions pour Rasa
__all__ = [
    'ActionRAGQuery',
    'ActionRouter',
    'ActionCheckConfidence',
    'ActionDefaultFallback',
    'ActionCreateTicket',
    'ActionGetTicketStatus',
    'ActionRequestCallback',
    'ActionLogConversation',
    'ActionGetUserInfo',
    'ActionSendFeedback',
    'ActionSessionStart'
]
