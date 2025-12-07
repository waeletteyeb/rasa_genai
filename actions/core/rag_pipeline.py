# ============================================================================
# RAG PIPELINE - Pipeline complet de Retrieval Augmented Generation
# ============================================================================

"""Pipeline RAG combinant recherche vectorielle et génération LLM"""

import time
from typing import List, Dict, Any, Optional
from dataclasses import dataclass

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.config import config
from utils.logger import logger
from core.vector_store import VectorStore, SearchResult, get_vector_store
from core.llm_client import LLMClient, get_llm_client


@dataclass
class RAGResponse:
    """Réponse du pipeline RAG"""
    answer: str
    sources: List[Dict[str, Any]]
    confidence: float
    query: str
    context_used: str
    duration_ms: float


class RAGPipeline:
    """
    Pipeline RAG complet
    1. Recherche vectorielle des documents pertinents
    2. Construction du contexte
    3. Génération de réponse via LLM
    """
    
    def __init__(self):
        self.vector_store = get_vector_store()
        self.llm_client = get_llm_client()
        self.top_k = config.rag.top_k
        self.min_relevance = config.rag.min_relevance_score
        logger.info("RAGPipeline initialized", top_k=self.top_k)
    
    def retrieve(self, query: str, top_k: Optional[int] = None) -> List[SearchResult]:
        """Recherche les documents pertinents"""
        return self.vector_store.search(
            query=query,
            top_k=top_k or self.top_k,
            min_relevance=self.min_relevance
        )
    
    def build_context(self, results: List[SearchResult], max_length: int = 4000) -> str:
        """Construit le contexte à partir des résultats"""
        if not results:
            return ""
        
        context_parts = []
        current_length = 0
        
        for i, result in enumerate(results, 1):
            source = result.metadata.get("source", "Document")
            section = f"[Source {i}: {source}]\n{result.content}\n"
            
            if current_length + len(section) > max_length:
                break
            
            context_parts.append(section)
            current_length += len(section)
        
        return "\n---\n".join(context_parts)
    
    def generate_response(self, query: str, context: str) -> str:
        """Génère une réponse avec le LLM"""
        if not context:
            return "Je n'ai pas trouvé d'information pertinente. Souhaitez-vous parler à un conseiller ?"
        return self.llm_client.generate_with_context(query, context)
    
    def query(self, user_query: str, top_k: Optional[int] = None) -> RAGResponse:
        """Exécute le pipeline RAG complet"""
        start_time = time.time()
        
        # 1. Retrieve
        results = self.retrieve(user_query, top_k)
        
        # 2. Build context
        context = self.build_context(results)
        
        # 3. Generate
        answer = self.generate_response(user_query, context)
        
        # Calculer la confiance moyenne
        avg_confidence = sum(r.relevance for r in results) / len(results) if results else 0
        
        duration_ms = (time.time() - start_time) * 1000
        
        sources = [{"id": r.id, "source": r.metadata.get("source", "Unknown"), 
                    "relevance": r.relevance} for r in results]
        
        logger.log_rag_query(
            query=user_query, num_results=len(results),
            top_score=results[0].relevance if results else 0,
            llm_response=answer, duration_ms=round(duration_ms, 2)
        )
        
        return RAGResponse(
            answer=answer, sources=sources, confidence=avg_confidence,
            query=user_query, context_used=context[:500], duration_ms=duration_ms
        )


_rag_pipeline: Optional[RAGPipeline] = None

def get_rag_pipeline() -> RAGPipeline:
    global _rag_pipeline
    if _rag_pipeline is None:
        _rag_pipeline = RAGPipeline()
    return _rag_pipeline

rag_pipeline = get_rag_pipeline
