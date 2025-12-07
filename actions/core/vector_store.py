# ============================================================================
# VECTOR STORE - Gestion ChromaDB pour la recherche sémantique
# ============================================================================

"""
Module de gestion du Vector Store avec ChromaDB
Stocke et recherche les documents par similarité sémantique
"""

import os
import time
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
import chromadb
from chromadb.config import Settings

import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.config import config
from utils.logger import logger
from core.embeddings import get_embedding_service


@dataclass
class SearchResult:
    """Résultat de recherche vectorielle"""
    id: str
    content: str
    metadata: Dict[str, Any]
    score: float  # Distance (plus petit = plus proche)
    relevance: float  # Score de pertinence normalisé (0-1)


class VectorStore:
    """
    Gestionnaire du Vector Store ChromaDB
    
    Fournit des méthodes pour :
    - Stocker des documents avec leurs embeddings
    - Rechercher par similarité sémantique
    - Gérer les métadonnées
    """
    
    def __init__(
        self,
        persist_directory: Optional[str] = None,
        collection_name: Optional[str] = None
    ):
        """
        Initialise le Vector Store
        
        Args:
            persist_directory: Répertoire de persistance
            collection_name: Nom de la collection
        """
        self.persist_directory = persist_directory or config.chromadb.persist_directory
        self.collection_name = collection_name or config.chromadb.collection_name
        
        # S'assurer que le répertoire existe
        os.makedirs(self.persist_directory, exist_ok=True)
        
        # Initialiser ChromaDB avec persistance
        self.client = chromadb.Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory=self.persist_directory
        ))
        
        # Récupérer ou créer la collection
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": config.chromadb.distance_function}
        )
        
        # Service d'embeddings
        self.embedding_service = get_embedding_service()
        
        logger.info(
            "VectorStore initialized",
            persist_directory=self.persist_directory,
            collection=self.collection_name,
            document_count=self.collection.count()
        )
    
    def add_document(
        self,
        doc_id: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Ajoute un document au vector store
        
        Args:
            doc_id: ID unique du document
            content: Contenu textuel
            metadata: Métadonnées optionnelles
        """
        try:
            # Générer l'embedding
            embedding = self.embedding_service.embed(content)
            
            # Ajouter à la collection
            self.collection.add(
                ids=[doc_id],
                embeddings=[embedding],
                documents=[content],
                metadatas=[metadata or {}]
            )
            
            logger.info(
                f"Document added: {doc_id}",
                content_length=len(content),
                has_metadata=metadata is not None
            )
            
        except Exception as e:
            logger.error(
                f"Erreur lors de l'ajout du document {doc_id}: {str(e)}",
                exc_info=True
            )
            raise
    
    def add_documents(
        self,
        documents: List[Dict[str, Any]]
    ) -> int:
        """
        Ajoute plusieurs documents en batch
        
        Args:
            documents: Liste de dicts avec keys: id, content, metadata
            
        Returns:
            int: Nombre de documents ajoutés
        """
        if not documents:
            return 0
        
        try:
            ids = [doc["id"] for doc in documents]
            contents = [doc["content"] for doc in documents]
            metadatas = [doc.get("metadata", {}) for doc in documents]
            
            # Générer les embeddings en batch
            embeddings = self.embedding_service.embed_chunks(contents)
            
            # Ajouter à la collection
            self.collection.add(
                ids=ids,
                embeddings=embeddings,
                documents=contents,
                metadatas=metadatas
            )
            
            logger.info(
                f"Batch documents added: {len(documents)}",
                total_count=self.collection.count()
            )
            
            return len(documents)
            
        except Exception as e:
            logger.error(
                f"Erreur lors de l'ajout batch: {str(e)}",
                exc_info=True,
                count=len(documents)
            )
            raise
    
    def search(
        self,
        query: str,
        top_k: int = 5,
        filter_metadata: Optional[Dict[str, Any]] = None,
        min_relevance: Optional[float] = None
    ) -> List[SearchResult]:
        """
        Recherche les documents les plus similaires à la requête
        
        Args:
            query: Requête de recherche
            top_k: Nombre de résultats à retourner
            filter_metadata: Filtre sur les métadonnées
            min_relevance: Score minimum de pertinence (0-1)
            
        Returns:
            List[SearchResult]: Résultats ordonnés par pertinence
        """
        if not query or not query.strip():
            logger.warning("Requête de recherche vide")
            return []
        
        start_time = time.time()
        min_relevance = min_relevance or config.rag.min_relevance_score
        
        try:
            # Générer l'embedding de la requête
            query_embedding = self.embedding_service.embed(query)
            
            # Rechercher dans ChromaDB
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                where=filter_metadata,
                include=["documents", "metadatas", "distances"]
            )
            
            # Construire les résultats
            search_results = []
            
            if results["ids"] and results["ids"][0]:
                for i, doc_id in enumerate(results["ids"][0]):
                    distance = results["distances"][0][i]
                    
                    # Convertir distance en score de pertinence (0-1)
                    # Pour cosine distance: relevance = 1 - distance
                    relevance = max(0, 1 - distance)
                    
                    # Filtrer par pertinence minimum
                    if relevance >= min_relevance:
                        search_results.append(SearchResult(
                            id=doc_id,
                            content=results["documents"][0][i],
                            metadata=results["metadatas"][0][i] if results["metadatas"] else {},
                            score=distance,
                            relevance=relevance
                        ))
            
            duration_ms = (time.time() - start_time) * 1000
            
            logger.log_rag_query(
                query=query,
                num_results=len(search_results),
                top_score=search_results[0].relevance if search_results else 0,
                duration_ms=round(duration_ms, 2)
            )
            
            return search_results
            
        except Exception as e:
            logger.error(
                f"Erreur lors de la recherche: {str(e)}",
                exc_info=True,
                query=query[:100]
            )
            return []
    
    def search_with_embedding(
        self,
        embedding: List[float],
        top_k: int = 5,
        filter_metadata: Optional[Dict[str, Any]] = None
    ) -> List[SearchResult]:
        """
        Recherche avec un embedding pré-calculé
        
        Args:
            embedding: Vecteur d'embedding
            top_k: Nombre de résultats
            filter_metadata: Filtre optionnel
            
        Returns:
            List[SearchResult]: Résultats de recherche
        """
        try:
            results = self.collection.query(
                query_embeddings=[embedding],
                n_results=top_k,
                where=filter_metadata,
                include=["documents", "metadatas", "distances"]
            )
            
            search_results = []
            
            if results["ids"] and results["ids"][0]:
                for i, doc_id in enumerate(results["ids"][0]):
                    distance = results["distances"][0][i]
                    relevance = max(0, 1 - distance)
                    
                    search_results.append(SearchResult(
                        id=doc_id,
                        content=results["documents"][0][i],
                        metadata=results["metadatas"][0][i] if results["metadatas"] else {},
                        score=distance,
                        relevance=relevance
                    ))
            
            return search_results
            
        except Exception as e:
            logger.error(f"Erreur recherche par embedding: {str(e)}", exc_info=True)
            return []
    
    def delete_document(self, doc_id: str) -> bool:
        """
        Supprime un document du store
        
        Args:
            doc_id: ID du document à supprimer
            
        Returns:
            bool: True si supprimé avec succès
        """
        try:
            self.collection.delete(ids=[doc_id])
            logger.info(f"Document deleted: {doc_id}")
            return True
        except Exception as e:
            logger.error(f"Erreur suppression {doc_id}: {str(e)}")
            return False
    
    def delete_all(self) -> int:
        """
        Supprime tous les documents
        
        Returns:
            int: Nombre de documents supprimés
        """
        count = self.collection.count()
        
        # Récréer la collection
        self.client.delete_collection(self.collection_name)
        self.collection = self.client.create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": config.chromadb.distance_function}
        )
        
        logger.warning(f"All documents deleted: {count}")
        return count
    
    def get_document(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """
        Récupère un document par son ID
        
        Args:
            doc_id: ID du document
            
        Returns:
            Dict ou None si non trouvé
        """
        try:
            result = self.collection.get(
                ids=[doc_id],
                include=["documents", "metadatas"]
            )
            
            if result["ids"]:
                return {
                    "id": result["ids"][0],
                    "content": result["documents"][0],
                    "metadata": result["metadatas"][0] if result["metadatas"] else {}
                }
            return None
            
        except Exception as e:
            logger.error(f"Erreur get document {doc_id}: {str(e)}")
            return None
    
    def count(self) -> int:
        """Retourne le nombre total de documents"""
        return self.collection.count()
    
    def persist(self) -> None:
        """Persiste les données sur disque"""
        self.client.persist()
        logger.info("Vector store persisted to disk")


# Instance globale
_vector_store: Optional[VectorStore] = None


def get_vector_store() -> VectorStore:
    """
    Récupère l'instance globale du vector store
    
    Returns:
        VectorStore: Instance du store
    """
    global _vector_store
    if _vector_store is None:
        _vector_store = VectorStore()
    return _vector_store


# Alias pour l'import simplifié
vector_store = get_vector_store
