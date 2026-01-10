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
    
    # Storage Paths (relative to backend directory)
    STORAGE_DIR: str = "storage"
    REPORTS_DIR: str = "storage/reports"
    UPLOADS_DIR: str = "storage/uploads"
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

