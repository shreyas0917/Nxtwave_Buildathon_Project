"""
API endpoints for AI Advisor
"""

from fastapi import APIRouter, HTTPException

from app.schemas.advisor import AdvisorRequest, AdvisorResponse
from app.services.advisor_service import AdvisorService

router = APIRouter()


@router.post("/ask-advisor", response_model=AdvisorResponse)
async def ask_advisor(request: AdvisorRequest):
    """
    Get AI-powered care guidance (RAG-based)
    
    Provides general livestock care advice based on:
    - Farmer's question
    - Context (breed, risk level, etc.)
    - Regional knowledge base
    
    **IMPORTANT**: This is general guidance only. Does NOT constitute medical diagnosis.
    """
    try:
        advisor_service = AdvisorService()
        
        # Generate answer using RAG
        answer = await advisor_service.generate_answer(
            question=request.question,
            language=request.language,
            context=request.context,
            region=request.region
        )
        
        response = AdvisorResponse(
            answer=answer["answer"],
            sources=answer["sources"],
            confidence=answer["confidence"],
            disclaimer="This is general care guidance only. This does NOT constitute medical diagnosis or treatment. Always consult a qualified veterinarian for medical decisions."
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating advisor response: {str(e)}"
        )

