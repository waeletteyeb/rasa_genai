# ============================================================================
# SCRIPTS - Ingestion de documents pour le RAG
# ============================================================================

"""
Script d'ingestion de documents PDF/TXT dans le vector store ChromaDB
Usage: python ingest_documents.py --path /path/to/documents
"""

import os
import sys
import argparse
from pathlib import Path

# Ajouter le chemin du projet
sys.path.insert(0, str(Path(__file__).parent.parent / "actions"))

from core.vector_store import VectorStore
from core.embeddings import EmbeddingService
from utils.logger import logger

try:
    import pypdf
    from pypdf import PdfReader
except ImportError:
    pypdf = None
    logger.warning("pypdf not installed, PDF support disabled")


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list:
    """Divise le texte en chunks avec overlap"""
    chunks = []
    start = 0
    
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunk = text[start:end]
        
        # Essayer de couper à une phrase
        if end < len(text):
            last_period = chunk.rfind('.')
            if last_period > chunk_size // 2:
                end = start + last_period + 1
                chunk = text[start:end]
        
        chunks.append(chunk.strip())
        start = end - overlap
        
        if start >= len(text):
            break
    
    return [c for c in chunks if c]


def extract_pdf_text(file_path: str) -> str:
    """Extrait le texte d'un PDF"""
    if pypdf is None:
        raise ImportError("pypdf is required for PDF processing")
    
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text


def extract_text(file_path: str) -> str:
    """Extrait le texte d'un fichier"""
    path = Path(file_path)
    
    if path.suffix.lower() == '.pdf':
        return extract_pdf_text(file_path)
    elif path.suffix.lower() in ['.txt', '.md']:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    else:
        raise ValueError(f"Unsupported file type: {path.suffix}")


def ingest_file(file_path: str, vector_store: VectorStore, chunk_size: int = 1000):
    """Ingère un fichier dans le vector store"""
    path = Path(file_path)
    logger.info(f"Processing: {path.name}")
    
    try:
        # Extraire le texte
        text = extract_text(file_path)
        
        # Chunker
        chunks = chunk_text(text, chunk_size=chunk_size)
        logger.info(f"Created {len(chunks)} chunks")
        
        # Préparer les documents
        documents = []
        for i, chunk in enumerate(chunks):
            doc_id = f"{path.stem}_{i}"
            documents.append({
                "id": doc_id,
                "content": chunk,
                "metadata": {
                    "source": path.name,
                    "chunk_index": i,
                    "total_chunks": len(chunks)
                }
            })
        
        # Indexer
        vector_store.add_documents(documents)
        logger.info(f"Indexed {len(documents)} documents from {path.name}")
        
        return len(documents)
        
    except Exception as e:
        logger.error(f"Error processing {path.name}: {e}")
        return 0


def ingest_directory(directory: str, vector_store: VectorStore, chunk_size: int = 1000):
    """Ingère tous les fichiers d'un répertoire"""
    path = Path(directory)
    total = 0
    
    for file_path in path.glob("**/*"):
        if file_path.suffix.lower() in ['.pdf', '.txt', '.md']:
            total += ingest_file(str(file_path), vector_store, chunk_size)
    
    return total


def main():
    parser = argparse.ArgumentParser(description="Ingest documents into ChromaDB")
    parser.add_argument("--path", required=True, help="Path to file or directory")
    parser.add_argument("--chunk-size", type=int, default=1000, help="Chunk size")
    parser.add_argument("--clear", action="store_true", help="Clear existing data")
    
    args = parser.parse_args()
    
    # Initialiser le vector store
    vector_store = VectorStore()
    
    if args.clear:
        logger.warning("Clearing all existing documents...")
        vector_store.delete_all()
    
    path = Path(args.path)
    
    if path.is_file():
        total = ingest_file(args.path, vector_store, args.chunk_size)
    elif path.is_dir():
        total = ingest_directory(args.path, vector_store, args.chunk_size)
    else:
        logger.error(f"Path not found: {args.path}")
        sys.exit(1)
    
    # Persister
    vector_store.persist()
    
    logger.info(f"✅ Ingestion complete! Total documents: {total}")
    logger.info(f"Vector store contains {vector_store.count()} documents")


if __name__ == "__main__":
    main()
