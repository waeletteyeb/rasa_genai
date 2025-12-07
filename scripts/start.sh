#!/bin/bash
# ============================================================================
# SCRIPT - Démarrage rapide de tous les services
# ============================================================================

set -e

echo "🚀 Starting Sofrecom Chatbot..."

# Check for .env
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env with your OpenAI API key"
    exit 1
fi

# Check for OpenAI key
if grep -q "your-openai-api-key-here" .env; then
    echo "❌ Please set your OpenAI API key in .env"
    exit 1
fi

# Start services
echo "🐳 Starting Docker containers..."
docker-compose up -d

echo ""
echo "✅ All services started!"
echo ""
echo "📊 Dashboard:      http://localhost"
echo "🔌 Backend API:    http://localhost:3001"
echo "🤖 Rasa Server:    http://localhost:5005"
echo "⚡ Action Server:  http://localhost:5055"
echo "🗄️  MongoDB:        localhost:27017"
echo ""
echo "📋 View logs: docker-compose logs -f"
echo "🛑 Stop: docker-compose down"
