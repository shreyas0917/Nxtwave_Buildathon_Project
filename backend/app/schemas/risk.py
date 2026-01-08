"""
Pydantic schemas for health risk assessment
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from enum import Enum


class RiskLevel(str, Enum):
    """Health risk levels"""
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class VisualCue(BaseModel):
    """Individual visual cue assessment"""
    cue_name: str = Field(..., description="Name of the visual cue")
    detected: bool = Field(..., description="Whether cue was detected")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Detection confidence")
    description: str = Field(..., description="Human-readable description")


class RiskPredictionRequest(BaseModel):
    """Request schema for risk prediction"""
    image_base64: Optional[str] = Field(None, description="Base64 encoded image")
    breed: Optional[str] = Field(None, description="Known breed (if available)")
    region: Optional[str] = Field(None, description="State/District")
    metadata: Optional[dict] = Field(None, description="Additional metadata")


class RiskPredictionResponse(BaseModel):
    """Response schema for risk prediction"""
    risk_level: RiskLevel = Field(..., description="Overall risk level")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence (0-1)")
    trust_score: float = Field(..., ge=0.0, le=1.0, description="Overall trust score (0-1)")
    visual_cues: List[VisualCue] = Field(..., description="Detected visual cues")
    factors: List[str] = Field(..., description="Human-readable risk factors")
    explanation: str = Field(..., description="Overall explanation")
    grad_cam_heatmap: Optional[str] = Field(None, description="Base64 encoded Grad-CAM heatmap")
    disclaimer: str = Field(
        default="This is a NON-DIAGNOSTIC tool. This does NOT replace veterinary consultation. Always consult a qualified veterinarian for medical diagnosis and treatment.",
        description="Medical disclaimer"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "risk_level": "Medium",
                "confidence": 0.75,
                "trust_score": 0.68,
                "visual_cues": [
                    {
                        "cue_name": "Body Condition Score",
                        "detected": True,
                        "confidence": 0.72,
                        "description": "Moderate body condition observed"
                    },
                    {
                        "cue_name": "Coat Quality",
                        "detected": True,
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
                "disclaimer": "This is a NON-DIAGNOSTIC tool. This does NOT replace veterinary consultation. Always consult a qualified veterinarian for medical diagnosis and treatment."
            }
        }

