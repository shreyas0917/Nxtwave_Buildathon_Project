# API Documentation

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

Currently, the API does not require authentication. In production, implement API keys or OAuth2.

## Endpoints

### 1. Breed Identification

**POST** `/predict-breed`

Identify Indian cattle/buffalo breed from image.

**Request Body:**
```json
{
  "image_base64": "data:image/jpeg;base64,...",
  "region": "Gujarat"  // Optional
}
```

**Response:**
```json
{
  "breed": "Gir",
  "confidence": 0.87,
  "trust_score": 0.82,
  "regional_validity": 0.95,
  "explanation": "High confidence match for Gir breed, commonly found in Gujarat region.",
  "grad_cam_heatmap": "data:image/png;base64,...",
  "disclaimer": "This is a non-diagnostic tool. Always consult a veterinarian for medical decisions."
}
```

### 2. Health Risk Assessment

**POST** `/predict-risk`

Assess non-diagnostic health risk level from image.

**Request Body:**
```json
{
  "image_base64": "data:image/jpeg;base64,...",
  "breed": "Gir",  // Optional
  "region": "Gujarat"  // Optional
}
```

**Response:**
```json
{
  "risk_level": "Medium",
  "confidence": 0.75,
  "trust_score": 0.68,
  "visual_cues": [
    {
      "cue_name": "Body Condition Score",
      "detected": true,
      "confidence": 0.72,
      "description": "Moderate body condition observed"
    },
    {
      "cue_name": "Coat Quality",
      "detected": true,
      "confidence": 0.65,
      "description": "Slightly dull coat detected"
    }
  ],
  "factors": [
    "Moderate body condition",
    "Slightly dull coat",
    "Normal posture observed"
  ],
  "explanation": "Medium risk level based on visual assessment. Monitor closely and consider veterinary consultation if condition persists.",
  "grad_cam_heatmap": "data:image/png;base64,...",
  "disclaimer": "This is a NON-DIAGNOSTIC tool. This does NOT replace veterinary consultation."
}
```

### 3. AI Advisor

**POST** `/ask-advisor`

Get AI-powered care guidance using RAG.

**Request Body:**
```json
{
  "question": "How much water does a Gir cow need daily?",
  "language": "en",  // en, hi, mr, ta, te
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
  "answer": "For Gir cattle, ensure adequate clean water (40-50 liters daily), balanced nutrition with green fodder, and regular health monitoring. In Gujarat region, watch for heat stress during summer months.",
  "sources": [
    "ICAR Livestock Care Guidelines",
    "Gir Breed Management Manual"
  ],
  "confidence": 0.85,
  "disclaimer": "This is general care guidance only. This does NOT constitute medical diagnosis or treatment."
}
```

### 4. Submit Feedback

**POST** `/submit-feedback`

Submit feedback on prediction accuracy.

**Request Body:**
```json
{
  "prediction_id": "pred_123",  // Optional
  "prediction_type": "breed",  // breed or risk
  "outcome": "improved",  // improved, no_change, vet_confirmed, vet_disagreed
  "region": "Gujarat",
  "comments": "Breed identification was accurate",  // Optional
  "vet_consulted": true
}
```

**Response:**
```json
{
  "feedback_id": "fb_1234567890",
  "status": "received",
  "message": "Thank you for your feedback. This helps improve the system.",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 5. Health Trends

**GET** `/health-trends`

Get aggregated health trends by region.

**Query Parameters:**
- `district` (optional): District name
- `state` (optional): State name
- `period` (default: "last_30_days"): Time period

**Example:**
```
GET /health-trends?district=Ahmedabad&state=Gujarat&period=last_30_days
```

**Response:**
```json
{
  "district": "Ahmedabad",
  "state": "Gujarat",
  "period": "last_30_days",
  "trends": [
    {
      "date": "2024-01-01T00:00:00Z",
      "risk_level": "Low",
      "count": 45,
      "average_confidence": 0.82
    }
  ],
  "summary": {
    "total_assessments": 1200,
    "low_risk_percentage": 65.0,
    "medium_risk_percentage": 28.0,
    "high_risk_percentage": 7.0
  },
  "disclaimer": "Trends are aggregated and anonymized. Individual predictions may vary."
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "disclaimer": "This is a non-diagnostic tool. Always consult a veterinarian for medical decisions."
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad Request (invalid input)
- `500`: Internal Server Error

## Rate Limiting

Currently no rate limiting. In production, implement rate limiting (e.g., 100 requests/hour per IP).

## OpenAPI Documentation

Interactive API documentation available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

