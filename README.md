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
# Create virtual environment
cd backend
python -m venv venv

# Activate virtual environment
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize models (creates placeholder models if needed)
python ../scripts/backend/init_models.py

# Start server
python ../scripts/backend/start.py
```

Backend runs at: **http://localhost:8000**  
API Docs: **http://localhost:8000/docs**

### Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173** (Vite default port)

### One-Command Start (Recommended)

**Windows:**
```bash
# Backend
scripts\start_backend.bat

# Frontend (in new terminal)
scripts\start_frontend.bat
```

**Linux/Mac:**
```bash
# Backend
chmod +x scripts/start_backend.sh
./scripts/start_backend.sh

# Frontend (in new terminal)
chmod +x scripts/start_frontend.sh
./scripts/start_frontend.sh
```

## 📁 Project Structure

This project follows industry-standard structure for maintainability and scalability.

```
livestock-ai-platform/
├── backend/                    # FastAPI Backend
│   ├── app/                    # Main application
│   │   ├── api/                # API route handlers
│   │   ├── core/               # Configuration & settings
│   │   ├── models/             # ML model implementations
│   │   ├── schemas/            # Pydantic validation schemas
│   │   └── services/           # Business logic layer
│   ├── data/                   # Static data & knowledge base
│   ├── ml_pipeline/            # ML training scripts
│   ├── storage/                # Runtime storage (reports, uploads)
│   └── requirements.txt        # Python dependencies
├── frontend/                   # React PWA Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API client
│   │   ├── utils/              # Utility functions
│   │   ├── i18n/               # Internationalization
│   │   └── sw/                 # Service Worker
│   └── package.json
├── scripts/                     # Utility scripts
│   ├── backend/                # Backend scripts
│   ├── start_backend.sh        # Quick start backend
│   └── start_frontend.sh       # Quick start frontend
├── tests/                       # Test suites
│   ├── backend/                 # Backend tests
│   └── frontend/               # Frontend tests
├── docs/                        # Documentation
├── .env.example                 # Environment template
├── LICENSE                      # MIT License
├── CONTRIBUTING.md              # Contribution guidelines
├── CHANGELOG.md                 # Version history
└── README.md                    # This file
```

**For detailed structure, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**

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

### Backend Development
```bash
# Using the start script (recommended)
python scripts/backend/start.py

# Or using uvicorn directly
cd backend
uvicorn app.main:app --reload --port 8000
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server with hot reload
```

### Training Models
```bash
# Breed Classifier
cd backend/ml_pipeline
python train_breed_classifier.py \
  --data_dir /path/to/breed/dataset \
  --output_dir models \
  --epochs 100 \
  --batch_size 16

# Risk Assessor
python train_risk_assessor.py \
  --data_dir /path/to/risk/dataset \
  --output_dir models \
  --epochs 100 \
  --batch_size 16
```

See [docs/QUICK_START.md](./docs/QUICK_START.md) for detailed training instructions.

## 📚 Documentation

- **[Project Structure](./PROJECT_STRUCTURE.md)** - Detailed directory structure
- **[Architecture](./docs/ARCHITECTURE.md)** - System architecture overview
- **[API Documentation](./docs/API.md)** - Complete API reference
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Trust Score System](./docs/TRUST_SCORE.md)** - Trust score calculation
- **[Ethics & Safety](./docs/ETHICS.md)** - Ethical AI guidelines
- **[Quick Start](./docs/QUICK_START.md)** - Quick setup guide
- **[Contributing](./CONTRIBUTING.md)** - Contribution guidelines
- **[Changelog](./CHANGELOG.md)** - Version history

## 🎤 Hackathon Demo

For hackathon presentation:
1. Use the one-command start scripts for quick setup
2. Demo breed identification with real images
3. Show offline-first capabilities
4. Highlight trust scores and explainability
5. Emphasize ethical AI principles

See [docs/QUICK_START.md](./docs/QUICK_START.md) for detailed demo flow.

## 🐛 Troubleshooting

### Backend Issues
- **Port 8000 in use**: Change port in `scripts/backend/start.py` or use `--port` flag
- **Models not found**: Run `python scripts/backend/init_models.py`
- **Import errors**: Ensure virtual environment is activated and run `pip install -r backend/requirements.txt`
- **Module not found**: Check that you're running scripts from project root

### Frontend Issues
- **Port 5173 in use**: Change in `frontend/vite.config.js` or use `--port` flag
- **CORS errors**: Ensure backend is running and check `backend/app/core/config.py` for allowed origins
- **Build errors**: Delete `frontend/node_modules` and `frontend/package-lock.json`, then run `npm install`
- **Module not found**: Clear Vite cache: `rm -rf frontend/.vite` (Linux/Mac) or delete `.vite` folder (Windows)

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
