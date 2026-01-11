# 🐄 Livestock AI Platform

A comprehensive AI-powered platform for Indian dairy cooperatives to identify cattle breeds, assess health risks, and provide intelligent care guidance.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Frontend](#frontend)
- [Backend](#backend)
- [Development](#development)
- [Contributing](#contributing)

## 🎯 Overview

The Livestock AI Platform is a production-grade application designed to help Indian dairy farmers and cooperatives:

- **Identify Cattle Breeds**: Automatically recognize 20+ Indian cattle and buffalo breeds from images
- **Health Risk Assessment**: Non-diagnostic health risk evaluation with visual cue detection
- **AI Advisor**: Multilingual conversational AI for livestock care guidance using RAG (Retrieval-Augmented Generation)
- **Trust Scores**: Transparent confidence metrics for all predictions
- **Offline-First**: Works without internet connection with automatic request queuing

## ✨ Features

### 🎯 Core Features

- **Breed Identification**
  - Support for 20+ Indian breeds (Gir, Sahiwal, Murrah, etc.)
  - Real-time image processing
  - Confidence scores and explanations
  - Regional breed filtering

- **Health Risk Assessment**
  - Non-diagnostic risk level prediction (Low/Medium/High)
  - Visual cue detection (Body Condition, Coat Quality, etc.)
  - Breed-specific assessment
  - Detailed explanations and recommendations

- **AI Advisor Chatbot**
  - Multilingual support
  - RAG-based knowledge retrieval
  - Conversational interface
  - Context-aware responses

- **Advanced Features**
  - Trust score calculation
  - Batch processing
  - Health trends and analytics
  - PDF report generation
  - QR code integration
  - Offline-first architecture

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Router** - Routing
- **TanStack Query** - Data fetching
- **Recharts** - Data visualization

### Backend
- **Python 3.8+**
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **TensorFlow/Keras** - ML models
- **Pydantic** - Data validation
- **SQLite** - Database (default)
- **PIL/Pillow** - Image processing

### AI/ML
- **TensorFlow** - Model framework
- **Sentence Transformers** - Embeddings
- **FAISS** - Vector search (optional)
- **OpenAI API** - Optional AI features
- **Heuristic-based predictions** - Fallback system

## 📁 Project Structure

```
NXTWAVE_OPENAI_PROJECT/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── models/         # ML models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── core/           # Configuration
│   │   └── main.py         # Application entry
│   ├── data/               # Data files
│   ├── ml_pipeline/        # ML training (if available)
│   ├── storage/            # Uploads and reports
│   ├── requirements.txt    # Python dependencies
│   └── venv/               # Virtual environment
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities
│   ├── public/             # Static assets
│   ├── package.json        # Node dependencies
│   └── vite.config.ts      # Vite configuration
│
└── README.md               # This file
```

## 🚀 Installation

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 16+** and **npm** (for frontend)
- **Git** (for cloning the repository)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   
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

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🏃 Getting Started

### Running the Backend

1. **Activate virtual environment** (if not already activated):
   ```bash
   cd backend
   source venv/Scripts/activate  # Windows Git Bash
   # or
   .\venv\Scripts\Activate.ps1   # Windows PowerShell
   ```

2. **Start the backend server:**
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend will be available at:
   - **API**: http://localhost:8000
   - **API Docs**: http://localhost:8000/docs
   - **Health Check**: http://localhost:8000/health

### Running the Frontend

1. **Open a new terminal** (keep backend running)

2. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at:
   - **Local**: http://localhost:3000
   - **Network**: http://192.168.x.x:3000 (accessible from other devices)

## 📚 API Documentation

Once the backend is running, visit **http://localhost:8000/docs** for interactive API documentation (Swagger UI).

### Main API Endpoints

- `POST /api/v1/predict-breed` - Breed identification
- `POST /api/v1/predict-risk` - Health risk assessment
- `POST /api/v1/advisor/chat` - AI advisor chatbot
- `GET /api/v1/trends` - Health trends data
- `GET /api/v1/reports/{report_id}` - Download reports
- `GET /health` - Health check

### Example API Request

```bash
# Health check
curl http://localhost:8000/health

# Breed prediction (requires image file)
curl -X POST http://localhost:8000/api/v1/predict-breed \
  -F "file=@cattle_image.jpg" \
  -F "region=Gujarat"
```

## 🎨 Frontend

The frontend is built with React and TypeScript, providing a modern and responsive user interface.

### Key Pages

- **Landing Page** - Project introduction
- **Dashboard** - Overview and quick actions
- **Detection** - Breed identification and health assessment
- **History** - Past scan results
- **Reports** - Generated reports and analytics
- **Profile** - User settings

### Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode** - Theme switching support
- **Offline Support** - Service worker for offline functionality
- **Real-time Updates** - Live data synchronization
- **Multilingual** - Language switching capability

## ⚙️ Backend

The backend is built with FastAPI, providing a high-performance API with automatic documentation.

### Key Components

- **API Routes** - RESTful endpoints
- **Services** - Business logic layer
- **Models** - ML model wrappers
- **Schemas** - Request/response validation
- **Configuration** - Environment settings

### Features

- **Auto Documentation** - Swagger/OpenAPI docs
- **CORS Support** - Cross-origin requests
- **Error Handling** - Global exception handlers
- **Validation** - Pydantic schemas
- **File Upload** - Image processing support

## 🔧 Development

### Backend Development

```bash
# Run with auto-reload
python -m uvicorn app.main:app --reload

# Run without reload
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --no-reload
```

### Frontend Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the `backend` directory (optional):

```env
# API Settings
DEBUG=False

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# AI API Keys (Optional)
OPENAI_API_KEY=your_key_here
HUGGINGFACE_API_KEY=your_key_here
USE_AI_API=False

# Database
DATABASE_URL=sqlite:///./livestock_ai.db
```

Create a `.env` file in the `frontend` directory (optional):

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 📝 Notes

- The platform uses **heuristic-based predictions** by default (no real ML models required for basic functionality)
- ML models can be integrated by placing trained model files in the appropriate directories
- The system gracefully falls back to heuristic predictions if models are unavailable
- All health assessments are **non-diagnostic** - always consult a veterinarian for medical decisions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of a hackathon/buildathon submission. Please refer to the project's license file for more information.

## 🙏 Acknowledgments

- Built for Indian dairy cooperatives
- Designed with offline-first principles
- Focus on explainable AI and trust scores

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Note**: This is a non-diagnostic tool. Always consult a qualified veterinarian for medical decisions regarding livestock health.
