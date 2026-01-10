# 📁 Project Structure

This document describes the industry-standard structure of the Nationwide Livestock AI Platform.

## 🏗️ Directory Layout

```
livestock-ai-platform/
├── backend/                          # FastAPI Backend Application
│   ├── app/                          # Main application package
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI application entry point
│   │   ├── api/                      # API route handlers
│   │   │   ├── __init__.py
│   │   │   ├── advisor.py            # AI Advisor endpoints
│   │   │   ├── breed.py              # Breed identification endpoints
│   │   │   ├── feedback.py           # Feedback endpoints
│   │   │   ├── notifications.py      # Notification endpoints
│   │   │   ├── qrcode.py             # QR code generation endpoints
│   │   │   ├── reports.py             # Report generation endpoints
│   │   │   ├── risk.py               # Risk assessment endpoints
│   │   │   └── trends.py             # Health trends endpoints
│   │   ├── core/                     # Core configuration and utilities
│   │   │   ├── __init__.py
│   │   │   └── config.py             # Application settings
│   │   ├── models/                   # ML Model implementations
│   │   │   ├── __init__.py
│   │   │   ├── breed_classifier.py   # Breed classification model
│   │   │   ├── gradcam.py            # Grad-CAM explainability
│   │   │   └── risk_assessor.py      # Health risk assessment model
│   │   ├── schemas/                  # Pydantic schemas for validation
│   │   │   ├── __init__.py
│   │   │   ├── advisor.py
│   │   │   ├── breed.py
│   │   │   ├── feedback.py
│   │   │   ├── notifications.py
│   │   │   ├── reports.py
│   │   │   ├── risk.py
│   │   │   └── trends.py
│   │   └── services/                 # Business logic layer
│   │       ├── __init__.py
│   │       ├── advisor_service.py    # AI Advisor service
│   │       ├── batch_service.py      # Batch processing service
│   │       ├── breed_service.py      # Breed identification service
│   │       ├── comparison_service.py # Comparison service
│   │       ├── feedback_service.py   # Feedback service
│   │       ├── notification_service.py
│   │       ├── recommendation_service.py
│   │       ├── report_service.py     # Report generation service
│   │       ├── risk_service.py       # Risk assessment service
│   │       ├── trends_service.py     # Trends analysis service
│   │       └── trust_service.py      # Trust score calculation
│   ├── data/                         # Static data and knowledge base
│   │   ├── .gitkeep
│   │   ├── breed_region_map.json     # Breed to region mapping
│   │   └── knowledge_base/           # AI Advisor knowledge base
│   │       └── sample_kb.json
│   ├── ml_pipeline/                  # ML Training and Pipeline
│   │   ├── models/                   # Trained model storage
│   │   │   └── .gitkeep
│   │   ├── train_breed_classifier.py # Breed classifier training script
│   │   └── train_risk_assessor.py    # Risk assessor training script
│   ├── storage/                      # Runtime storage
│   │   ├── .gitkeep
│   │   ├── reports/                  # Generated PDF reports
│   │   └── uploads/                  # User uploaded images
│   ├── requirements.txt              # Python dependencies
│   └── venv/                         # Virtual environment (gitignored)
│
├── frontend/                         # React PWA Frontend
│   ├── public/                       # Static public assets
│   │   ├── manifest.json             # PWA manifest
│   │   └── test_images/              # Test images for development
│   ├── src/                          # Source code
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   ├── LanguageSelector.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── NotificationSystem.jsx
│   │   │   ├── OfflineIndicator.jsx
│   │   │   └── TrustMeter.jsx
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── BreedIdentification.jsx
│   │   │   ├── RiskAssessment.jsx
│   │   │   ├── Advisor.jsx
│   │   │   ├── Trends.jsx
│   │   │   └── ... (other pages)
│   │   ├── services/                # API client and services
│   │   │   └── api.js                # Axios API client
│   │   ├── utils/                   # Utility functions
│   │   │   └── offlineQueue.js      # Offline request queue
│   │   ├── i18n/                    # Internationalization
│   │   │   ├── config.js
│   │   │   └── locales/             # Translation files
│   │   │       ├── en.json
│   │   │       ├── hi.json
│   │   │       ├── mr.json
│   │   │       ├── ta.json
│   │   │       └── te.json
│   │   ├── sw/                      # Service Worker
│   │   │   └── service-worker.js
│   │   ├── App.jsx                  # Main App component
│   │   ├── App.css
│   │   ├── main.jsx                 # Application entry point
│   │   └── index.css                # Global styles
│   ├── index.html                   # HTML template
│   ├── package.json                 # Node.js dependencies
│   ├── vite.config.js               # Vite configuration
│   └── node_modules/                # Dependencies (gitignored)
│
├── scripts/                         # Utility scripts
│   ├── backend/                     # Backend scripts
│   │   ├── start.py                 # Start backend server
│   │   ├── init_models.py          # Initialize placeholder models
│   │   ├── check_setup.sh          # Check backend setup
│   │   └── check_setup.bat         # Check backend setup (Windows)
│   ├── start_backend.sh            # Quick start backend (Linux/Mac)
│   ├── start_backend.bat           # Quick start backend (Windows)
│   ├── start_frontend.sh           # Quick start frontend (Linux/Mac)
│   └── start_frontend.bat          # Quick start frontend (Windows)
│
├── tests/                           # Test suites
│   ├── backend/                     # Backend tests
│   │   └── test_data/               # Test data and fixtures
│   └── frontend/                    # Frontend tests
│
├── docs/                            # Documentation
│   ├── API.md                       # API documentation
│   ├── ARCHITECTURE.md              # System architecture
│   ├── DEPLOYMENT.md                # Deployment guide
│   ├── ETHICS.md                    # Ethics and safety guidelines
│   ├── QUICK_START.md               # Quick start guide
│   └── TRUST_SCORE.md               # Trust score system documentation
│
├── .gitignore                       # Git ignore rules
├── .env.example                     # Environment variables template
├── LICENSE                          # MIT License
├── CONTRIBUTING.md                  # Contribution guidelines
├── CHANGELOG.md                     # Version changelog
├── PROJECT_STRUCTURE.md             # This file
└── README.md                        # Main project documentation
```

## 📂 Key Directories Explained

### Backend (`backend/`)

- **`app/`**: Main application code following clean architecture
  - **`api/`**: FastAPI route handlers (thin layer, delegates to services)
  - **`core/`**: Configuration and core utilities
  - **`models/`**: ML model implementations and wrappers
  - **`schemas/`**: Pydantic models for request/response validation
  - **`services/`**: Business logic layer (where most logic lives)

- **`data/`**: Static data files (JSON configs, knowledge base)
- **`ml_pipeline/`**: ML training scripts and model storage
- **`storage/`**: Runtime storage (reports, uploads) - gitignored

### Frontend (`frontend/`)

- **`src/components/`**: Reusable UI components
- **`src/pages/`**: Page-level components (routes)
- **`src/services/`**: API client and service integrations
- **`src/utils/`**: Utility functions and helpers
- **`src/i18n/`**: Internationalization configuration and translations
- **`src/sw/`**: Service Worker for PWA functionality

### Scripts (`scripts/`)

- Utility scripts for development, deployment, and maintenance
- Separated by platform (Windows/Linux) and purpose

### Tests (`tests/`)

- Unit tests, integration tests, and test fixtures
- Mirrors the structure of `backend/` and `frontend/`

### Documentation (`docs/`)

- Comprehensive documentation for developers, users, and administrators

## 🎯 Design Principles

1. **Separation of Concerns**: Clear boundaries between API, services, and models
2. **Modularity**: Each module has a single responsibility
3. **Scalability**: Structure supports growth and team collaboration
4. **Maintainability**: Easy to locate and modify code
5. **Industry Standards**: Follows Python and React best practices

## 📝 File Naming Conventions

- **Python**: `snake_case.py` for files and functions
- **JavaScript/React**: `PascalCase.jsx` for components, `camelCase.js` for utilities
- **Config files**: `kebab-case` (e.g., `vite.config.js`)
- **Documentation**: `UPPERCASE.md` for important docs, `kebab-case.md` for others

## 🔒 Security Considerations

- Environment variables in `.env` (gitignored)
- Sensitive data never committed
- Models and datasets in `.gitignore`
- Storage directories for user uploads

## 🚀 Quick Navigation

- **Start Backend**: `scripts/start_backend.sh` or `scripts/start_backend.bat`
- **Start Frontend**: `scripts/start_frontend.sh` or `scripts/start_frontend.bat`
- **API Docs**: http://localhost:8000/docs
- **Main Config**: `backend/app/core/config.py`
- **Frontend Config**: `frontend/vite.config.js`
