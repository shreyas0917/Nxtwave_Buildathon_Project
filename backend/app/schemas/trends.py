"""
Pydantic schemas for health trends
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from app.schemas.risk import RiskLevel


class TrendDataPoint(BaseModel):
    """Single data point in trend"""
    date: datetime = Field(..., description="Date of data point")
    risk_level: RiskLevel = Field(..., description="Risk level")
    count: int = Field(..., ge=0, description="Number of assessments")
    average_confidence: float = Field(..., ge=0.0, le=1.0, description="Average confidence")


class BreedTrend(BaseModel):
    """Breed-specific trend data"""
    breed: str = Field(..., description="Breed name")
    total_assessments: int = Field(..., ge=0)
    low_risk_count: int = Field(..., ge=0)
    medium_risk_count: int = Field(..., ge=0)
    high_risk_count: int = Field(..., ge=0)
    average_confidence: float = Field(..., ge=0.0, le=1.0)


class TimeSeriesPoint(BaseModel):
    """Time series data point"""
    date: str = Field(..., description="Date string (YYYY-MM-DD)")
    low_risk: int = Field(..., ge=0)
    medium_risk: int = Field(..., ge=0)
    high_risk: int = Field(..., ge=0)
    total: int = Field(..., ge=0)
    avg_confidence: float = Field(..., ge=0.0, le=1.0)


class VisualCueTrend(BaseModel):
    """Visual cue trend data"""
    cue_name: str = Field(..., description="Visual cue name")
    detected_count: int = Field(..., ge=0)
    total_count: int = Field(..., ge=0)
    detection_rate: float = Field(..., ge=0.0, le=1.0)


class HealthTrendsResponse(BaseModel):
    """Response schema for health trends"""
    district: str = Field(..., description="District name")
    state: str = Field(..., description="State name")
    period: str = Field(..., description="Time period (e.g., 'last_30_days')")
    trends: List[TrendDataPoint] = Field(..., description="Trend data points")
    summary: dict = Field(..., description="Summary statistics")
    time_series: List[TimeSeriesPoint] = Field(default=[], description="Time series data")
    breed_trends: List[BreedTrend] = Field(default=[], description="Breed-specific trends")
    visual_cue_trends: List[VisualCueTrend] = Field(default=[], description="Visual cue trends")
    regional_comparison: Optional[Dict] = Field(default=None, description="Regional comparison data")
    last_updated: Optional[str] = Field(default=None, description="ISO timestamp of last data update")
    disclaimer: str = Field(
        default="Trends are aggregated and anonymized. Individual predictions may vary.",
        description="Privacy disclaimer"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
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
        }

