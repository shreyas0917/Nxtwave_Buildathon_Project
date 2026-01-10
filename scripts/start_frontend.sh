#!/bin/bash
# Start Frontend Development Server
# Usage: ./scripts/start_frontend.sh

cd "$(dirname "$0")/.." || exit 1

echo "🚀 Starting Livestock AI Platform Frontend..."
echo ""

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd frontend && npm install && cd ..
fi

# Start the dev server
echo "🌐 Starting Vite development server..."
cd frontend && npm run dev
