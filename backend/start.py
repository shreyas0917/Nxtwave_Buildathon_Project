#!/usr/bin/env python3
# Use venv Python: .\venv\Scripts\python.exe start.py
"""
Startup script for Livestock AI Platform Backend
"""

import os
import sys
import uvicorn
from pathlib import Path

# Ensure we're using the venv Python
venv_python = Path(__file__).parent / "venv" / "Scripts" / "python.exe"
if venv_python.exists() and sys.executable != str(venv_python):
    print(f"⚠️  Warning: Not using venv Python!")
    print(f"   Current: {sys.executable}")
    print(f"   Expected: {venv_python}")
    print(f"   Switching to venv Python...")
    print()
    # Switch to venv Python if on Windows
    if os.name == 'nt':  # Windows
        try:
            os.execv(str(venv_python), [str(venv_python)] + sys.argv)
        except Exception as e:
            print(f"   ❌ Could not switch to venv Python: {e}")
            print(f"   Please run: .\\venv\\Scripts\\python.exe start.py")
            sys.exit(1)

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Set environment variables
os.environ.setdefault("DEBUG", "True")

if __name__ == "__main__":
    print("🚀 Starting Livestock AI Platform Backend...")
    print("📡 API will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("=" * 50)
    
    # Ensure uvicorn uses the current Python executable (venv)
    # This is critical for reload subprocess to use the correct Python
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_includes=["*.py"],
        log_level="info",
        # Explicitly set the Python executable for reload subprocess
        reload_excludes=["*.pyc", "__pycache__", "*.pyo"]
    )

