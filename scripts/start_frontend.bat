@echo off
REM Start Frontend Development Server (Windows)
REM Usage: scripts\start_frontend.bat

cd /d "%~dp0\.."

echo 🚀 Starting Livestock AI Platform Frontend...
echo.

REM Check if node_modules exists
if not exist "frontend\node_modules" (
    echo 📦 Installing dependencies...
    cd frontend
    call npm install
    cd ..
)

REM Start the dev server
echo 🌐 Starting Vite development server...
cd frontend
call npm run dev

pause
