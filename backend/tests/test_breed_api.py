"""
Tests for breed identification API
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
    img = Image.new('RGB', (224, 224), color='red')
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG')
    buffer.seek(0)
    return buffer.getvalue()


def test_root_endpoint():
    """Test root endpoint returns correct information"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Livestock AI Platform API"
    assert "version" in data


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_breed_prediction_with_json():
    """Test breed prediction with JSON base64 image"""
    # Create test image
    image_bytes = create_test_image()
    image_base64 = base64.b64encode(image_bytes).decode()
    
    response = client.post(
        "/api/v1/predict-breed",
        json={
            "image_base64": f"data:image/jpeg;base64,{image_base64}",
            "region": "Gujarat"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Check required fields
    assert "breed" in data
    assert "confidence" in data
    assert "trust_score" in data
    assert "explanation" in data
    assert "disclaimer" in data
    
    # Check data types
    assert isinstance(data["breed"], str)
    assert isinstance(data["confidence"], float)
    assert isinstance(data["trust_score"], float)
    assert 0 <= data["confidence"] <= 1
    assert 0 <= data["trust_score"] <= 1


def test_breed_prediction_without_region():
    """Test breed prediction without region parameter"""
    image_bytes = create_test_image()
    image_base64 = base64.b64encode(image_bytes).decode()
    
    response = client.post(
        "/api/v1/predict-breed",
        json={"image_base64": f"data:image/jpeg;base64,{image_base64}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "breed" in data


def test_breed_prediction_invalid_image():
    """Test breed prediction with invalid image data"""
    response = client.post(
        "/api/v1/predict-breed",
        json={"image_base64": "invalid_base64_data"}
    )
    
    assert response.status_code == 400


def test_breed_prediction_missing_image():
    """Test breed prediction without image"""
    response = client.post(
        "/api/v1/predict-breed",
        json={}
    )
    
    assert response.status_code == 400


def test_breed_prediction_returns_grad_cam():
    """Test that breed prediction returns Grad-CAM heatmap"""
    image_bytes = create_test_image()
    image_base64 = base64.b64encode(image_bytes).decode()
    
    response = client.post(
        "/api/v1/predict-breed",
        json={"image_base64": f"data:image/jpeg;base64,{image_base64}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Should have Grad-CAM heatmap
    assert "grad_cam_heatmap" in data
    # It might be None or a base64 string
    if data["grad_cam_heatmap"]:
        assert isinstance(data["grad_cam_heatmap"], str)
        assert "data:image" in data["grad_cam_heatmap"]


def test_breed_prediction_regional_validity():
    """Test that regional validity is calculated"""
    image_bytes = create_test_image()
    image_base64 = base64.b64encode(image_bytes).decode()
    
    response = client.post(
        "/api/v1/predict-breed",
        json={
            "image_base64": f"data:image/jpeg;base64,{image_base64}",
            "region": "Gujarat"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert "regional_validity" in data
    assert isinstance(data["regional_validity"], float)
    assert 0 <= data["regional_validity"] <= 1
