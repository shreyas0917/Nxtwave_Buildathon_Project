"""
Pydantic schemas for breed identification
"""

from pydantic import BaseModel, Field
from typing import Optional, List


class BreedPredictionRequest(BaseModel):
    """Request schema for breed prediction"""
    image_base64: Optional[str] = Field(None, description="Base64 encoded image")
    region: Optional[str] = Field(None, description="State/District for regional validation")
    metadata: Optional[dict] = Field(None, description="Additional metadata")


class BreedPredictionResponse(BaseModel):
    """Response schema for breed prediction"""
    breed: str = Field(..., description="Predicted breed name")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence (0-1)")
    trust_score: float = Field(..., ge=0.0, le=1.0, description="Overall trust score (0-1)")
    regional_validity: float = Field(..., ge=0.0, le=1.0, description="Regional match score")
    explanation: str = Field(..., description="Human-readable explanation")
    grad_cam_heatmap: Optional[str] = Field(None, description="Base64 encoded Grad-CAM heatmap")
    disclaimer: str = Field(
        default="This is a non-diagnostic tool. Always consult a veterinarian for medical decisions.",
        description="Medical disclaimer"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "breed": "Gir",
                "confidence": 0.87,
                "trust_score": 0.82,
                "regional_validity": 0.95,
                "explanation": "High confidence match for Gir breed, commonly found in Gujarat region.",
                "grad_cam_heatmap": "data:image/png;base64,...",
                "disclaimer": "This is a non-diagnostic tool. Always consult a veterinarian for medical decisions."
            }
        }

