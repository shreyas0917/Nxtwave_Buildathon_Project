# 🔗 Connect Lovable Frontend to This Backend

Complete guide to connect your Lovable-generated frontend to this FastAPI backend.

## 📋 Backend Information

**Base URL:** `http://localhost:8000/api/v1`  
**API Documentation:** `http://localhost:8000/docs`  
**Health Check:** `http://localhost:8000/health`

---

## 🔧 Step 1: Update Backend CORS Settings

First, you need to allow your Lovable frontend origin in the backend CORS settings.

### Option A: Update config.py (Recommended)

Edit `backend/app/core/config.py` and add your Lovable frontend URL to `ALLOWED_ORIGINS`:

```python
ALLOWED_ORIGINS: List[str] = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",  # Add if Lovable uses different port
    "https://livestock-ai.gov.in",  # Production domain
    # Add your Lovable frontend URL here
    "https://your-lovable-app.lovable.app",  # Example
    "http://localhost:YOUR_PORT"  # Or your local Lovable port
]
```

### Option B: Use Environment Variable (For Production)

Create or update `backend/.env`:

```env
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:5173","https://your-lovable-app.lovable.app"]
```

### Option C: Allow All Origins (Development Only)

⚠️ **NOT RECOMMENDED FOR PRODUCTION**

In `backend/app/main.py`, temporarily change:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📡 Step 2: Available API Endpoints

### 1. Breed Identification

**Endpoint:** `POST /api/v1/predict-breed`

**Request Format:**

**Option A: JSON with Base64 Image**
```json
{
  "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "region": "Gujarat"  // Optional
}
```

**Option B: Multipart Form Data**
```
FormData with file field containing the image file
```

**Response:**
```json
{
  "breed": "Gir",
  "confidence": 0.92,
  "top_3_predictions": [
    {"breed": "Gir", "confidence": 0.92},
    {"breed": "Sahiwal", "confidence": 0.06},
    {"breed": "Red Sindhi", "confidence": 0.02}
  ],
  "explanation": "The image shows characteristics typical of Gir breed...",
  "gradcam_heatmap": "data:image/png;base64,iVBORw0KG...",
  "trust_score": 0.89
}
```

---

### 2. Health Risk Assessment

**Endpoint:** `POST /api/v1/predict-risk`

**Request Format:**

**Option A: JSON with Base64 Image**
```json
{
  "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "breed": "Gir",  // Optional
  "region": "Gujarat"  // Optional
}
```

**Option B: Multipart Form Data**
```
FormData with file field containing the image file
```

**Response:**
```json
{
  "risk_level": "Low",
  "confidence": 0.88,
  "visual_cues": [
    {
      "cue": "Body Condition Score",
      "value": "Normal (3/5)",
      "confidence": 0.87
    },
    {
      "cue": "Coat Condition",
      "value": "Healthy",
      "confidence": 0.89
    }
  ],
  "explanation": "The assessment indicates a low health risk...",
  "gradcam_heatmap": "data:image/png;base64,iVBORw0KG...",
  "trust_score": 0.86
}
```

---

### 3. AI Advisor

**Endpoint:** `POST /api/v1/ask-advisor`

**Request:**
```json
{
  "question": "What should I feed my Gir cow?",
  "language": "en",  // Optional: en, hi, mr, ta, te (default: "en")
  "context": {
    "breed": "Gir",
    "risk_level": "Low"
  },  // Optional
  "region": "Gujarat"  // Optional
}
```

**Response:**
```json
{
  "answer": "For Gir cows, a balanced diet is essential. Include green fodder, dry fodder, and concentrate feed...",
  "confidence": 0.90,
  "sources": ["Regional knowledge base", "Livestock care guidelines"],
  "disclaimer": "This is general care guidance only. This does NOT constitute medical diagnosis or treatment. Always consult a qualified veterinarian for medical decisions."
}
```

**Note:** This is a simple Q&A endpoint. For chatbot functionality with conversation history, you'll need to maintain the history on the frontend side and pass context in each request.

```json
{
  "question": "What should I feed my Gir cow?",
  "language": "en",
  "context": {"breed": "Gir"},
  "region": "Gujarat"
}
```

---

### 4. Health Trends

**Endpoint:** `GET /api/v1/health-trends`

**Query Parameters:**
- `district` (optional): District name
- `state` (optional): State name
- `period` (optional): "last_7_days", "last_30_days", "last_90_days" (default: "last_30_days")

**Example:**
```
GET /api/v1/health-trends?state=Gujarat&period=last_30_days
```

**Response:**
```json
{
  "period": "last_30_days",
  "risk_distribution": {
    "low": 0.65,
    "medium": 0.28,
    "high": 0.07
  },
  "time_series": [
    {"date": "2024-01-01", "low": 60, "medium": 25, "high": 5},
    {"date": "2024-01-02", "low": 62, "medium": 24, "high": 4}
  ],
  "breed_trends": [
    {"breed": "Gir", "low": 0.70, "medium": 0.25, "high": 0.05}
  ],
  "regional_comparison": {
    "current_region": {"low": 0.65, "medium": 0.28, "high": 0.07},
    "national_average": {"low": 0.60, "medium": 0.30, "high": 0.10}
  }
}
```

---

### 5. Submit Feedback

**Endpoint:** `POST /api/v1/feedback`

**Request:**
```json
{
  "prediction_id": "uuid-here",  // Optional
  "prediction_type": "breed",  // "breed" or "risk"
  "rating": 5,  // 1-5
  "comment": "Very accurate prediction!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "feedback_id": "uuid-here"
}
```

---

## 💻 Step 3: Example Code for Lovable Frontend

### Using Fetch API (JavaScript/TypeScript)

```javascript
// Base API URL
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Breed Identification
async function predictBreed(imageFile) {
  // Convert image to base64
  const base64 = await fileToBase64(imageFile);
  
  const response = await fetch(`${API_BASE_URL}/predict-breed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_base64: base64,
      region: 'Gujarat' // Optional
    })
  });
  
  if (!response.ok) {
    throw new Error('Breed prediction failed');
  }
  
  return await response.json();
}

// Helper: Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Risk Assessment
async function assessRisk(imageFile, breed = null) {
  const base64 = await fileToBase64(imageFile);
  
  const response = await fetch(`${API_BASE_URL}/predict-risk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_base64: base64,
      breed: breed,
      region: 'Gujarat'
    })
  });
  
  return await response.json();
}

// AI Advisor
async function askAdvisor(question, context = null, region = null, language = 'en') {
  const response = await fetch(`${API_BASE_URL}/ask-advisor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question: question,
      language: language,
      context: context,
      region: region
    })
  });
  
  return await response.json();
}

// Get Health Trends
async function getHealthTrends(state = null, period = 'last_30_days') {
  const params = new URLSearchParams({ period });
  if (state) params.append('state', state);
  
  const response = await fetch(`${API_BASE_URL}/health-trends?${params}`);
  return await response.json();
}
```

---

### Using Axios (If Available)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 90000, // 90 seconds for ML inference
});

// Breed Prediction
export async function predictBreed(imageBase64, region = null) {
  const response = await api.post('/predict-breed', {
    image_base64: imageBase64,
    region
  });
  return response.data;
}

// Risk Assessment
export async function assessRisk(imageBase64, breed = null, region = null) {
  const response = await api.post('/predict-risk', {
    image_base64: imageBase64,
    breed,
    region
  });
  return response.data;
}

// Ask AI Advisor
export async function askAdvisor(question, context = null, region = null, language = 'en') {
  const response = await api.post('/ask-advisor', {
    question,
    language,
    context,
    region
  });
  return response.data;
}
```

---

### Using Multipart Form Data (Alternative)

```javascript
// For file uploads, you can use FormData instead of base64
async function predictBreedWithFile(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const response = await fetch(`${API_BASE_URL}/predict-breed`, {
    method: 'POST',
    body: formData
    // Don't set Content-Type header - browser will set it with boundary
  });
  
  return await response.json();
}
```

---

## 🚀 Step 4: Start the Backend

Make sure your backend is running:

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate   # Linux/Mac

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Verify it's running:
- Visit: http://localhost:8000/health
- Should return: `{"status": "healthy", "service": "livestock-ai-platform"}`

---

## 🔍 Step 5: Test the Connection

### Test 1: Health Check
```javascript
fetch('http://localhost:8000/health')
  .then(res => res.json())
  .then(data => console.log('Backend is running:', data));
```

### Test 2: API Documentation
Visit http://localhost:8000/docs in your browser to see the interactive API documentation.

### Test 3: Simple API Call
```javascript
// Test breed prediction with a sample image
const testImage = 'data:image/jpeg;base64,...'; // Your base64 image

fetch('http://localhost:8000/api/v1/predict-breed', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image_base64: testImage })
})
  .then(res => res.json())
  .then(data => console.log('Breed prediction:', data));
```

---

## ⚠️ Common Issues & Solutions

### CORS Error

**Error:** `Access to fetch at 'http://localhost:8000/...' from origin '...' has been blocked by CORS policy`

**Solution:** 
1. Make sure your Lovable frontend URL is in `ALLOWED_ORIGINS` in `backend/app/core/config.py`
2. Restart the backend server after changing CORS settings
3. Check browser console for the exact origin being blocked

### Connection Refused

**Error:** `Failed to fetch` or `Network error`

**Solution:**
1. Make sure backend is running on port 8000
2. Check if backend URL is correct (should be `http://localhost:8000/api/v1`)
3. Try accessing http://localhost:8000/health directly in browser

### Image Upload Issues

**Issue:** Base64 image not working

**Solution:**
- Make sure base64 string includes the data URI prefix: `data:image/jpeg;base64,`
- Or use FormData with file upload instead
- Check image size (backend has 10MB limit)

### Timeout Errors

**Error:** Request timeout

**Solution:**
- ML inference can take 30-90 seconds
- Increase timeout in your HTTP client
- Example: `timeout: 90000` (90 seconds) for axios

---

## 📚 Additional Resources

- **API Documentation:** http://localhost:8000/docs (Interactive Swagger UI)
- **Alternative Docs:** http://localhost:8000/redoc (ReDoc)
- **Backend README:** See `README.md` in backend directory
- **Full API Reference:** Check `backend/app/api/` directory for all endpoints

---

## 🎯 Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/v1/predict-breed` | POST | Identify breed from image |
| `/api/v1/predict-risk` | POST | Assess health risk |
| `/api/v1/ask-advisor` | POST | AI Advisor Q&A |
| `/api/v1/ask-advisor` | POST | Simple Q&A |
| `/api/v1/health-trends` | GET | Get health trends |
| `/api/v1/feedback` | POST | Submit feedback |

---

## 💡 Tips

1. **Start with the docs:** Visit http://localhost:8000/docs for interactive testing
2. **Use environment variables:** Store API URL in environment variables in Lovable
3. **Handle errors gracefully:** All endpoints return JSON error responses
4. **Test locally first:** Make sure backend works before deploying
5. **Check browser console:** For CORS and network errors

---

Need help? Check the API documentation at http://localhost:8000/docs!
