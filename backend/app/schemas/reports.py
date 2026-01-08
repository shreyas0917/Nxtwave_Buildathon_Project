"""
Schemas for health reports and analytics
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from app.schemas.risk import RiskLevel


class HealthReportRequest(BaseModel):
    """Request to generate health report"""
    animal_id: Optional[str] = Field(None, description="Animal identifier")
    breed: Optional[str] = Field(None, description="Breed name")
    assessments: List[Dict] = Field(..., description="List of assessment records")
    start_date: Optional[datetime] = Field(None, description="Report start date")
    end_date: Optional[datetime] = Field(None, description="Report end date")


class HealthReportResponse(BaseModel):
    """Health report response"""
    report_id: str = Field(..., description="Unique report ID")
    pdf_url: Optional[str] = Field(None, description="PDF download URL")
    summary: Dict = Field(..., description="Report summary")
    generated_at: datetime = Field(..., description="Report generation timestamp")


class BatchAssessmentRequest(BaseModel):
    """Request for batch assessment"""
    images: List[str] = Field(..., description="List of base64 encoded images")
    animal_ids: Optional[List[str]] = Field(None, description="Optional animal IDs")
    region: Optional[str] = Field(None, description="Region")


class BatchAssessmentResponse(BaseModel):
    """Batch assessment response"""
    results: List[Dict] = Field(..., description="Assessment results for each image")
    total_processed: int = Field(..., description="Total images processed")
    success_count: int = Field(..., description="Successful assessments")
    error_count: int = Field(..., description="Failed assessments")


class ComparisonRequest(BaseModel):
    """Request for comparison analysis"""
    comparison_type: str = Field(..., description="Type: 'breed', 'time', 'region'")
    items: List[str] = Field(..., description="Items to compare")
    period: Optional[str] = Field("last_30_days", description="Time period")


class ComparisonResponse(BaseModel):
    """Comparison analysis response"""
    comparison_type: str
    items: List[Dict] = Field(..., description="Comparison data for each item")
    insights: List[str] = Field(..., description="Key insights")


class RecommendationRequest(BaseModel):
    """Request for care recommendations"""
    breed: Optional[str] = Field(None, description="Breed")
    risk_level: RiskLevel = Field(..., description="Current risk level")
    visual_cues: List[str] = Field(default=[], description="Detected visual cues")
    region: Optional[str] = Field(None, description="Region")
    season: Optional[str] = Field(None, description="Current season")


class RecommendationResponse(BaseModel):
    """Care recommendations response"""
    recommendations: List[Dict] = Field(..., description="List of recommendations")
    priority: str = Field(..., description="Priority level: High/Medium/Low")
    estimated_impact: str = Field(..., description="Estimated impact description")

