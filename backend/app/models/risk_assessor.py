"""
Health risk assessment model (hybrid heuristic + CNN)
"""

import tensorflow as tf
from tensorflow import keras
import numpy as np
from typing import Optional, Tuple


class RiskAssessor:
    """Hybrid model for non-diagnostic health risk assessment"""
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize risk assessor
        
        Args:
            model_path: Path to saved model (if None, creates new model)
        """
        if model_path:
            try:
                self.model = keras.models.load_model(model_path)
            except Exception:
                self.model = self._create_model()
        else:
            self.model = self._create_model()
    
    def _create_model(self) -> keras.Model:
        """Create advanced CNN-based risk assessor with maximum accuracy"""
        # Use larger EfficientNet model for better accuracy
        base_model = None
        input_size = 256
        
        model_attempts = [
            ("EfficientNetB3", lambda: keras.applications.EfficientNetB3(
                input_shape=(input_size, input_size, 3),
                include_top=False,
                weights='imagenet',
                pooling=None
            )),
            ("EfficientNetB2", lambda: keras.applications.EfficientNetB2(
                input_shape=(224, 224, 3),
                include_top=False,
                weights='imagenet',
                pooling=None
            )),
            ("EfficientNetB1", lambda: keras.applications.EfficientNetB1(
                input_shape=(224, 224, 3),
                include_top=False,
                weights='imagenet',
                pooling=None
            )),
            ("EfficientNetB0", lambda: keras.applications.EfficientNetB0(
                input_shape=(224, 224, 3),
                include_top=False,
                weights='imagenet',
                pooling=None
            ))
        ]
        
        for model_name, model_fn in model_attempts:
            try:
                base_model = model_fn()
                print(f"[OK] Using {model_name} for risk assessment")
                if "B3" in model_name:
                    input_size = 256
                else:
                    input_size = 224
                break
            except Exception as e:
                print(f"[WARNING] {model_name} not available: {e}")
                continue
        
        if base_model is None:
            base_model = keras.applications.EfficientNetB0(
                input_shape=(224, 224, 3),
                include_top=False,
                weights='imagenet'
            )
            input_size = 224
        
        base_model.trainable = False
        
        # Advanced custom head for risk assessment
        inputs = keras.Input(shape=(input_size, input_size, 3))
        x = base_model(inputs, training=False)
        
        # Multi-scale feature extraction
        gap = keras.layers.GlobalAveragePooling2D()(x)
        gmp = keras.layers.GlobalMaxPooling2D()(x)
        x = keras.layers.Concatenate()([gap, gmp])
        
        # Enhanced feature processing
        x = keras.layers.BatchNormalization()(x)
        x = keras.layers.Dropout(0.3)(x)
        
        # Deeper head for better feature learning
        x1 = keras.layers.Dense(256, activation='relu')(x)
        x1 = keras.layers.BatchNormalization()(x1)
        x1 = keras.layers.Dropout(0.3)(x1)
        
        x2 = keras.layers.Dense(128, activation='relu')(x1)
        x2 = keras.layers.BatchNormalization()(x2)
        x2 = keras.layers.Dropout(0.2)(x2)
        
        # Multi-task outputs for different visual cues with shared features
        shared_features = x2
        
        # Body Condition Score branch
        bcs_branch = keras.layers.Dense(64, activation='relu')(shared_features)
        bcs_branch = keras.layers.BatchNormalization()(bcs_branch)
        bcs_output = keras.layers.Dense(1, activation='sigmoid', name='bcs')(bcs_branch)
        
        # Coat Quality branch
        coat_branch = keras.layers.Dense(64, activation='relu')(shared_features)
        coat_branch = keras.layers.BatchNormalization()(coat_branch)
        coat_output = keras.layers.Dense(1, activation='sigmoid', name='coat')(coat_branch)
        
        # Discharge detection branch
        discharge_branch = keras.layers.Dense(64, activation='relu')(shared_features)
        discharge_branch = keras.layers.BatchNormalization()(discharge_branch)
        discharge_output = keras.layers.Dense(1, activation='sigmoid', name='discharge')(discharge_branch)
        
        model = keras.Model(inputs, [bcs_output, coat_output, discharge_output], name='risk_assessor_advanced')
        
        return model
    
    def assess_risk(
        self,
        image: np.ndarray,
        breed: Optional[str] = None
    ) -> float:
        """
        Assess overall health risk score (0-1)
        
        Higher score = higher risk
        
        Args:
            image: Preprocessed image array
            breed: Known breed (for breed-specific assessment)
            
        Returns:
            Risk score (0-1)
        """
        # Get multi-task predictions
        predictions = self.model.predict_on_batch(image)
        
        bcs_score = float(predictions[0][0] if len(predictions[0].shape) > 0 else predictions[0])
        coat_score = float(predictions[1][0] if len(predictions[1].shape) > 0 else predictions[1])
        discharge_score = float(predictions[2][0] if len(predictions[2].shape) > 0 else predictions[2])
        
        # Combine scores (weighted average)
        # Lower BCS = higher risk, Lower coat = higher risk, Higher discharge = higher risk
        risk_score = (
            (1.0 - bcs_score) * 0.4 +  # Body condition (inverted)
            (1.0 - coat_score) * 0.3 +  # Coat quality (inverted)
            discharge_score * 0.3       # Discharge (direct)
        )
        
        return min(1.0, max(0.0, risk_score))
    
    def assess_body_condition(self, image: np.ndarray) -> Tuple[float, float]:
        """
        Assess body condition score (0-1, higher = better)
        
        Returns:
            (score, confidence)
        """
        predictions = self.model.predict_on_batch(image)
        bcs_score = float(predictions[0][0] if len(predictions[0].shape) > 0 else predictions[0])
        confidence = 0.75  # Simplified - in production, use model uncertainty
        return bcs_score, confidence
    
    def assess_coat_quality(self, image: np.ndarray) -> Tuple[float, float]:
        """
        Assess coat quality (0-1, higher = better)
        
        Returns:
            (score, confidence)
        """
        predictions = self.model.predict_on_batch(image)
        coat_score = float(predictions[1][0] if len(predictions[1].shape) > 0 else predictions[1])
        confidence = 0.70
        return coat_score, confidence
    
    def assess_discharge(self, image: np.ndarray) -> Tuple[float, float]:
        """
        Assess eye/nose discharge (0-1, higher = more discharge)
        
        Returns:
            (score, confidence)
        """
        predictions = self.model.predict_on_batch(image)
        discharge_score = float(predictions[2][0] if len(predictions[2].shape) > 0 else predictions[2])
        confidence = 0.65
        return discharge_score, confidence

