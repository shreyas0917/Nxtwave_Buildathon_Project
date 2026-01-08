"""
API endpoints for feedback system
"""

from fastapi import APIRouter, HTTPException
import uuid
from datetime import datetime

from app.schemas.feedback import FeedbackRequest, FeedbackResponse
from app.services.feedback_service import FeedbackService
from app.services.trust_service import TrustService

router = APIRouter()


@router.post("/submit-feedback", response_model=FeedbackResponse)
async def submit_feedback(request: FeedbackRequest):
    """
    Submit feedback on prediction accuracy
    
    Used to:
    - Improve trust scores
    - Aggregate regional trends
    - Human-in-the-loop validation
    
    All feedback is anonymized and aggregated.
    """
    try:
        feedback_service = FeedbackService()
        trust_service = TrustService()
        
        # Store feedback
        feedback_id = await feedback_service.store_feedback(request)
        
        # Update community feedback (aggregated, anonymized)
        await trust_service.update_community_feedback(
            prediction_type=request.prediction_type,
            outcome=request.outcome,
            region=request.region
        )
        
        response = FeedbackResponse(
            feedback_id=feedback_id,
            status="received",
            message="Thank you for your feedback. This helps improve the system for all farmers.",
            timestamp=datetime.utcnow()
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error submitting feedback: {str(e)}"
        )

