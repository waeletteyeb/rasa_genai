# ============================================================================
# DOCKERFILE ACTION SERVER
# Image Docker pour le serveur d'actions Python
# ============================================================================

FROM python:3.11-slim

LABEL maintainer="Sofrecom Team"
LABEL description="Action Server with LLM + RAG"

# Variables d'environnement
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV APP_HOME=/app

WORKDIR ${APP_HOME}

# Installer les dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copier et installer les dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code
COPY . .

# Créer les répertoires nécessaires
RUN mkdir -p logs chroma_db

# Exposer le port
EXPOSE 5055

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5055/health || exit 1

# Démarrer le serveur d'actions
CMD ["python", "-m", "rasa_sdk", "--actions", "actions", "-p", "5055"]
