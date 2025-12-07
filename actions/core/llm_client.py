# ============================================================================
# LLM CLIENT - Client OpenAI pour la génération de réponses
# ============================================================================

"""
Client LLM pour l'intégration OpenAI
Gère les appels à GPT-4 pour la génération de réponses
"""

import time
from typing import List, Dict, Any, Optional
from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.config import config
from utils.logger import logger


class LLMClient:
    """Client pour l'API OpenAI GPT-4"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or config.openai.api_key
        self.model = config.openai.model
        self.max_tokens = config.openai.max_tokens
        self.temperature = config.openai.temperature
        self.client = OpenAI(api_key=self.api_key)
        logger.info("LLMClient initialized", model=self.model)
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    def generate(self, messages: List[Dict[str, str]], max_tokens: Optional[int] = None, 
                 temperature: Optional[float] = None, stop: Optional[List[str]] = None) -> str:
        start_time = time.time()
        try:
            response = self.client.chat.completions.create(
                model=self.model, messages=messages,
                max_tokens=max_tokens or self.max_tokens,
                temperature=temperature if temperature is not None else self.temperature,
                stop=stop
            )
            content = response.choices[0].message.content
            duration_ms = (time.time() - start_time) * 1000
            logger.info("LLM response generated", model=self.model, duration_ms=round(duration_ms, 2))
            return content or ""
        except Exception as e:
            logger.error(f"Erreur LLM: {str(e)}", exc_info=True)
            raise
    
    def chat(self, prompt: str, system_prompt: Optional[str] = None, 
             history: Optional[List[Dict[str, str]]] = None, **kwargs) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        if history:
            messages.extend(history)
        messages.append({"role": "user", "content": prompt})
        return self.generate(messages, **kwargs)
    
    def generate_with_context(self, query: str, context: str, 
                               system_prompt: Optional[str] = None) -> str:
        default_system = """Tu es un assistant Sofrecom. Réponds UNIQUEMENT avec le contexte fourni.
Si l'info n'est pas dans le contexte, dis: "Je n'ai pas trouvé cette information."
Règles: français, concis, précis, ne jamais inventer."""
        
        user_msg = f"CONTEXTE:\n{context}\n\nQUESTION: {query}\n\nRéponds en utilisant le contexte."
        messages = [
            {"role": "system", "content": system_prompt or default_system},
            {"role": "user", "content": user_msg}
        ]
        return self.generate(messages)


_llm_client: Optional[LLMClient] = None

def get_llm_client() -> LLMClient:
    global _llm_client
    if _llm_client is None:
        _llm_client = LLMClient()
    return _llm_client

llm_client = get_llm_client
