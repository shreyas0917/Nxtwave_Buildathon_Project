"""
Pydantic schemas for AI Advisor
"""

from pydantic import BaseModel, Field
from typing import Optional, List


class AdvisorRequest(BaseModel):
    """Request schema for AI advisor"""
    question: str = Field(..., min_length=1, max_length=500, description="Farmer's question")
    language: str = Field(default="en", description="Preferred language (en, hi, mr, ta, te)")
    context: Optional[dict] = Field(None, description="Context (breed, risk level, etc.)")
    region: Optional[str] = Field(None, description="State/District for localized advice")


class AdvisorResponse(BaseModel):
    """Response schema for AI advisor"""
    answer: str = Field(..., description="AI-generated answer")
    sources: List[str] = Field(default_factory=list, description="Knowledge base sources used")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Answer confidence")
    disclaimer: str = Field(
        default="This is general care guidance only. This does NOT constitute medical diagnosis or treatment. Always consult a qualified veterinarian for medical decisions.",
        description="Medical disclaimer"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "answer": "For Gir cattle, ensure adequate clean water (40-50 liters daily), balanced nutrition with green fodder, and regular health monitoring. In Gujarat region, watch for heat stress during summer months.",
                "sources": ["ICAR Livestock Care Guidelines", "Gir Breed Management Manual"],
                "confidence": 0.85,
                "disclaimer": "This is general care guidance only. This does NOT constitute medical diagnosis or treatment. Always consult a qualified veterinarian for medical decisions."
            }
        }

