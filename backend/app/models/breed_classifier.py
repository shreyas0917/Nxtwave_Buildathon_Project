"""
Breed classification model (MobileNetV3-based)
"""

import tensorflow as tf
from tensorflow import keras
import numpy as np
from typing import Optional


class BreedClassifier:
    """Lightweight CNN for Indian livestock breed identification"""
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize breed classifier
        
        Args:
            model_path: Path to saved model (if None, creates new model)
        """
        if model_path:
            try:
                self.model = keras.models.load_model(model_path)
            except Exception:
                # If model doesn't exist, create a new one
                self.model = self._create_model()
        else:
            self.model = self._create_model()
    
    def _create_model(self) -> keras.Model:
        """
        Create state-of-the-art breed classifier with maximum accuracy
        
        Uses EfficientNetB4/B5 for best accuracy with larger input size
        Enhanced with attention mechanisms and advanced architecture
        """
        # Try progressively larger EfficientNet models for maximum accuracy
        # B4/B5 provide best accuracy, B3 is good balance
        base_model = None
        input_size = 256  # Larger input for better accuracy
        
        model_attempts = [
            ("EfficientNetB5", lambda: keras.applications.EfficientNetB5(
                input_shape=(input_size, input_size, 3),
                include_top=False,
                weights='imagenet',
                pooling=None
            )),
            ("EfficientNetB4", lambda: keras.applications.EfficientNetB4(
                input_shape=(input_size, input_size, 3),
                include_top=False,
                weights='imagenet',
                pooling=None
            )),
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
                print(f"[OK] Using {model_name} for maximum accuracy")
                if "B5" in model_name or "B4" in model_name:
                    input_size = 256
                else:
                    input_size = 224
                break
            except Exception as e:
                print(f"[WARNING] {model_name} not available: {e}")
                continue
        
        if base_model is None:
            # Final fallback
            base_model = keras.applications.MobileNetV3Small(
                input_shape=(224, 224, 3),
                include_top=False,
                weights='imagenet'
            )
            input_size = 224
            print("Using MobileNetV3Small (fallback)")
        
        # Freeze base layers initially (will be unfrozen during fine-tuning)
        base_model.trainable = False
        
        # State-of-the-art custom head with attention and advanced features
        inputs = keras.Input(shape=(input_size, input_size, 3))
        x = base_model(inputs, training=False)
        
        # Multi-scale feature extraction
        gap = keras.layers.GlobalAveragePooling2D()(x)
        gmp = keras.layers.GlobalMaxPooling2D()(x)
        
        # Add attention mechanism for better feature focus
        # Channel attention
        channel_attention = keras.layers.Dense(
            gap.shape[-1] // 4,
            activation='relu',
            use_bias=False
        )(gap)
        channel_attention = keras.layers.Dense(
            gap.shape[-1],
            activation='sigmoid',
            use_bias=False
        )(channel_attention)
        gap_attended = keras.layers.Multiply()([gap, channel_attention])
        
        # Concatenate all features
        x = keras.layers.Concatenate()([gap_attended, gmp])
        
        # Advanced normalization and regularization
        x = keras.layers.BatchNormalization()(x)
        x = keras.layers.Dropout(0.4)(x)
        
        # Deeper, wider head with residual connections
        x1 = keras.layers.Dense(512, activation='relu')(x)
        x1 = keras.layers.BatchNormalization()(x1)
        x1 = keras.layers.Dropout(0.4)(x1)
        
        # Residual connection
        x1_residual = keras.layers.Dense(512, activation='relu')(x1)
        x1_residual = keras.layers.BatchNormalization()(x1_residual)
        x1 = keras.layers.Add()([x1, x1_residual])
        x1 = keras.layers.Dropout(0.3)(x1)
        
        x2 = keras.layers.Dense(256, activation='relu')(x1)
        x2 = keras.layers.BatchNormalization()(x2)
        x2 = keras.layers.Dropout(0.3)(x2)
        
        x3 = keras.layers.Dense(128, activation='relu')(x2)
        x3 = keras.layers.BatchNormalization()(x3)
        x3 = keras.layers.Dropout(0.2)(x3)
        
        # Output: 20 Indian breeds + "Unknown/Mixed"
        outputs = keras.layers.Dense(21, activation='softmax', name='breed_output')(x3)
        
        model = keras.Model(inputs, outputs, name='breed_classifier_advanced')
        
        return model
    
    def predict(self, image: np.ndarray, verbose: int = 0) -> np.ndarray:
        """
        Predict breed probabilities
        
        Args:
            image: Preprocessed image array (1, 224, 224, 3)
            verbose: Verbosity mode (0 = silent, 1 = progress bar)
            
        Returns:
            Probability distribution over breeds
        """
        # Use predict_on_batch for better performance (doesn't support verbose)
        predictions = self.model.predict_on_batch(image)
        return predictions[0] if len(predictions.shape) > 1 else predictions

