"""
AI API Client for real AI features
Supports OpenAI Vision API and Hugging Face Inference API
"""

import base64
import io
import json
from typing import Dict, Optional, List
from PIL import Image
import httpx
import os

from app.core.config import settings


class AIAPIClient:
    """Client for AI API services"""
    
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY", settings.OPENAI_API_KEY)
        self.huggingface_api_key = os.getenv("HUGGINGFACE_API_KEY", settings.HUGGINGFACE_API_KEY)
        self.use_ai_api = os.getenv("USE_AI_API", str(settings.USE_AI_API)).lower() == "true"
        self.use_ai_api = self.use_ai_api or bool(self.openai_api_key) or bool(self.huggingface_api_key)
    
    async def analyze_image_with_openai(
        self,
        image_data: bytes,
        prompt: str = "Analyze this image of a cattle or buffalo. Identify the breed if possible, and assess any visible health indicators. Respond in JSON format with 'breed', 'confidence', 'health_indicators', and 'description'."
    ) -> Optional[Dict]:
        """Analyze image using OpenAI Vision API"""
        if not self.openai_api_key:
            return None
        
        try:
            # Convert image to base64
            image_base64 = base64.b64encode(image_data).decode()
            
            # Use OpenAI Vision API
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.openai_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-4o-mini",  # Cost-effective model
                        "messages": [
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": prompt
                                    },
                                    {
                                        "type": "image_url",
                                        "image_url": {
                                            "url": f"data:image/jpeg;base64,{image_base64}"
                                        }
                                    }
                                ]
                            }
                        ],
                        "max_tokens": 500,
                        "temperature": 0.3
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result["choices"][0]["message"]["content"]
                    
                    # Try to parse JSON response
                    try:
                        # Remove markdown code blocks if present
                        if "```json" in content:
                            content = content.split("```json")[1].split("```")[0].strip()
                        elif "```" in content:
                            content = content.split("```")[1].split("```")[0].strip()
                        
                        return json.loads(content)
                    except:
                        # If not JSON, return as description
                        return {
                            "description": content,
                            "confidence": 0.85,
                            "breed": "Unknown/Mixed"
                        }
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return None
    
    async def analyze_image_with_huggingface(
        self,
        image_data: bytes,
        task: str = "image-classification",
        model: str = "google/vit-base-patch16-224"
    ) -> Optional[Dict]:
        """Analyze image using Hugging Face Inference API"""
        if not self.huggingface_api_key:
            return None
        
        try:
            # Hugging Face Inference API accepts raw image bytes
            api_url = f"https://api-inference.huggingface.co/models/{model}"
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    api_url,
                    headers={
                        "Authorization": f"Bearer {self.huggingface_api_key}",
                    },
                    content=image_data  # Send raw image bytes
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "predictions": result,
                        "model": model,
                        "confidence": 0.85  # Default confidence for HF API
                    }
                elif response.status_code == 503:
                    # Model is loading
                    print("Hugging Face model is loading, please try again in a moment")
                    return None
        except Exception as e:
            print(f"Hugging Face API error: {e}")
            return None
        
        return None
    
    async def generate_text_with_huggingface(
        self,
        prompt: str,
        model: str = "mistralai/Mistral-7B-Instruct-v0.2",
        max_tokens: int = 300
    ) -> Optional[str]:
        """Generate text using Hugging Face Inference API"""
        if not self.huggingface_api_key:
            return None
        
        try:
            api_url = f"https://api-inference.huggingface.co/models/{model}"
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    api_url,
                    headers={
                        "Authorization": f"Bearer {self.huggingface_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "inputs": prompt,
                        "parameters": {
                            "max_new_tokens": max_tokens,
                            "temperature": 0.7,
                            "return_full_text": False
                        }
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    # Handle different response formats
                    if isinstance(result, list) and len(result) > 0:
                        if isinstance(result[0], dict):
                            generated_text = result[0].get("generated_text", "")
                        else:
                            generated_text = str(result[0])
                        # Remove prompt if it's included in response
                        if prompt in generated_text:
                            generated_text = generated_text.split(prompt)[-1].strip()
                        return generated_text.strip()
                    elif isinstance(result, dict) and "generated_text" in result:
                        generated_text = result["generated_text"]
                        if prompt in generated_text:
                            generated_text = generated_text.split(prompt)[-1].strip()
                        return generated_text.strip()
                elif response.status_code == 503:
                    print("Hugging Face model is loading, using fallback")
                    return None
        except Exception as e:
            print(f"Hugging Face API error: {e}")
            return None
        
        return None
    
    async def generate_text_with_openai(
        self,
        prompt: str,
        max_tokens: int = 300,
        temperature: float = 0.7
    ) -> Optional[str]:
        """Generate text using OpenAI API"""
        if not self.openai_api_key:
            return None
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.openai_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-4o-mini",
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are an AI assistant specialized in livestock care and health advice for Indian dairy farmers. Always emphasize that you are non-diagnostic and recommend veterinary consultation."
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "max_tokens": max_tokens,
                        "temperature": temperature
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return None
        
        return None


# Global instance
_ai_api_client = None

def get_ai_api_client() -> AIAPIClient:
    """Get singleton AI API client"""
    global _ai_api_client
    if _ai_api_client is None:
        _ai_api_client = AIAPIClient()
    return _ai_api_client
