"""
Application configuration
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # API Settings
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://livestock-ai.gov.in"  # Production domain
    ]
    
    # ML Model Paths (relative to backend directory)
    BREED_MODEL_PATH: str = "ml_pipeline/models/breed_classifier.h5"
    RISK_MODEL_PATH: str = "ml_pipeline/models/risk_assessor.h5"
    
    # Trust Score Weights
    TRUST_WEIGHT_CONFIDENCE: float = 0.3
    TRUST_WEIGHT_REGIONAL: float = 0.4
    TRUST_WEIGHT_FEEDBACK: float = 0.3
    
    # AI Advisor Settings
    EMBEDDING_MODEL: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    LLM_MODEL: str = "mistral-7b-instruct"  # Local or API
    KNOWLEDGE_BASE_PATH: str = "data/knowledge_base/"
    RAG_TOP_K: int = 3
    
    # Database
    DATABASE_URL: str = "sqlite:///./livestock_ai.db"
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]
    
    # Security
    SECRET_KEY: str = "change-this-in-production"  # Should be set via env
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    
    # Rate Limiting (requests per minute)
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

