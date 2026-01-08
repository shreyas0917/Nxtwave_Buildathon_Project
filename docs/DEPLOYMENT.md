# Deployment Guide

## Prerequisites

- Python 3.11+ (for backend)
- Node.js 18+ (for frontend)
- 8GB+ RAM (for ML model inference)

## Quick Start (Local Development)

### 1. Clone Repository

```bash
git clone <repository-url>
cd livestock-ai-platform
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with API URL
```

### 3. Prepare ML Models

Place trained models in:
- `backend/ml_pipeline/models/breed_classifier.h5`
- `backend/ml_pipeline/models/risk_assessor.h5`

If models don't exist, run:
```bash
cd backend
python init_models.py
```

This will create placeholder models for testing.

### 4. Start Services

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python start.py
```

**Frontend (new terminal):**
```bash
cd frontend
npm install
npm run dev
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Production Deployment

### Option 1: Traditional Server Deployment

#### Backend Deployment

1. **Set up Python environment:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **Run with production server:**
```bash
# Using Gunicorn (recommended)
pip install gunicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Or using uvicorn directly
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

3. **Set up process manager (PM2 or systemd):**
```bash
# Using PM2
npm install -g pm2
pm2 start "gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000" --name livestock-backend
pm2 save
```

#### Frontend Deployment

1. **Build for production:**
```bash
cd frontend
npm install
npm run build
```

2. **Serve with Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option 2: Cloud Platforms

#### AWS (EC2/Elastic Beanstalk)

1. **Backend:**
   - Launch EC2 instance
   - Install Python 3.11+
   - Deploy backend code
   - Use Elastic Beanstalk for easier deployment

2. **Frontend:**
   - Build frontend: `npm run build`
   - Deploy to S3 + CloudFront
   - Or use Elastic Beanstalk

#### Google Cloud (App Engine/Cloud Run)

1. **Backend:**
   - Deploy to Cloud Run or App Engine
   - Use Cloud Build for CI/CD

2. **Frontend:**
   - Deploy to Firebase Hosting or Cloud Storage

#### Azure (App Service)

1. **Backend:**
   - Deploy to Azure App Service
   - Use Azure DevOps for CI/CD

2. **Frontend:**
   - Deploy to Azure Static Web Apps

### Option 3: Kubernetes (Advanced)

1. **Create deployment files:**
   - `k8s/backend-deployment.yaml`
   - `k8s/frontend-deployment.yaml`
   - `k8s/services.yaml`
   - `k8s/ingress.yaml`

2. **Deploy:**
```bash
kubectl apply -f k8s/
```

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `DEBUG` | Debug mode | `false` |
| `ALLOWED_ORIGINS` | CORS origins | `http://localhost:3000` |
| `BREED_MODEL_PATH` | Breed model path | `ml_pipeline/models/breed_classifier.h5` |
| `RISK_MODEL_PATH` | Risk model path | `ml_pipeline/models/risk_assessor.h5` |
| `DATABASE_URL` | Database connection string | `sqlite:///./livestock_ai.db` |
| `MAX_UPLOAD_SIZE` | Max upload size (bytes) | `10485760` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api/v1` |

## Database Setup

### SQLite (Development)

No setup required. Database file created automatically.

### PostgreSQL (Production)

```sql
CREATE DATABASE livestock_ai;
CREATE USER livestock_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE livestock_ai TO livestock_user;
```

Update `DATABASE_URL`:
```
DATABASE_URL=postgresql://livestock_user:your_password@localhost:5432/livestock_ai
```

## Model Training

### Train Breed Classifier

```bash
cd backend/ml_pipeline
python train_breed_classifier.py \
  --data_dir /path/to/breed/dataset \
  --output_dir models \
  --epochs 50 \
  --batch_size 32
```

### Train Risk Assessor

```bash
cd backend/ml_pipeline
python train_risk_assessor.py \
  --data_dir /path/to/risk/dataset \
  --output_dir models \
  --epochs 50 \
  --batch_size 32
```

## Monitoring

### Health Checks

- Backend: `GET http://localhost:8000/health`
- Frontend: Check service status

### Metrics

In production, integrate:
- Prometheus for metrics
- Grafana for visualization
- Sentry for error tracking

## Scaling

### Horizontal Scaling

- Backend: Deploy multiple instances behind load balancer
- Frontend: Use CDN for static assets
- Database: Use read replicas for read-heavy workloads

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Use GPU instances for ML inference (optional)

## Security

1. **HTTPS**: Use TLS certificates (Let's Encrypt)
2. **API Keys**: Implement API key authentication
3. **Rate Limiting**: Add rate limiting middleware
4. **Input Validation**: All inputs validated via Pydantic
5. **CORS**: Configure allowed origins properly

## Backup

### Database Backup

```bash
# SQLite
cp livestock_ai.db backups/livestock_ai_$(date +%Y%m%d).db

# PostgreSQL
pg_dump -U livestock_user livestock_ai > backups/backup_$(date +%Y%m%d).sql
```

### Model Backup

```bash
tar -czf models_backup_$(date +%Y%m%d).tar.gz ml_pipeline/models/
```

## Troubleshooting

### Backend won't start

- Check Python version: `python --version` (need 3.11+)
- Verify model files exist (run `python init_models.py`)
- Check environment variables
- Check if port 8000 is free

### Frontend can't connect to API

- Verify `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend
- Verify backend is running

### ML inference slow

- Use GPU instances
- Optimize model (quantization, TensorFlow Lite)
- Add caching for repeated predictions

## Support

For issues or questions:
- GitHub Issues: [repository-url]/issues
- Documentation: `/docs`
- API Docs: `/docs` (Swagger UI)
