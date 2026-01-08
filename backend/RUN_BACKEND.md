# How to Run the Backend

## ⚠️ IMPORTANT: Always use the venv Python!

The backend **MUST** be run using the virtual environment Python to avoid compatibility issues with Python 3.13.

## Method 1: Using PowerShell (Recommended)

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python start.py
```

Or use the provided script:
```powershell
cd backend
.\start.ps1
```

## Method 2: Using Command Prompt

```cmd
cd backend
venv\Scripts\activate.bat
python start.py
```

Or use the provided script:
```cmd
cd backend
start.bat
```

## Method 3: Direct venv Python (Always Works)

```powershell
cd backend
.\venv\Scripts\python.exe start.py
```

## ❌ DO NOT USE:

```powershell
# ❌ This will use global Python and cause errors!
python start.py
```

## Why?

Python 3.13 has stricter rules about parameter names. The global Python installation may have incompatible versions of FastAPI/Pydantic. The venv has the correct, compatible versions.

## Troubleshooting

If you see `ValueError: 'not' is not a valid parameter name`:
1. Make sure you're using the venv Python
2. Check: `.\venv\Scripts\python.exe --version` should show Python 3.13.x
3. Verify FastAPI is from venv: `.\venv\Scripts\python.exe -c "import fastapi; print(fastapi.__file__)"`

