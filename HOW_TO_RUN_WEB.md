# 🌐 How to Run the Web Project

Complete guide to run the Livestock AI Platform web application.

## 📋 Prerequisites

- **Python 3.11+** (for backend)
- **Node.js 18+** (for frontend)
- **npm** (comes with Node.js)

## 🚀 Quick Start (Recommended)

### Option 1: Using Startup Scripts (Easiest!)

**Windows:**

1. **Terminal 1 - Backend:**
   ```bash
   scripts\start_backend.bat
   ```

2. **Terminal 2 - Frontend (open a new terminal):**
   ```bash
   scripts\start_frontend.bat
   ```

**Linux/Mac:**

1. **Terminal 1 - Backend:**
   ```bash
   chmod +x scripts/start_backend.sh
   ./scripts/start_backend.sh
   ```

2. **Terminal 2 - Frontend (open a new terminal):**
   ```bash
   chmod +x scripts/start_frontend.sh
   ./scripts/start_frontend.sh
   ```

---

## 📝 Step-by-Step Manual Setup

### Step 1: Start the Backend (Terminal 1)

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   # Create virtual environment (first time only)
   python -m venv venv
   
   # Activate virtual environment
   # Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   
   # Windows (Command Prompt):
   venv\Scripts\activate.bat
   
   # Linux/Mac:
   source venv/bin/activate
   ```

3. Install dependencies (first time only):
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   **OR** if you have a start script:
   ```bash
   python start.py
   ```

✅ Backend is running at: **http://localhost:8000**  
📚 API Documentation: **http://localhost:8000/docs**

---

### Step 2: Start the Frontend (Terminal 2)

1. Open a **NEW terminal window** (keep backend running)

2. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies (first time only):
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

✅ Frontend is running at: **http://localhost:3000**

---

## 🌐 Access the Application

Once both servers are running:

- **Web Application:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Interactive API Docs:** http://localhost:8000/redoc

---

## 🐳 Alternative: Using Docker (All-in-One)

If you have Docker installed, you can run everything with one command:

```bash
docker-compose up --build
```

This starts both backend and frontend together. Access the app at **http://localhost:3000**

---

## ✅ Verify Everything is Working

1. **Check Backend:**
   - Visit: http://localhost:8000/health
   - Should see: `{"status": "healthy", "service": "livestock-ai-platform"}`

2. **Check Frontend:**
   - Visit: http://localhost:3000
   - Should see the Livestock AI Platform homepage

3. **Check API Docs:**
   - Visit: http://localhost:8000/docs
   - Should see interactive API documentation

---

## 🔧 Troubleshooting

### Backend Issues

**Problem: Port 8000 already in use**
```bash
# Find and kill the process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8000 | xargs kill -9
```

**Problem: Module not found errors**
```bash
# Make sure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

**Problem: Python version issues**
- Ensure you're using Python 3.11+
- Check: `python --version`

### Frontend Issues

**Problem: Port 3000 already in use**
- Vite will automatically try the next available port (3001, 3002, etc.)
- Check the terminal output for the actual port number

**Problem: npm install fails**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem: Frontend can't connect to backend**
- Make sure backend is running on port 8000
- Check `frontend/vite.config.js` has correct proxy settings
- Verify backend CORS settings in `backend/app/core/config.py`

---

## 📦 Production Build

To create a production build of the frontend:

```bash
cd frontend
npm run build
```

This creates an optimized build in the `frontend/dist` directory.

To preview the production build:

```bash
npm run preview
```

---

## 🎯 What's Next?

Once the application is running:

1. **Upload an image** to test Breed Identification
2. **Assess health risks** using the Risk Assessment feature
3. **Ask questions** to the AI Advisor chatbot
4. **View trends** in the Health Trends section
5. **Explore all features** from the navigation menu

---

## 📚 Additional Resources

- **Full Documentation:** See `README.md`
- **API Documentation:** http://localhost:8000/docs
- **Troubleshooting Guide:** See `TROUBLESHOOTING.md`
- **Quick Start:** See `START_HERE_FOR_HACKATHON.md`

---

## 💡 Tips

- Keep both terminals open while developing
- The backend auto-reloads on code changes (--reload flag)
- The frontend also has hot-reload enabled
- Use browser DevTools (F12) to debug frontend issues
- Check terminal output for detailed error messages
