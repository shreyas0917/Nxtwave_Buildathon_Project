# Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: "ModuleNotFoundError: No module named 'tensorflow'"

**Solution:**
1. Make sure virtual environment is activated:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

2. Verify you're in the virtual environment (you should see `(venv)` in your prompt)

3. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

### Issue 2: TensorFlow Version Error

**If you see:** `ERROR: Could not find a version that satisfies the requirement tensorflow==2.15.0`

**Solution:**
The requirements.txt has been updated to use `tensorflow>=2.20.0`. Just run:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Issue 3: Backend Won't Start

**Check:**
1. Virtual environment is activated
2. All packages installed: `pip list | findstr tensorflow` (Windows) or `pip list | grep tensorflow` (Linux/Mac)
3. Port 8000 is not in use
4. Models initialized: Run `python init_models.py`

**Start backend:**
```bash
python start.py
```

### Issue 4: Frontend Won't Start

**Check:**
1. Node.js installed: `node --version` (should be 18+)
2. Dependencies installed: `npm install`
3. Port 3000 is not in use

**Start frontend:**
```bash
npm run dev
```

### Issue 5: CORS Errors

**Solution:**
1. Make sure backend is running first
2. Check `backend/app/core/config.py` - `ALLOWED_ORIGINS` should include `http://localhost:3000`
3. Restart backend after changing config

### Issue 6: Models Not Loading

**Solution:**
```bash
cd backend
python init_models.py
```

This creates placeholder models if they don't exist.

### Issue 7: Import Errors

**Solution:**
1. Activate virtual environment
2. Reinstall packages:
   ```bash
   pip install --upgrade -r requirements.txt
   ```

### Issue 8: Keras 3.x Compatibility

**If you see errors about Keras API:**
- TensorFlow 2.20.0 uses Keras 3.x
- The code has been updated to be compatible
- If issues persist, check error messages and update model code

### Issue 9: NumPy Compatibility

**If you see NumPy errors:**
- NumPy 2.x is installed (latest)
- If compatibility issues, you can pin to NumPy 1.x:
  ```bash
  pip install "numpy>=1.26.0,<2.0.0"
  ```

## Quick Diagnostic Commands

### Check Backend Setup
```bash
cd backend
python test_imports.py
```

### Check Frontend Setup
```bash
cd frontend
npm list
```

### Verify Installation
```bash
# Backend
python -c "import tensorflow; print(tensorflow.__version__)"
python -c "import fastapi; print(fastapi.__version__)"

# Frontend
node --version
npm --version
```

## Still Having Issues?

1. **Check Python version:** Should be 3.11 or higher
2. **Check Node version:** Should be 18 or higher
3. **Recreate virtual environment:**
   ```bash
   # Delete old venv
   rm -rf venv  # Linux/Mac
   rmdir /s venv  # Windows
   
   # Create new
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   pip install -r requirements.txt
   ```

4. **Check for conflicting packages:**
   ```bash
   pip list
   ```

5. **Clear pip cache:**
   ```bash
   pip cache purge
   pip install -r requirements.txt
   ```

## Getting Help

- Check error messages carefully
- Run `python test_imports.py` to see which imports fail
- Check the terminal output for specific error messages
- Verify all prerequisites are installed

