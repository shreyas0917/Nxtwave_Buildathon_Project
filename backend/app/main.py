"""
Nationwide Livestock AI Platform - FastAPI Backend
Production-grade API for breed identification and health risk assessment
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.api import breed, risk, advisor, feedback, trends, reports
from app.core.config import settings

app = FastAPI(
    title="Livestock AI Platform API",
    description="Nationwide AI platform for Indian dairy cooperatives",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for PWA
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    """Health check endpoint"""
    return {"status": "healthy", "service": "livestock-ai-platform"}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc),
            "disclaimer": "This is a non-diagnostic tool. Always consult a veterinarian for medical decisions."
        }
    )


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )

