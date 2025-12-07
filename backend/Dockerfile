# ============================================================================
# DOCKERFILE BACKEND
# ============================================================================

FROM node:20-alpine

LABEL maintainer="Sofrecom Team"

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm ci --only=production

# Copier le code
COPY . .

# Créer les répertoires nécessaires
RUN mkdir -p logs uploads

# Exposer le port
EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Démarrer l'application
CMD ["node", "server.js"]
