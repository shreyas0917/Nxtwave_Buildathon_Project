# 🚀 Quick Start Guide

## How to Run Frontend and Backend

Follow these steps to run both the frontend and backend servers.

---

## 📋 Prerequisites

1. **Python 3.8+** installed
2. **Node.js 16+** and **npm** installed
3. **Virtual environment** activated (for backend)

---

## 🔧 Backend Setup & Run

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Activate Virtual Environment

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (Git Bash/MINGW64):**
```bash
source venv/Scripts/activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### Step 3: Install Dependencies (if not already installed)
```bash
pip install -r requirements.txt
```

### Step 4: Start Backend Server
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Alternative (without auto-reload):**
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --no-reload
```

### ✅ Backend Running
- **API URL:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [...]
INFO:     Started server process [...]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

---

## 🎨 Frontend Setup & Run

### Step 1: Open a NEW Terminal Window/Tab

**Keep the backend running in the first terminal**, then open a second terminal for the frontend.

### Step 2: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 3: Install Dependencies (if not already installed)
```bash
npm install
```

### Step 4: Start Frontend Development Server
```bash
npm run dev
```

### ✅ Frontend Running
- **Frontend URL:** http://localhost:3000 (or 3001, 3002 if 3000 is busy)
- **Network URL:** http://192.168.x.x:3000 (accessible from other devices)

You should see:
```
  VITE v5.4.19  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

---

## 🔄 Running Both Together

### Option 1: Two Separate Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/Scripts/activate  # or .\venv\Scripts\Activate.ps1 on PowerShell
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Background Process (Windows PowerShell)

**Start Backend in Background:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
```

**Then start Frontend:**
```powershell
cd frontend
npm run dev
```

---

## ✅ Verify Everything is Running

### 1. Check Backend Health
Open in browser or use curl:
```
http://localhost:8000/health
```
Should return: `{"status": "healthy", "service": "livestock-ai-platform"}`

### 2. Check API Documentation
Open in browser:
```
http://localhost:8000/docs
```
Should show Swagger/OpenAPI documentation

### 3. Check Frontend
Open in browser:
```
http://localhost:3000
```
Should show the frontend application

---

## 🛑 Stopping the Servers

### Stop Backend:
Press `CTRL + C` in the backend terminal

### Stop Frontend:
Press `CTRL + C` in the frontend terminal

---

## 🔧 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Kill the process using port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use a different port
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

**Import errors:**
- Make sure virtual environment is activated
- Install dependencies: `pip install -r requirements.txt`

**TensorFlow warnings:**
- These are normal and can be ignored
- The backend still works fine

### Frontend Issues

**Port 3000 already in use:**
- Vite will automatically try 3001, 3002, etc.
- Check the terminal output for the actual port

**Module not found errors:**
- Install dependencies: `npm install`

**CSS errors:**
- Should be fixed now (import statements moved to top)

---

## 📝 Quick Reference

| Service | Port | URL | Command |
|---------|------|-----|---------|
| Backend API | 8000 | http://localhost:8000 | `python -m uvicorn app.main:app --reload` |
| Backend Docs | 8000 | http://localhost:8000/docs | (Same as API) |
| Frontend | 3000 | http://localhost:3000 | `npm run dev` |

---

## 🎯 Summary

1. **Backend:** `cd backend` → activate venv → `python -m uvicorn app.main:app --reload`
2. **Frontend:** `cd frontend` → `npm run dev`
3. **Access:** Frontend at http://localhost:3000, Backend API at http://localhost:8000

That's it! Both services should now be running. 🚀
