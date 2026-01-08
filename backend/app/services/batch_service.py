"""
Service for batch processing multiple animals
"""

import base64
from typing import List, Dict
from app.schemas.reports import BatchAssessmentRequest, BatchAssessmentResponse
from app.services.breed_service import get_breed_service
from app.services.risk_service import RiskService


class BatchService:
    """Service for batch animal assessments"""
    
    def __init__(self):
        self.breed_service = get_breed_service()
        self.risk_service = RiskService()
    
    async def process_batch(self, request: BatchAssessmentRequest) -> BatchAssessmentResponse:
        """Process multiple images in batch"""
        results = []
        success_count = 0
        error_count = 0
        
        for idx, image_base64 in enumerate(request.images):
            try:
                # Decode image
                if "," in image_base64:
                    image_base64 = image_base64.split(",")[1]
                
                image_data = base64.b64decode(image_base64)
                animal_id = request.animal_ids[idx] if request.animal_ids and idx < len(request.animal_ids) else None
                
                # Predict breed
                breed_result = await self.breed_service.predict_breed(image_data)
                
                # Assess risk
                risk_result = await self.risk_service.predict_risk(
                    image_data=image_data,
                    breed=breed_result.get("breed")
                )
                
                results.append({
                    "animal_id": animal_id,
                    "breed": breed_result.get("breed"),
                    "breed_confidence": breed_result.get("confidence"),
                    "risk_level": risk_result.get("risk_level").value if hasattr(risk_result.get("risk_level"), 'value') else str(risk_result.get("risk_level")),
                    "risk_confidence": risk_result.get("confidence"),
                    "visual_cues": [cue.cue_name for cue in risk_result.get("visual_cues", [])],
                    "status": "success"
                })
                success_count += 1
            except Exception as e:
                results.append({
                    "animal_id": animal_id if 'animal_id' in locals() else None,
                    "status": "error",
                    "error": str(e)
                })
                error_count += 1
        
        return BatchAssessmentResponse(
            results=results,
            total_processed=len(request.images),
            success_count=success_count,
            error_count=error_count
        )

