"""
API endpoints for health reports and advanced features
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from typing import Optional
import uuid
import os
from datetime import datetime

from app.schemas.reports import (
    HealthReportRequest, HealthReportResponse,
    BatchAssessmentRequest, BatchAssessmentResponse,
    ComparisonRequest, ComparisonResponse,
    RecommendationRequest, RecommendationResponse
)
from app.services.report_service import ReportService
from app.services.batch_service import BatchService
from app.services.comparison_service import ComparisonService
from app.services.recommendation_service import RecommendationService

router = APIRouter()


@router.post("/generate-report", response_model=HealthReportResponse)
async def generate_health_report(request: HealthReportRequest):
    """
    Generate comprehensive health report (PDF)
    
    Creates a detailed health report with:
    - Assessment history
    - Trends and patterns
    - Recommendations
    - Visual charts
    """
    try:
        report_service = ReportService()
        report = await report_service.generate_report(request)
        return report
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating report: {str(e)}"
        )


@router.get("/download-report/{report_id}")
async def download_report(report_id: str):
    """Download generated health report PDF"""
    try:
        report_service = ReportService()
        pdf_path = await report_service.get_report_path(report_id)
        
        if not pdf_path or not os.path.exists(pdf_path):
            raise HTTPException(status_code=404, detail=f"Report not found: {report_id}")
        
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"health_report_{report_id}.pdf",
            headers={"Content-Disposition": f"attachment; filename=health_report_{report_id}.pdf"}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error downloading report: {str(e)}"
        )


@router.post("/batch-assess", response_model=BatchAssessmentResponse)
async def batch_assess(request: BatchAssessmentRequest):
    """
    Process multiple animal images in batch
    
    Efficiently processes multiple images for:
    - Farm-wide health screening
    - Herd management
    - Bulk assessments
    """
    try:
        batch_service = BatchService()
        result = await batch_service.process_batch(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing batch: {str(e)}"
        )


@router.post("/compare", response_model=ComparisonResponse)
async def compare(request: ComparisonRequest):
    """
    Compare breeds, time periods, or regions
    
    Provides comparative analysis for:
    - Breed performance comparison
    - Historical trends
    - Regional differences
    """
    try:
        comparison_service = ComparisonService()
        result = await comparison_service.compare(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error performing comparison: {str(e)}"
        )


@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Get AI-powered care recommendations
    
    Provides personalized recommendations based on:
    - Current health status
    - Breed characteristics
    - Regional factors
    - Seasonal considerations
    """
    try:
        recommendation_service = RecommendationService()
        result = await recommendation_service.get_recommendations(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recommendations: {str(e)}"
        )

