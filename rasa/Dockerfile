# ============================================================================
# DOCKERFILE RASA SERVER
# Image Docker pour le serveur Rasa NLU + Core
# ============================================================================

# Image de base Rasa officielle
FROM rasa/rasa:3.6.15-full

# Métadonnées
LABEL maintainer="Sofrecom Team"
LABEL description="Rasa Server pour Chatbot Hybride"
LABEL version="1.0.0"

# Variables d'environnement
ENV RASA_HOME=/app
ENV RASA_MODEL_SERVER=http://localhost:5005

# Répertoire de travail
WORKDIR ${RASA_HOME}

# Copier les fichiers de configuration
COPY config.yml ${RASA_HOME}/config.yml
COPY domain.yml ${RASA_HOME}/domain.yml
COPY credentials.yml ${RASA_HOME}/credentials.yml
COPY endpoints.yml ${RASA_HOME}/endpoints.yml

# Copier les données d'entraînement
COPY data/ ${RASA_HOME}/data/

# Copier les tests
COPY tests/ ${RASA_HOME}/tests/

# Créer le répertoire pour les modèles
RUN mkdir -p ${RASA_HOME}/models

# Installation de dépendances supplémentaires si nécessaire
USER root
RUN pip install --no-cache-dir \
    spacy==3.7.2

# Télécharger le modèle SpaCy français
RUN python -m spacy download fr_core_news_md

# Revenir à l'utilisateur rasa pour la sécurité
USER 1001

# Port exposé
EXPOSE 5005

# Volume pour les modèles entraînés
VOLUME ["${RASA_HOME}/models"]

# Commande par défaut : démarrer le serveur Rasa
# Pour l'entraînement, utiliser : docker run ... rasa train
CMD ["run", "--enable-api", "--cors", "*", "--debug"]

# ============================================================================
# INSTRUCTIONS D'UTILISATION
# ============================================================================
# 
# Construction de l'image :
#   docker build -t sofrecom-rasa:latest .
#
# Entraînement du modèle :
#   docker run -v $(pwd)/models:/app/models sofrecom-rasa:latest train
#
# Démarrage du serveur :
#   docker run -p 5005:5005 -v $(pwd)/models:/app/models sofrecom-rasa:latest
#
# Tests :
#   docker run sofrecom-rasa:latest test
# ============================================================================
