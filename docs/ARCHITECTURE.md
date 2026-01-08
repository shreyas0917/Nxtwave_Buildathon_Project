# System Architecture

## Overview

The Nationwide Livestock AI Platform is designed as an **offline-first, production-grade system** for Indian dairy cooperatives.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         React PWA (Frontend)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Camera       │  │ Offline Queue│  │ i18n (Multi)  │         │
│  │ Capture      │  │ (IndexedDB)  │  │ UI           │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                │
│         └──────────────────┼──────────────────┘                │
│                            │ HTTPS REST API                     │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                    FastAPI Backend (Python)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ /predict-    │  │ /predict-    │  │ /ask-advisor │         │
│  │ breed        │  │ risk         │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼────────────────┐
│         │                  │                  │                 │
│  ┌──────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐          │
│  │ Breed       │  │ Health Risk  │  │ AI Advisor   │          │
│  │ CNN Model   │  │ Heuristic+   │  │ (RAG + LLM)  │          │
│  │ (MobileNet) │  │ CNN Hybrid   │  │              │          │
│  └──────┬──────┘  └───────┬──────┘  └───────┬──────┘          │
│         │                  │                  │                 │
│  ┌──────▼──────────────────▼──────────────────▼──────┐          │
│  │         Grad-CAM Explainability Layer              │          │
│  └────────────────────────────────────────────────────┘          │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐          │
│  │         Trust Score Engine                          │          │
│  │  • Model Confidence (30%)                          │          │
│  │  • Regional Validity (40%)                        │          │
│  │  • Community Feedback (30%)                       │          │
│  └────────────────────────────────────────────────────┘          │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐          │
│  │         Feedback & Trends Service                   │          │
│  │  • Aggregated feedback (anonymized)                │          │
│  │  • Regional trends                                 │          │
│  └────────────────────────────────────────────────────┘          │
└──────────────────────────────────────────────────────────────────┘
```

## Components

### Frontend (React PWA)

- **Framework**: React 18 with Vite
- **PWA**: Service Worker with Workbox for offline-first
- **Offline Queue**: IndexedDB for queuing API calls
- **i18n**: Multi-language support (English, Hindi, Marathi, Tamil, Telugu)
- **Camera**: React Webcam for image capture
- **State Management**: React Hooks

### Backend (FastAPI)

- **Framework**: FastAPI (Python 3.11)
- **API**: REST over HTTPS
- **Documentation**: Auto-generated OpenAPI/Swagger
- **Deployment**: Production-ready with process managers

### ML Pipeline

#### Breed Identification
- **Model**: MobileNetV3-based CNN
- **Input**: 224x224 RGB images
- **Output**: 21-class breed classification
- **Explainability**: Grad-CAM heatmaps

#### Health Risk Assessment
- **Model**: Hybrid (Heuristic + EfficientNet CNN)
- **Visual Cues**:
  - Body Condition Score proxy
  - Coat quality
  - Eye/nose discharge
- **Output**: Risk level (Low/Medium/High)
- **Explainability**: Grad-CAM heatmaps

#### AI Advisor (RAG)
- **Embeddings**: Sentence-Transformers (multilingual)
- **Retrieval**: FAISS vector search
- **Generation**: Local LLM (Mistral/LLaMA-3) or API
- **Knowledge Base**: Vetted livestock care documents

### Trust Score System

```
Trust Score = (Model Confidence × 0.3) + 
              (Regional Validity × 0.4) + 
              (Community Feedback × 0.3)
```

**Components**:
1. **Model Confidence**: CNN output probability (0-1)
2. **Regional Validity**: Breed-region match from metadata (0-1)
3. **Community Feedback**: Aggregated farmer outcomes (0-1)

## Data Flow

1. **Image Upload/Capture** → Frontend
2. **Preprocessing** → Resize, normalize
3. **ML Inference** → Breed/Risk prediction
4. **Trust Calculation** → Combine confidence, regional validity, feedback
5. **Grad-CAM** → Generate explainability heatmap
6. **Response** → JSON with predictions, trust scores, explanations

## Offline-First Strategy

1. **Service Worker**: Cache-first for static assets
2. **IndexedDB**: Queue API requests when offline
3. **Network-First**: For API calls (with timeout)
4. **Auto-Sync**: Process queue when connection restored

## Security & Privacy

- **No Personal Data**: No GPS, no personal identifiers
- **Farmer Ownership**: All data owned by farmer
- **Anonymized Aggregation**: Trends use aggregated, anonymized data
- **HTTPS Only**: All API communication encrypted
- **No Diagnosis**: Explicitly non-diagnostic

## Scalability

- **Edge-Ready**: Models can be converted to TensorFlow Lite
- **Cloud-Scalable**: Traditional server or cloud platform deployment
- **Horizontal Scaling**: Stateless API design
- **Caching**: Redis for frequently accessed data (optional)

## Deployment

- **Development**: Local Python/Node.js servers
- **Production**: Traditional servers, cloud platforms, or Kubernetes
- **CDN**: Static assets via CDN
- **Monitoring**: Prometheus + Grafana

