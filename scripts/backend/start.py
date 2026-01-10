#!/usr/bin/env python3
"""
Startup script for Livestock AI Platform Backend
Production-ready FastAPI server with auto-reload
"""

import os
import sys
import uvicorn
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent.parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

# Set environment variables
os.environ.setdefault("DEBUG", "True")

if __name__ == "__main__":
    print("🚀 Starting Livestock AI Platform Backend...")
    print("📡 API will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("=" * 50)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_includes=["*.py"],
        log_level="info",
        reload_excludes=["*.pyc", "__pycache__", "*.pyo"]
    )
