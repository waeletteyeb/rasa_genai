# ============================================================================
# CONFIGURATION - Paramètres de l'Action Server
# ============================================================================

"""
Configuration centralisée pour l'Action Server
Gère les variables d'environnement et les paramètres par défaut
"""

import os
from dataclasses import dataclass
from typing import Optional


@dataclass
class OpenAIConfig:
    """Configuration OpenAI"""
    api_key: str
    model: str = "gpt-4"
    embedding_model: str = "text-embedding-ada-002"
    max_tokens: int = 1024
    temperature: float = 0.7
    timeout: int = 30


@dataclass
class ChromaDBConfig:
    """Configuration ChromaDB"""
    persist_directory: str = "./chroma_db"
    collection_name: str = "sofrecom_docs"
    distance_function: str = "cosine"  # cosine, l2, ip


@dataclass
class RAGConfig:
    """Configuration du pipeline RAG"""
    confidence_threshold: float = 0.75  # Seuil configuré par l'utilisateur
    top_k: int = 5  # Nombre de documents à récupérer
    chunk_size: int = 1000  # Taille des chunks de documents
    chunk_overlap: int = 200  # Overlap entre chunks
    min_relevance_score: float = 0.5  # Score minimum de pertinence


@dataclass
class MongoDBConfig:
    """Configuration MongoDB"""
    uri: str = "mongodb://localhost:27017"
    database: str = "sofrecom_chatbot"
    conversations_collection: str = "conversations"
    analytics_collection: str = "analytics"
    tickets_collection: str = "tickets"


@dataclass
class LoggingConfig:
    """Configuration du logging"""
    level: str = "INFO"
    format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    file: Optional[str] = "logs/action_server.log"


class Config:
    """
    Configuration principale de l'Action Server
    Charge les paramètres depuis les variables d'environnement
    """
    
    def __init__(self):
        self.openai = self._load_openai_config()
        self.chromadb = self._load_chromadb_config()
        self.rag = self._load_rag_config()
        self.mongodb = self._load_mongodb_config()
        self.logging = self._load_logging_config()
        
    def _load_openai_config(self) -> OpenAIConfig:
        """Charge la configuration OpenAI depuis l'environnement"""
        return OpenAIConfig(
            api_key=os.getenv("OPENAI_API_KEY", ""),
            model=os.getenv("OPENAI_MODEL", "gpt-4"),
            embedding_model=os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-ada-002"),
            max_tokens=int(os.getenv("OPENAI_MAX_TOKENS", "1024")),
            temperature=float(os.getenv("OPENAI_TEMPERATURE", "0.7")),
            timeout=int(os.getenv("OPENAI_TIMEOUT", "30"))
        )
    
    def _load_chromadb_config(self) -> ChromaDBConfig:
        """Charge la configuration ChromaDB depuis l'environnement"""
        return ChromaDBConfig(
            persist_directory=os.getenv("CHROMA_PERSIST_DIR", "./chroma_db"),
            collection_name=os.getenv("CHROMA_COLLECTION", "sofrecom_docs"),
            distance_function=os.getenv("CHROMA_DISTANCE", "cosine")
        )
    
    def _load_rag_config(self) -> RAGConfig:
        """Charge la configuration RAG depuis l'environnement"""
        return RAGConfig(
            confidence_threshold=float(os.getenv("RAG_CONFIDENCE_THRESHOLD", "0.75")),
            top_k=int(os.getenv("RAG_TOP_K", "5")),
            chunk_size=int(os.getenv("RAG_CHUNK_SIZE", "1000")),
            chunk_overlap=int(os.getenv("RAG_CHUNK_OVERLAP", "200")),
            min_relevance_score=float(os.getenv("RAG_MIN_RELEVANCE", "0.5"))
        )
    
    def _load_mongodb_config(self) -> MongoDBConfig:
        """Charge la configuration MongoDB depuis l'environnement"""
        return MongoDBConfig(
            uri=os.getenv("MONGODB_URI", "mongodb://localhost:27017"),
            database=os.getenv("MONGODB_DATABASE", "sofrecom_chatbot"),
            conversations_collection=os.getenv("MONGODB_CONVERSATIONS_COLLECTION", "conversations"),
            analytics_collection=os.getenv("MONGODB_ANALYTICS_COLLECTION", "analytics"),
            tickets_collection=os.getenv("MONGODB_TICKETS_COLLECTION", "tickets")
        )
    
    def _load_logging_config(self) -> LoggingConfig:
        """Charge la configuration de logging depuis l'environnement"""
        return LoggingConfig(
            level=os.getenv("LOG_LEVEL", "INFO"),
            format=os.getenv("LOG_FORMAT", "%(asctime)s - %(name)s - %(levelname)s - %(message)s"),
            file=os.getenv("LOG_FILE", "logs/action_server.log")
        )
    
    def validate(self) -> bool:
        """
        Valide que toutes les configurations requises sont présentes
        
        Returns:
            bool: True si la configuration est valide
            
        Raises:
            ValueError: Si une configuration requise est manquante
        """
        if not self.openai.api_key:
            raise ValueError("OPENAI_API_KEY est requis dans les variables d'environnement")
        
        return True
    
    def to_dict(self) -> dict:
        """
        Convertit la configuration en dictionnaire
        (masque les clés sensibles)
        
        Returns:
            dict: Configuration sous forme de dictionnaire
        """
        return {
            "openai": {
                "model": self.openai.model,
                "embedding_model": self.openai.embedding_model,
                "max_tokens": self.openai.max_tokens,
                "temperature": self.openai.temperature,
                "api_key": "***" if self.openai.api_key else "NOT_SET"
            },
            "chromadb": {
                "persist_directory": self.chromadb.persist_directory,
                "collection_name": self.chromadb.collection_name,
                "distance_function": self.chromadb.distance_function
            },
            "rag": {
                "confidence_threshold": self.rag.confidence_threshold,
                "top_k": self.rag.top_k,
                "chunk_size": self.rag.chunk_size,
                "chunk_overlap": self.rag.chunk_overlap,
                "min_relevance_score": self.rag.min_relevance_score
            },
            "mongodb": {
                "uri": self.mongodb.uri.split("@")[-1] if "@" in self.mongodb.uri else self.mongodb.uri,
                "database": self.mongodb.database
            },
            "logging": {
                "level": self.logging.level
            }
        }


# Instance globale de configuration
config = Config()
