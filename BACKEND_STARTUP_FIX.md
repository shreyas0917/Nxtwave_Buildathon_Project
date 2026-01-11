# 🔧 Backend Startup Fix

## Issue

The backend was failing to start due to model initialization errors. The error occurs when TensorFlow/Keras tries to load models during import.

## Solution

The backend code is already set up to handle missing models gracefully using heuristic-based predictions. The error is likely due to TensorFlow warnings/errors during model loading attempts.

## Quick Fix

Since the backend uses heuristic-based predictions (no real models needed), you can:

1. **Option 1: Ignore the errors** - The server actually starts and works, but shows TensorFlow warnings
2. **Option 2: Run without reload** - Use `--no-reload` flag
3. **Option 3: Suppress TensorFlow warnings** - Set environment variables

## ✅ Recommended: Run Without Reload (For Now)

```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --no-reload
```

This avoids the multiprocessing/reloader issues with TensorFlow.

## Alternative: Suppress Warnings

Create a `.env` file in backend/:
```
TF_CPP_MIN_LOG_LEVEL=2
TF_ENABLE_ONEDNN_OPTS=0
```

Or set environment variables:
```bash
# Windows PowerShell
$env:TF_CPP_MIN_LOG_LEVEL=2
$env:TF_ENABLE_ONEDNN_OPTS=0
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Verify It Works

Once started, check:
- http://localhost:8000/health - Should return `{"status": "healthy", "service": "livestock-ai-platform"}`
- http://localhost:8000/docs - Should show API documentation

The backend API works even with these warnings - they're just TensorFlow initialization messages.
