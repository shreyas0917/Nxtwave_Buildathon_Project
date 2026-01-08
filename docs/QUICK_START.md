# Quick Start Guide

## For Developers

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### Local Development

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Access at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Local Development

```bash
# Backend
cd backend && python start.py

# Frontend (new terminal)
cd frontend && npm run dev
```

## For Users

### Web App

1. Visit: https://livestock-ai.gov.in (production) or http://localhost:3000 (local)
2. Choose feature:
   - **Breed ID**: Upload/capture photo to identify breed
   - **Risk Assessment**: Assess health risk level
   - **AI Advisor**: Ask care questions
   - **Trends**: View regional health trends

### Mobile App (PWA)

1. Open web app on mobile browser
2. Tap "Add to Home Screen"
3. Use offline (with queued requests)

## For ML Engineers

### Training Models

#### Breed Classifier

```bash
cd backend/ml_pipeline
python train_breed_classifier.py \
  --data_dir /path/to/breed/dataset \
  --output_dir models \
  --epochs 50
```

**Dataset Structure:**
```
dataset/
  Gir/
    image1.jpg
    image2.jpg
  Sahiwal/
    image1.jpg
    ...
```

#### Risk Assessor

```bash
cd backend/ml_pipeline
python train_risk_assessor.py \
  --data_dir /path/to/risk/dataset \
  --output_dir models \
  --epochs 50
```

**Dataset Structure:**
```
dataset/
  low_risk/
    image1.jpg
  medium_risk/
    image2.jpg
  high_risk/
    image3.jpg
```

Or with annotations:
```
dataset/
  images/
    image1.jpg
    image2.jpg
  annotations.json
```

## For System Administrators

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**
```bash
# Backend
cd backend && python start.py

# Frontend (build and serve)
cd frontend && npm run build && npm run preview
```

### Monitoring

- Health: `GET /health`
- Metrics: Prometheus endpoint (if configured)
- Logs: Check console output or log files

## Troubleshooting

### Backend Issues

**Model not found:**
- Place models in `backend/ml_pipeline/models/`
- Or set `BREED_MODEL_PATH` and `RISK_MODEL_PATH` in `.env`

**Port already in use:**
- Change port in `start.py` (backend) or `vite.config.js` (frontend)

### Frontend Issues

**Can't connect to API:**
- Check `VITE_API_URL` in `.env`
- Verify backend is running
- Check CORS settings

**PWA not working:**
- Ensure HTTPS in production
- Check service worker registration
- Clear browser cache

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Read [API.md](./API.md) for API documentation
- Read [ETHICS.md](./ETHICS.md) for ethical guidelines
- Read [TRUST_SCORE.md](./TRUST_SCORE.md) for trust score details

