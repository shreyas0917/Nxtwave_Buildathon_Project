@echo off
echo ========================================
echo Checking Backend Setup
echo ========================================
echo.

echo Checking Python version...
python --version
echo.

echo Checking if virtual environment is activated...
python -c "import sys; print('Virtual env:', hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix))"
echo.

echo Testing imports...
call python test_imports.py
echo.

echo ========================================
echo If you see errors, make sure to:
echo 1. Activate virtual environment: venv\Scripts\activate
echo 2. Install requirements: pip install -r requirements.txt
echo ========================================
pause

