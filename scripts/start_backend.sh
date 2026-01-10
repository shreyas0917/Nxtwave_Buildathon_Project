#!/bin/bash
# Start Backend Server
# Usage: ./scripts/start_backend.sh

cd "$(dirname "$0")/.." || exit 1

echo "🚀 Starting Livestock AI Platform Backend..."
echo ""

# Check if virtual environment exists
if [ -d "backend/venv" ]; then
    echo "📦 Activating virtual environment..."
    source backend/venv/bin/activate
elif [ -d "venv" ]; then
    echo "📦 Activating virtual environment..."
    source venv/bin/activate
fi

# Check if models are initialized
if [ ! -f "backend/ml_pipeline/models/breed_classifier.h5" ]; then
    echo "🔧 Initializing models..."
    python3 scripts/backend/init_models.py
fi

# Start the server
echo "🌐 Starting FastAPI server..."
python3 scripts/backend/start.py
