@echo off
REM Start Backend Server (Windows)
REM Usage: scripts\start_backend.bat

cd /d "%~dp0\.."

echo 🚀 Starting Livestock AI Platform Backend...
echo.

REM Check if virtual environment exists
if exist "backend\venv\Scripts\activate.bat" (
    echo 📦 Activating virtual environment...
    call backend\venv\Scripts\activate.bat
) else if exist "venv\Scripts\activate.bat" (
    echo 📦 Activating virtual environment...
    call venv\Scripts\activate.bat
)

REM Check if models are initialized
if not exist "backend\ml_pipeline\models\breed_classifier.h5" (
    echo 🔧 Initializing models...
    python scripts\backend\init_models.py
)

REM Start the server
echo 🌐 Starting FastAPI server...
python scripts\backend\start.py

pause
