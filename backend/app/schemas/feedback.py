"""
Pydantic schemas for feedback system
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from enum import Enum


class FeedbackOutcome(str, Enum):
    """Feedback outcome types"""
    IMPROVED = "improved"
    NO_CHANGE = "no_change"
    VET_CONFIRMED = "vet_confirmed"
    VET_DISAGREED = "vet_disagreed"


class FeedbackRequest(BaseModel):
    """Request schema for feedback submission"""
    prediction_id: Optional[str] = Field(None, description="ID of original prediction")
    prediction_type: Literal["breed", "risk"] = Field(..., description="Type of prediction")
    outcome: FeedbackOutcome = Field(..., description="Actual outcome")
    region: str = Field(..., description="State/District (for aggregation)")
    comments: Optional[str] = Field(None, max_length=500, description="Optional comments")
    vet_consulted: bool = Field(default=False, description="Whether veterinarian was consulted")


class FeedbackResponse(BaseModel):
    """Response schema for feedback submission"""
    feedback_id: str = Field(..., description="Unique feedback ID")
    status: str = Field(default="received", description="Feedback status")
    message: str = Field(..., description="Confirmation message")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Submission timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "feedback_id": "fb_1234567890",
                "status": "received",
                "message": "Thank you for your feedback. This helps improve the system.",
                "timestamp": "2024-01-15T10:30:00Z"
            }
        }

