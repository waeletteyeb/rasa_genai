# ============================================================================
# LOGGER - Logging structuré pour l'Action Server
# ============================================================================

"""
Module de logging structuré
Fournit un logger configuré avec rotation des fichiers
et formatage JSON pour l'analyse
"""

import os
import sys
import json
import logging
from datetime import datetime
from typing import Any, Dict, Optional
from logging.handlers import RotatingFileHandler


class JsonFormatter(logging.Formatter):
    """
    Formateur JSON pour les logs structurés
    Permet une analyse facile avec des outils comme ELK
    """
    
    def format(self, record: logging.LogRecord) -> str:
        """
        Formate un record de log en JSON
        
        Args:
            record: Record de log à formater
            
        Returns:
            str: Log formaté en JSON
        """
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }
        
        # Ajouter les données extra si présentes
        if hasattr(record, 'extra_data'):
            log_data["data"] = record.extra_data
            
        # Ajouter l'exception si présente
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_data, ensure_ascii=False, default=str)


class ActionLogger:
    """
    Logger personnalisé pour l'Action Server
    Supporte le logging structuré avec contexte
    """
    
    _instances: Dict[str, 'ActionLogger'] = {}
    
    def __new__(cls, name: str = "action_server") -> 'ActionLogger':
        """Singleton par nom de logger"""
        if name not in cls._instances:
            instance = super().__new__(cls)
            cls._instances[name] = instance
        return cls._instances[name]
    
    def __init__(self, name: str = "action_server"):
        """
        Initialise le logger
        
        Args:
            name: Nom du logger
        """
        if hasattr(self, '_initialized') and self._initialized:
            return
            
        self.name = name
        self.logger = logging.getLogger(name)
        self._initialized = True
        self._setup_logger()
        
    def _setup_logger(self) -> None:
        """Configure le logger avec handlers console et fichier"""
        # Éviter les handlers dupliqués
        if self.logger.handlers:
            return
            
        self.logger.setLevel(logging.DEBUG)
        
        # Handler console avec format lisible
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        console_format = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        console_handler.setFormatter(console_format)
        self.logger.addHandler(console_handler)
        
        # Handler fichier avec format JSON
        log_dir = os.getenv("LOG_DIR", "logs")
        os.makedirs(log_dir, exist_ok=True)
        
        file_handler = RotatingFileHandler(
            os.path.join(log_dir, "action_server.log"),
            maxBytes=10 * 1024 * 1024,  # 10 MB
            backupCount=5,
            encoding='utf-8'
        )
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(JsonFormatter())
        self.logger.addHandler(file_handler)
        
    def _log_with_extra(
        self,
        level: int,
        message: str,
        extra_data: Optional[Dict[str, Any]] = None,
        exc_info: bool = False
    ) -> None:
        """
        Log avec données supplémentaires
        
        Args:
            level: Niveau de log
            message: Message à logger
            extra_data: Données additionnelles
            exc_info: Inclure les infos d'exception
        """
        extra = {'extra_data': extra_data} if extra_data else {}
        self.logger.log(level, message, extra=extra, exc_info=exc_info)
    
    def debug(self, message: str, **kwargs: Any) -> None:
        """Log niveau DEBUG"""
        self._log_with_extra(logging.DEBUG, message, kwargs if kwargs else None)
        
    def info(self, message: str, **kwargs: Any) -> None:
        """Log niveau INFO"""
        self._log_with_extra(logging.INFO, message, kwargs if kwargs else None)
        
    def warning(self, message: str, **kwargs: Any) -> None:
        """Log niveau WARNING"""
        self._log_with_extra(logging.WARNING, message, kwargs if kwargs else None)
        
    def error(self, message: str, exc_info: bool = False, **kwargs: Any) -> None:
        """Log niveau ERROR"""
        self._log_with_extra(
            logging.ERROR, 
            message, 
            kwargs if kwargs else None,
            exc_info=exc_info
        )
        
    def critical(self, message: str, exc_info: bool = True, **kwargs: Any) -> None:
        """Log niveau CRITICAL"""
        self._log_with_extra(
            logging.CRITICAL, 
            message, 
            kwargs if kwargs else None,
            exc_info=exc_info
        )
    
    def log_action(
        self,
        action_name: str,
        sender_id: str,
        intent: Optional[str] = None,
        confidence: Optional[float] = None,
        entities: Optional[list] = None,
        response: Optional[str] = None,
        duration_ms: Optional[float] = None,
        success: bool = True
    ) -> None:
        """
        Log structuré pour une action Rasa
        
        Args:
            action_name: Nom de l'action exécutée
            sender_id: ID de l'utilisateur
            intent: Intent détecté
            confidence: Score de confiance
            entities: Entités extraites
            response: Réponse générée
            duration_ms: Durée d'exécution en ms
            success: Succès de l'action
        """
        self.info(
            f"Action executed: {action_name}",
            action=action_name,
            sender_id=sender_id,
            intent=intent,
            confidence=confidence,
            entities=entities,
            response=response[:100] if response else None,
            duration_ms=duration_ms,
            success=success
        )
    
    def log_rag_query(
        self,
        query: str,
        num_results: int,
        top_score: float,
        llm_response: Optional[str] = None,
        duration_ms: Optional[float] = None
    ) -> None:
        """
        Log structuré pour une requête RAG
        
        Args:
            query: Requête utilisateur
            num_results: Nombre de résultats trouvés
            top_score: Score du meilleur résultat
            llm_response: Réponse du LLM
            duration_ms: Durée totale en ms
        """
        self.info(
            "RAG query executed",
            query=query[:100],
            num_results=num_results,
            top_score=top_score,
            response_length=len(llm_response) if llm_response else 0,
            duration_ms=duration_ms
        )


# Instance globale du logger
logger = ActionLogger()


def get_logger(name: str = "action_server") -> ActionLogger:
    """
    Récupère une instance de logger
    
    Args:
        name: Nom du logger
        
    Returns:
        ActionLogger: Instance du logger
    """
    return ActionLogger(name)
