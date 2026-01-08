"""
API endpoints for health trends
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from app.schemas.trends import HealthTrendsResponse
from app.services.trends_service import TrendsService

router = APIRouter()


@router.get("/health-trends", response_model=HealthTrendsResponse)
async def get_health_trends(
    district: Optional[str] = Query(None, description="District name"),
    state: Optional[str] = Query(None, description="State name"),
    period: str = Query("last_30_days", description="Time period (last_7_days, last_30_days, last_90_days)")
):
    """
    Get aggregated health trends by region
    
    Returns anonymized, aggregated trends for:
    - Risk level distribution
    - Confidence trends
    - Temporal patterns
    
    All data is anonymized and aggregated. No individual predictions are exposed.
    """
    try:
        trends_service = TrendsService()
        
        trends = await trends_service.get_trends(
            district=district,
            state=state,
            period=period
        )
        
        return trends
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching health trends: {str(e)}"
        )

