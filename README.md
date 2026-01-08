# 🐄 Nationwide Livestock AI Platform (India)

**Production-grade, offline-first AI platform for Indian dairy cooperatives**

## 🎯 System Overview

An ethical, explainable AI system that:
- Identifies Indian cattle & buffalo breeds from photos
- Flags non-diagnostic health risk levels (Low/Medium/High)
- Provides localized, multilingual care guidance
- Works offline-first for rural connectivity
- Uses only free & open-source models
- **Explicitly does NOT replace veterinarians**

## 🚀 Quick Start (Hackathon)

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup (Terminal 1)

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
python init_models.py
python start.py
```

Backend runs at: **http://localhost:8000**
API Docs: **http://localhost:8000/docs**

### Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

### One-Command Start (Windows)

```bash
# Backend
start_backend.bat

# Frontend (in new terminal)
start_frontend.bat
```

### One-Command Start (Linux/Mac)

```bash
# Backend
chmod +x start_backend.sh
./start_backend.sh

# Frontend (in new terminal)
chmod +x start_frontend.sh
./start_frontend.sh
```

## 📁 Project Structure

```
livestock-ai-platform/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── models/         # ML models
│   │   ├── services/       # Business logic
│   │   ├── schemas/        # Pydantic schemas
│   │   └── core/           # Configuration
│   ├── ml_pipeline/        # Training scripts
│   ├── data/               # Metadata & knowledge base
│   ├── start.py            # Startup script
│   └── init_models.py      # Initialize models
├── frontend/               # React PWA
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   └── i18n/          # Translations
│   └── package.json
├── docs/                   # Documentation
└── README.md
```

## 🎯 Key Features

### 1. Breed Identification
- MobileNetV3-based CNN
- 20+ Indian breeds
- Grad-CAM explainability
- Trust scores

### 2. Health Risk Assessment
- Non-diagnostic risk levels
- Visual cue detection
- Hybrid heuristic + CNN
- Explainable predictions

### 3. AI Advisor (RAG)
- Multilingual support
- Knowledge base retrieval
- Context-aware answers
- Source attribution

### 4. Offline-First PWA
- Service Worker caching
- IndexedDB queue
- Automatic sync
- Installable app

### 5. Trust Score System
- Model Confidence (30%)
- Regional Validity (40%)
- Community Feedback (30%)

## 📊 API Endpoints

- `POST /api/v1/predict-breed` - Identify breed
- `POST /api/v1/predict-risk` - Assess health risk
- `POST /api/v1/ask-advisor` - Get AI guidance
- `POST /api/v1/submit-feedback` - Submit feedback
- `GET /api/v1/health-trends` - Get regional trends

Full API docs: http://localhost:8000/docs

## 🔐 Ethics & Safety

- ✅ **Non-diagnostic**: No disease names, only risk levels
- ✅ **Privacy-preserving**: No personal data, no GPS
- ✅ **Transparent**: Trust scores and explainability
- ✅ **Farmer-owned**: All data owned by farmer
- ✅ **Veterinarian-first**: Always recommends vet consultation

## 🛠️ Development

### Backend
```bash
cd backend
python start.py  # Starts with auto-reload
```

### Frontend
```bash
cd frontend
npm run dev  # Starts Vite dev server
```

### Training Models
```bash
# Breed Classifier
cd backend/ml_pipeline
python train_breed_classifier.py --data_dir /path/to/data --output_dir models

# Risk Assessor
python train_risk_assessor.py --data_dir /path/to/data --output_dir models
```

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Trust Score System](./docs/TRUST_SCORE.md)
- [Ethics & Safety](./docs/ETHICS.md)
- [Hackathon Setup](./HACKATHON_SETUP.md)

## 🎤 Hackathon Demo

See [HACKATHON_SETUP.md](./HACKATHON_SETUP.md) for:
- Quick setup guide
- Demo flow
- Presentation tips
- Troubleshooting

## 🐛 Troubleshooting

### Backend Issues
- **Port 8000 in use**: Change port in `start.py`
- **Models not found**: Run `python init_models.py`
- **Import errors**: Check `pip install -r requirements.txt`

### Frontend Issues
- **Port 3000 in use**: Change in `vite.config.js`
- **CORS errors**: Check backend is running
- **Build errors**: Delete `node_modules` and reinstall

## 🔒 Production Deployment

### Environment Setup
1. Copy `backend/.env.example` to `backend/.env`
2. Update configuration values
3. Set `DEBUG=False` for production
4. Configure production domains in `ALLOWED_ORIGINS`

### Security Checklist
- ✅ Input validation on all endpoints
- ✅ File size and type validation
- ✅ CORS properly configured
- ✅ Error messages sanitized
- ✅ Structured logging
- ✅ Request ID tracking
- ✅ Health check endpoint

See [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for full deployment guide.

## 📝 License

MIT License - Open source for public good

## 🤝 Contributing

This is a production-grade system ready for:
- National rollout
- Government deployment
- Dairy cooperative integration
- Research collaboration

---

**Built with**: FastAPI, React, TensorFlow
**Status**: ✅ Production-ready
**Deployment**: Ready for pilot → district → state → national rollout
**Security**: ✅ Hardened with input validation, logging, and error handling
