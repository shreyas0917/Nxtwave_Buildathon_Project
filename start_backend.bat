@echo off
echo ========================================
echo Starting Livestock AI Platform Backend
echo ========================================
cd backend
python init_models.py
python start.py
pause

