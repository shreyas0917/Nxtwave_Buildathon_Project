"""
Tests for health risk assessment API
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
import base64
from PIL import Image
import io

client = TestClient(app)


def create_test_image():
    """Create a test image"""
    img = Image.new('RGB', (224, 224), color='blue')
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG')
    buffer.seek(0)
    return buffer.getvalue()


def test_risk_assessment_with_json():
    """Test risk assessment with JSON base64 image"""
    image_bytes = create_test_image()
    image_base64 = base64.b64encode(image_bytes).decode()
    
    response = client.post(
        "/api/v1/predict-risk",
        json={
            "image_base64": f"data:image/jpeg;base64,{image_base64}",
            "breed": "Gir",
            "region": "Gujarat"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Check required fields
    assert "risk_level" in data
    assert "confidence" in data
    assert "trust_score" in data
    assert "visual_cues" in data
    assert "factors" in data
    assert "explanation" in data
    assert "disclaimer" in data
    
    # Check data types and values
    assert data["risk_level"] in ["Low", "Medium", "High"]
    assert isinstance(data["confidence"], float)
    assert isinstance(data["trust_score"], float)
    assert isinstance(data["visual_cues"], list)
    assert isinstance(data["factors"], list)
    assert 0 <= data["confidence"] <= 1
    assert 0 <= data["trust_score"] <= 1


def test_risk_assessment_without_breed():
    """Test risk assessment without breed parameter"""
    image_bytes = create_test_image()
    image_base64 = base64.b64encode(image_bytes).decode()
    
    response = client.post(
        "/api/v1/predict-risk",
        json={"image_base64": f"data:image/jpeg;base64,{image_base64}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "risk_level" in data


def test_risk_assessment_invalid_image():
    """Test risk assessment with invalid image data"""
    response = client.post(
        "/api/v1/predict-risk",
        json={"image_base64": "invalid_base64_data"}
    )
    
    assert response.status_code == 400


def test_risk_assessment_missing_image():
    """Test risk assessment without image"""
    response = client.post(
        "/api/v1/predict-risk",
        json={}
    )
    
    assert response.status_code == 400


def test_risk_assessment_disclaimer():
    """Test that risk assessment includes strong disclaimer"""
    image_bytes = create_test_image()
    image_base64 = base64.b64encode(image_bytes).decode()
    
    response = client.post(
        "/api/v1/predict-risk",
        json={"image_base64": f"data:image/jpeg;base64,{image_base64}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Check disclaimer is present and strong
    disclaimer = data["disclaimer"].lower()
    assert "non-diagnostic" in disclaimer
    assert "veterinar" in disclaimer
    assert "not replace" in disclaimer or "does not replace" in disclaimer
