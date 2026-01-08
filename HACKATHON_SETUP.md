# 🚀 Hackathon Setup Guide

## Quick Start (5 Minutes)

### Prerequisites
- Python 3.11+ installed
- Node.js 18+ installed
- npm or yarn installed

### Step 1: Backend Setup

**Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python init_models.py
python start.py
```

**Linux/Mac:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
python3 -m pip install --upgrade pip
pip install -r requirements.txt
python3 init_models.py
python3 start.py
```

**⚠️ IMPORTANT:** 
- Make sure you see `(venv)` in your prompt
- Upgrade pip BEFORE installing requirements
- If TensorFlow installation fails, install it separately: `pip install tensorflow`

Backend will start at: **http://localhost:8000**
API Docs: **http://localhost:8000/docs**

### Step 2: Frontend Setup

**Open a NEW terminal:**

**Windows:**
```bash
cd frontend
npm install
npm run dev
```

**Linux/Mac:**
```bash
cd frontend
npm install
npm run dev
```

Frontend will start at: **http://localhost:3000**

## 🎯 Demo Flow for Hackathon

### 1. **Breed Identification Demo**
- Go to "Breed ID" page
- Click "Capture Photo" or "Upload Image"
- Upload a cattle/buffalo image
- Show the prediction with trust score
- Explain the Grad-CAM heatmap

### 2. **Health Risk Assessment Demo**
- Go to "Risk Assessment" page
- Upload an image
- Show risk level (Low/Medium/High)
- Explain visual cues detected
- Show trust score breakdown

### 3. **AI Advisor Demo**
- Go to "AI Advisor" page
- Ask a question like: "How much water does a Gir cow need?"
- Show multilingual support (switch language)
- Show source attribution

### 4. **Offline-First Demo**
- Disconnect internet
- Try to make a prediction
- Show "Request queued" message
- Reconnect internet
- Show automatic queue processing

### 5. **Trust Score Explanation**
- Show how trust score is calculated
- Explain 3 components:
  - Model Confidence (30%)
  - Regional Validity (40%)
  - Community Feedback (30%)

## 📊 Key Features to Highlight

1. **Offline-First**: Works without internet
2. **Multilingual**: 5 Indian languages
3. **Explainable AI**: Grad-CAM heatmaps
4. **Trust Scores**: Transparent predictions
5. **Non-Diagnostic**: Ethical AI approach
6. **PWA**: Installable as mobile app

## 🐛 Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.11+)
- Check if port 8000 is free
- Install dependencies: `pip install -r requirements.txt`

### Frontend won't start
- Check Node version: `node --version` (need 18+)
- Delete `node_modules` and run `npm install` again
- Check if port 3000 is free

### Models not loading
- Run `python init_models.py` in backend directory
- Check `ml_pipeline/models/` directory exists

### CORS errors
- Make sure backend is running on port 8000
- Check `backend/app/core/config.py` for allowed origins

## 🎤 Presentation Tips

1. **Start with Problem**: Rural farmers need AI tools
2. **Show Solution**: Offline-first, multilingual platform
3. **Demo Live**: Use actual images if possible
4. **Highlight Ethics**: Non-diagnostic, trust scores
5. **Show Offline**: Disconnect and show queue working
6. **End with Impact**: Nationwide rollout potential

## 📝 Quick Commands

```bash
# Backend
cd backend && python start.py

# Frontend  
cd frontend && npm run dev

# Check API
curl http://localhost:8000/health

# View API Docs
# Open http://localhost:8000/docs in browser
```

## ✅ Pre-Demo Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Models initialized (check ml_pipeline/models/)
- [ ] Test breed prediction works
- [ ] Test risk assessment works
- [ ] Test AI advisor works
- [ ] Test offline queue (disconnect internet)
- [ ] Test language switching
- [ ] Have sample images ready

## 🎬 Demo Script

1. **Introduction** (30 sec)
   - "This is a nationwide AI platform for Indian dairy farmers"

2. **Breed ID Demo** (1 min)
   - Upload image → Show prediction → Explain trust score

3. **Risk Assessment** (1 min)
   - Upload image → Show risk level → Explain visual cues

4. **AI Advisor** (1 min)
   - Ask question → Show answer → Switch language

5. **Offline Demo** (30 sec)
   - Disconnect → Queue request → Reconnect → Process

6. **Closing** (30 sec)
   - Impact, scalability, ethics

**Total: ~5 minutes**

Good luck! 🚀

