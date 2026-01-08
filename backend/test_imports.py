#!/usr/bin/env python3
"""
Test script to verify all imports work correctly
"""

print("Testing imports...")

try:
    import tensorflow as tf
    print(f"OK TensorFlow: {tf.__version__}")
except Exception as e:
    print(f"ERROR TensorFlow: {e}")

try:
    from tensorflow import keras
    print(f"OK Keras: {keras.__version__}")
except Exception as e:
    print(f"ERROR Keras: {e}")

try:
    import torch
    print(f"OK PyTorch: {torch.__version__}")
except Exception as e:
    print(f"ERROR PyTorch: {e}")

try:
    import fastapi
    print(f"OK FastAPI: {fastapi.__version__}")
except Exception as e:
    print(f"ERROR FastAPI: {e}")

try:
    import numpy as np
    print(f"OK NumPy: {np.__version__}")
except Exception as e:
    print(f"ERROR NumPy: {e}")

try:
    from sentence_transformers import SentenceTransformer
    print("OK Sentence Transformers")
except Exception as e:
    print(f"ERROR Sentence Transformers: {e}")

try:
    import faiss
    print("OK FAISS")
except Exception as e:
    print(f"ERROR FAISS: {e}")

try:
    from app.models.breed_classifier import BreedClassifier
    print("OK BreedClassifier import")
except Exception as e:
    print(f"ERROR BreedClassifier: {e}")

try:
    from app.models.risk_assessor import RiskAssessor
    print("OK RiskAssessor import")
except Exception as e:
    print(f"ERROR RiskAssessor: {e}")

try:
    from app.models.gradcam import GradCAMExplainer
    print("OK GradCAMExplainer import")
except Exception as e:
    print(f"ERROR GradCAMExplainer: {e}")

print("\nAll imports tested!")
