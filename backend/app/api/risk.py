"""
API endpoints for health risk assessment
"""

from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse
from typing import Optional
import base64
import io

from app.schemas.risk import RiskPredictionResponse
from app.services.risk_service import RiskService
from app.services.trust_service import TrustService
from app.core.config import settings

router = APIRouter()


@router.post("/predict-risk", response_model=RiskPredictionResponse)
async def predict_risk(
    request: Request,
    file: Optional[UploadFile] = File(None)
):
    """
    Assess non-diagnostic health risk level from image
    
    Accepts either:
    - Multipart form with image file
    - JSON with base64 encoded image
    
    Returns:
    - Risk level: Low / Medium / High
    - Visual cues detected
    - Explainability heatmap
    - Trust score
    
    **IMPORTANT**: This is NON-DIAGNOSTIC. Does NOT replace veterinary consultation.
    """
    try:
        # Get image data
        image_data = None
        breed = None
        region = None
        
        content_type = request.headers.get("content-type", "")
        
        if file:
            if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid image type. Allowed: {settings.ALLOWED_IMAGE_TYPES}"
                )
            
            image_bytes = await file.read()
            if len(image_bytes) > settings.MAX_UPLOAD_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail=f"Image too large. Max size: {settings.MAX_UPLOAD_SIZE} bytes"
                )
            image_data = image_bytes
            
        elif "application/json" in content_type:
            try:
                body = await request.json()
                image_base64 = body.get("image_base64")
                breed = body.get("breed")
                region = body.get("region")
                
                if not image_base64:
                    raise HTTPException(
                        status_code=400,
                        detail="Missing 'image_base64' in request body"
                    )
                
                # Remove data URL prefix if present
                if "," in image_base64:
                    image_base64 = image_base64.split(",")[1]
                
                image_data = base64.b64decode(image_base64)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Invalid JSON or base64 image: {str(e)}")
        else:
            raise HTTPException(
                status_code=400, 
                detail="No image provided. Send either 'image_base64' in JSON body or upload a file as multipart/form-data."
            )
        
        # Initialize services
        risk_service = RiskService()
        trust_service = TrustService()
        
        # Predict risk
        prediction = await risk_service.predict_risk(
            image_data=image_data,
            breed=breed
        )
        
        # Calculate trust score
        trust_score = trust_service.calculate_trust_score(
            model_confidence=prediction["confidence"],
            regional_validity=1.0,  # Risk assessment doesn't depend on region
            community_feedback=await trust_service.get_community_feedback(
                breed=breed,
                region=region
            )
        )
        
        # Generate Grad-CAM heatmap
        grad_cam_heatmap = await risk_service.generate_gradcam(image_data)
        
        # Build response
        response = RiskPredictionResponse(
            risk_level=prediction["risk_level"],
            confidence=prediction["confidence"],
            trust_score=trust_score,
            visual_cues=prediction["visual_cues"],
            factors=prediction["factors"],
            explanation=prediction["explanation"],
            grad_cam_heatmap=grad_cam_heatmap,
            disclaimer="This is a NON-DIAGNOSTIC tool. This does NOT replace veterinary consultation. Always consult a qualified veterinarian for medical diagnosis and treatment."
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing risk prediction: {str(e)}"
        )

