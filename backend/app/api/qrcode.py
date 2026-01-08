"""
API endpoints for QR code generation
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
import qrcode
import io
import json
from typing import Optional

router = APIRouter()


@router.get("/generate-qr/{animal_id}")
async def generate_qr_code(animal_id: str, breed: Optional[str] = None):
    """
    Generate QR code for animal tracking
    
    QR code contains:
    - Animal ID
    - Breed information
    - Quick access link
    """
    try:
        # Create QR code data
        qr_data = {
            "animal_id": animal_id,
            "breed": breed,
            "platform": "Livestock AI Platform",
            "url": f"https://livestock-ai.in/animal/{animal_id}"
        }
        
        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(json.dumps(qr_data))
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to bytes
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        
        return Response(
            content=buffer.getvalue(),
            media_type="image/png",
            headers={
                "Content-Disposition": f"attachment; filename=qr_{animal_id}.png"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating QR code: {str(e)}"
        )

