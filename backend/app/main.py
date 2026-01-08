"""
Nationwide Livestock AI Platform - FastAPI Backend
Production-grade API for breed identification and health risk assessment
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn

from app.api import breed, risk, advisor, feedback, trends, reports
from app.core.config import settings
from app.core.logging_config import setup_logging

# Setup logging
logger = setup_logging(debug=settings.DEBUG)

app = FastAPI(
    title="Livestock AI Platform API",
    description="Nationwide AI platform for Indian dairy cooperatives",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,  # Hide docs in production
    redoc_url="/redoc" if settings.DEBUG else None
)

# Security: Trusted Host middleware (production)
if not settings.DEBUG:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["localhost", "127.0.0.1", "livestock-ai.gov.in", "*.livestock-ai.gov.in"]
    )

# CORS middleware for PWA
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
    max_age=3600,
)

# Include routers
app.include_router(breed.router, prefix="/api/v1", tags=["Breed Identification"])
app.include_router(risk.router, prefix="/api/v1", tags=["Health Risk Assessment"])
app.include_router(advisor.router, prefix="/api/v1", tags=["AI Advisor"])
app.include_router(feedback.router, prefix="/api/v1", tags=["Feedback"])
app.include_router(trends.router, prefix="/api/v1", tags=["Health Trends"])
app.include_router(reports.router, prefix="/api/v1", tags=["Reports & Advanced Features"])

# Import QR code router
from app.api import qrcode
app.include_router(qrcode.router, prefix="/api/v1", tags=["QR Codes"])


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "Livestock AI Platform API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint with detailed status"""
    try:
        # Check if services are available
        from app.services.breed_service import BreedService
        from app.services.risk_service import RiskService
        
        breed_service = BreedService()
        risk_service = RiskService()
        
        breed_available = breed_service.classifier is not None
        risk_available = risk_service.model is not None
        
        return {
            "status": "healthy",
            "service": "livestock-ai-platform",
            "version": "1.0.0",
            "services": {
                "breed_identification": "available" if breed_available else "initializing",
                "risk_assessment": "available" if risk_available else "initializing"
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "degraded",
                "service": "livestock-ai-platform",
                "error": "Some services unavailable"
            }
        )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler with proper logging"""
    import traceback
    
    # Log the full error
    logger.error(
        f"Unhandled exception: {str(exc)}",
        extra={
            "path": request.url.path,
            "method": request.method,
            "traceback": traceback.format_exc()
        }
    )
    
    # Don't expose internal errors in production
    error_message = str(exc) if settings.DEBUG else "An internal error occurred"
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": error_message,
            "disclaimer": "This is a non-diagnostic tool. Always consult a veterinarian for medical decisions."
        }
    )


@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """Add request ID for tracing"""
    import uuid
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )

