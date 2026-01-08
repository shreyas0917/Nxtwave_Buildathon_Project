"""
API endpoints for breed identification
"""

from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse
from typing import Optional
import base64
import io
import logging

from app.schemas.breed import BreedPredictionResponse
from app.services.breed_service import BreedService
from app.services.trust_service import TrustService
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger("livestock_ai")


@router.post("/predict-breed", response_model=BreedPredictionResponse)
async def predict_breed(
    request: Request,
    file: Optional[UploadFile] = File(None)
):
    """
    Identify Indian cattle/buffalo breed from image
    
    Accepts either:
    - Multipart form with image file
    - JSON with base64 encoded image
    
    Returns breed prediction with confidence, trust score, and explainability.
    """
    try:
        # Get image data
        image_data = None
        region = None
        
        # Check if it's a JSON request (not multipart)
        content_type = request.headers.get("content-type", "")
        
        if file:
            # Validate file type
            if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid image type. Allowed: {settings.ALLOWED_IMAGE_TYPES}"
                )
            
            # Read image
            image_bytes = await file.read()
            if len(image_bytes) > settings.MAX_UPLOAD_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail=f"Image too large. Max size: {settings.MAX_UPLOAD_SIZE} bytes"
                )
            image_data = image_bytes
        elif "application/json" in content_type:
            # Handle JSON request with base64 image
            try:
                body = await request.json()
                image_base64 = body.get("image_base64")
                
                if not image_base64:
                    raise HTTPException(
                        status_code=400,
                        detail="Missing 'image_base64' in request body"
                    )
                
                # Get region if provided
                region = body.get("region")
                
                # Handle data URL format (data:image/jpeg;base64,...)
                base64_str = image_base64
                if ',' in base64_str:
                    base64_str = base64_str.split(',')[1]
                
                image_data = base64.b64decode(base64_str)
                region = body.get("region")
            except json.JSONDecodeError:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid JSON in request body"
                )
            except Exception as e:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Invalid base64 image: {str(e)}"
                )
        else:
            raise HTTPException(
                status_code=400, 
                detail="No image provided. Send either 'image_base64' in JSON body or upload a file as multipart/form-data."
            )
        
        # Initialize services (use singleton for breed service to cache model)
        from app.services.breed_service import get_breed_service
        breed_service = get_breed_service()
        trust_service = TrustService()
        
        # Predict breed (pass region for better heuristic predictions)
        prediction = await breed_service.predict_breed(image_data, region=region)
        
        # Calculate regional validity
        regional_validity = await trust_service.calculate_regional_validity(
            breed=prediction["breed"],
            region=region
        )
        
        # Calculate trust score
        trust_score = trust_service.calculate_trust_score(
            model_confidence=prediction["confidence"],
            regional_validity=regional_validity,
            community_feedback=await trust_service.get_community_feedback(
                breed=prediction["breed"],
                region=region
            )
        )
        
        # Generate Grad-CAM heatmap (always generate, even if fallback)
        grad_cam_heatmap = await breed_service.generate_gradcam(image_data)
        
        # Ensure heatmap is always provided (generate fallback if None)
        if grad_cam_heatmap is None:
            print("Warning: Grad-CAM returned None, generating fallback heatmap")
            # The generate_gradcam method already has fallback logic, but if it still returns None, create a simple one
            try:
                import base64 as b64
                from PIL import Image
                import io
                import numpy as np
                
                # Create a simple colored heatmap
                heatmap = np.ones((224, 224, 3), dtype=np.uint8) * 128
                heatmap_pil = Image.fromarray(heatmap)
                buffer = io.BytesIO()
                heatmap_pil.save(buffer, format="PNG")
                heatmap_b64 = b64.b64encode(buffer.getvalue()).decode()
                grad_cam_heatmap = f"data:image/png;base64,{heatmap_b64}"
            except Exception as e:
                print(f"Failed to generate fallback heatmap: {e}")
                grad_cam_heatmap = None
        
        # Build response
        response = BreedPredictionResponse(
            breed=prediction["breed"],
            confidence=prediction["confidence"],
            trust_score=trust_score,
            regional_validity=regional_validity,
            explanation=prediction["explanation"],
            grad_cam_heatmap=grad_cam_heatmap,
            disclaimer="This is a non-diagnostic tool. Always consult a veterinarian for medical decisions."
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing breed prediction: {str(e)}"
        )

