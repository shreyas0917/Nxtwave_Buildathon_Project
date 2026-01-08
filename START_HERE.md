# 🚀 START HERE - Hackathon Quick Guide

## ⚡ Get Running in 5 Minutes

### Step 1: Backend (Terminal 1)

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# OR
source venv/bin/activate       # Linux/Mac

pip install -r requirements.txt
python init_models.py
python start.py
```

✅ Backend: http://localhost:8000
✅ API Docs: http://localhost:8000/docs

### Step 2: Frontend (Terminal 2 - NEW TERMINAL)

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend: http://localhost:3000

---

## 🎯 What You Built

✅ **Breed Identification** - Identify 20+ Indian cattle/buffalo breeds
✅ **Health Risk Assessment** - Non-diagnostic risk levels (Low/Medium/High)
✅ **AI Advisor** - Multilingual care guidance with RAG
✅ **Trust Scores** - Transparent prediction confidence
✅ **Offline-First** - Works without internet
✅ **PWA** - Installable mobile app
✅ **Explainable AI** - Grad-CAM heatmaps

---

## 📚 Key Files

- **README.md** - Full project documentation
- **HACKATHON_SETUP.md** - Detailed setup guide
- **DEMO_SCRIPT.md** - 5-minute presentation script
- **QUICK_START.txt** - Quick reference

---

## 🎤 Demo Flow

1. **Breed ID** (1 min) - Upload image → Show prediction + trust score
2. **Risk Assessment** (1 min) - Upload image → Show risk level + visual cues
3. **AI Advisor** (1 min) - Ask question → Show answer → Switch language
4. **Offline Demo** (30 sec) - Disconnect → Queue → Reconnect → Process
5. **Trust Score** (30 sec) - Explain 3-component formula

**Total: 5 minutes**

---

## 🐛 Quick Fixes

**Backend won't start?**
- Check Python 3.11+ installed
- Run `python init_models.py` first
- Check port 8000 is free

**Frontend won't start?**
- Check Node.js 18+ installed
- Delete `node_modules`, run `npm install` again
- Check port 3000 is free

**CORS errors?**
- Make sure backend is running first
- Check `backend/app/core/config.py` for allowed origins

---

## ✅ Pre-Demo Checklist

- [ ] Backend running (http://localhost:8000)
- [ ] Frontend running (http://localhost:3000)
- [ ] Test breed prediction
- [ ] Test risk assessment
- [ ] Test AI advisor
- [ ] Test offline mode
- [ ] Have sample images ready

---

## 🎯 Key Points to Emphasize

1. **Offline-First** - Critical for rural connectivity
2. **Ethical AI** - Non-diagnostic, transparent, privacy-preserving
3. **Multilingual** - 5 Indian languages
4. **Explainable** - Grad-CAM heatmaps
5. **Production-Ready** - Scalable architecture
6. **Real Impact** - Helps millions of farmers

---

## 📞 Need Help?

- Check `HACKATHON_SETUP.md` for detailed troubleshooting
- Check `DEMO_SCRIPT.md` for presentation tips
- Check API docs at http://localhost:8000/docs

---

**You're ready! Good luck with your hackathon! 🚀**

