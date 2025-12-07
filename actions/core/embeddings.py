# ============================================================================
# SERVICE D'EMBEDDINGS - Vectorisation de texte avec OpenAI
# ============================================================================

"""
Service d'embeddings utilisant l'API OpenAI
Convertit le texte en vecteurs pour la recherche sémantique
"""

import time
from typing import List, Optional, Union
from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.config import config
from utils.logger import logger


class EmbeddingService:
    """
    Service de génération d'embeddings avec OpenAI
    
    Utilise text-embedding-ada-002 pour une vectorisation 
    de haute qualité du texte
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialise le service d'embeddings
        
        Args:
            api_key: Clé API OpenAI (optionnel, utilise config si non fourni)
        """
        self.api_key = api_key or config.openai.api_key
        self.model = config.openai.embedding_model
        self.client = OpenAI(api_key=self.api_key)
        self._dimension = 1536  # Dimension des embeddings ada-002
        
        logger.info(
            "EmbeddingService initialized",
            model=self.model,
            dimension=self._dimension
        )
    
    @property
    def dimension(self) -> int:
        """Dimension des vecteurs d'embedding"""
        return self._dimension
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    def embed(self, text: str) -> List[float]:
        """
        Génère un embedding pour un texte donné
        
        Args:
            text: Texte à vectoriser
            
        Returns:
            List[float]: Vecteur d'embedding (1536 dimensions)
            
        Raises:
            ValueError: Si le texte est vide
            Exception: Si l'API échoue après les retries
        """
        if not text or not text.strip():
            raise ValueError("Le texte ne peut pas être vide")
        
        # Limiter la taille du texte (max 8191 tokens pour ada-002)
        text = text[:8000]  # Approximation sécuritaire
        
        start_time = time.time()
        
        try:
            response = self.client.embeddings.create(
                model=self.model,
                input=text.replace("\n", " ")
            )
            
            embedding = response.data[0].embedding
            
            duration_ms = (time.time() - start_time) * 1000
            logger.debug(
                "Embedding generated",
                text_length=len(text),
                duration_ms=round(duration_ms, 2)
            )
            
            return embedding
            
        except Exception as e:
            logger.error(
                f"Erreur lors de la génération d'embedding: {str(e)}",
                exc_info=True,
                text_length=len(text)
            )
            raise
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Génère des embeddings pour plusieurs textes en batch
        
        Args:
            texts: Liste de textes à vectoriser
            
        Returns:
            List[List[float]]: Liste de vecteurs d'embedding
            
        Raises:
            ValueError: Si la liste est vide
        """
        if not texts:
            raise ValueError("La liste de textes ne peut pas être vide")
        
        # Filtrer et nettoyer les textes
        cleaned_texts = []
        for text in texts:
            if text and text.strip():
                cleaned_texts.append(text[:8000].replace("\n", " "))
        
        if not cleaned_texts:
            raise ValueError("Aucun texte valide à vectoriser")
        
        start_time = time.time()
        
        try:
            response = self.client.embeddings.create(
                model=self.model,
                input=cleaned_texts
            )
            
            # Trier par index pour garantir l'ordre
            embeddings = [None] * len(cleaned_texts)
            for item in response.data:
                embeddings[item.index] = item.embedding
            
            duration_ms = (time.time() - start_time) * 1000
            logger.info(
                f"Batch embeddings generated: {len(embeddings)} vectors",
                count=len(embeddings),
                duration_ms=round(duration_ms, 2)
            )
            
            return embeddings
            
        except Exception as e:
            logger.error(
                f"Erreur lors du batch embedding: {str(e)}",
                exc_info=True,
                count=len(cleaned_texts)
            )
            raise
    
    def embed_chunks(
        self, 
        chunks: List[str],
        batch_size: int = 100
    ) -> List[List[float]]:
        """
        Génère des embeddings pour de nombreux chunks par batches
        
        Args:
            chunks: Liste de chunks de texte
            batch_size: Taille des batches (max 100 pour OpenAI)
            
        Returns:
            List[List[float]]: Liste de vecteurs d'embedding
        """
        all_embeddings = []
        
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i + batch_size]
            embeddings = self.embed_batch(batch)
            all_embeddings.extend(embeddings)
            
            logger.debug(
                f"Batch {i // batch_size + 1} processed",
                progress=f"{min(i + batch_size, len(chunks))}/{len(chunks)}"
            )
        
        return all_embeddings
    
    def similarity(
        self, 
        embedding1: List[float], 
        embedding2: List[float]
    ) -> float:
        """
        Calcule la similarité cosinus entre deux embeddings
        
        Args:
            embedding1: Premier vecteur
            embedding2: Second vecteur
            
        Returns:
            float: Score de similarité entre 0 et 1
        """
        import numpy as np
        
        vec1 = np.array(embedding1)
        vec2 = np.array(embedding2)
        
        # Similarité cosinus
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
            
        return float(dot_product / (norm1 * norm2))


# Instance globale du service
_embedding_service: Optional[EmbeddingService] = None


def get_embedding_service() -> EmbeddingService:
    """
    Récupère l'instance globale du service d'embeddings
    
    Returns:
        EmbeddingService: Instance du service
    """
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService()
    return _embedding_service


def embed_text(text: str) -> List[float]:
    """
    Fonction utilitaire pour générer un embedding
    
    Args:
        text: Texte à vectoriser
        
    Returns:
        List[float]: Vecteur d'embedding
    """
    return get_embedding_service().embed(text)


def embed_texts(texts: List[str]) -> List[List[float]]:
    """
    Fonction utilitaire pour générer des embeddings en batch
    
    Args:
        texts: Liste de textes
        
    Returns:
        List[List[float]]: Liste de vecteurs
    """
    return get_embedding_service().embed_batch(texts)
