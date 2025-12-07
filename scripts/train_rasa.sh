#!/bin/bash
# ============================================================================
# SCRIPT - Entraînement du modèle Rasa
# ============================================================================

set -e

echo "🤖 Training Rasa model..."

cd "$(dirname "$0")/../rasa"

# Validate data
echo "📋 Validating training data..."
rasa data validate

# Train model
echo "🏋️ Training NLU and Core..."
rasa train --fixed-model-name sofrecom-chatbot

echo "✅ Training complete!"
echo "📦 Model saved to: ./models/sofrecom-chatbot.tar.gz"
