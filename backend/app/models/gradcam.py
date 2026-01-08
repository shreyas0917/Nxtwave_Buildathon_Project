"""
Advanced Grad-CAM explainability for model predictions
Improved visualization with better heatmap generation
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras
from typing import Optional

# Try to import cv2 for Gaussian blur
try:
    import cv2
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False
    cv2 = None
    print("Warning: OpenCV not available, skipping Gaussian blur")


class GradCAMExplainer:
    """Advanced Grad-CAM explainer for model interpretability"""
    
    def __init__(self, model: keras.Model):
        """
        Initialize Grad-CAM explainer
        
        Args:
            model: Trained Keras model
        """
        self.model = model
        self.last_conv_layer = self._find_last_conv_layer()
        if self.last_conv_layer is None:
            print("Warning: No convolutional layer found for Grad-CAM")
    
    def _find_last_conv_layer(self) -> Optional[keras.layers.Layer]:
        """Find the last convolutional layer in the model"""
        last_conv = None
        
        # Strategy 1: Look for base model (EfficientNet/MobileNet)
        for layer in self.model.layers:
            if hasattr(layer, 'layers') and len(layer.layers) > 10:
                # This is likely the base model
                # Find the last conv layer in it
                for sublayer in reversed(layer.layers):
                    if isinstance(sublayer, (keras.layers.Conv2D, keras.layers.DepthwiseConv2D,
                                            keras.layers.SeparableConv2D)):
                        last_conv = sublayer
                        print(f"Found conv layer in base model: {sublayer.name}")
                        break
                if last_conv:
                    break
        
        # Strategy 2: Look directly in model layers
        if last_conv is None:
            for layer in reversed(self.model.layers):
                if isinstance(layer, (keras.layers.Conv2D, keras.layers.DepthwiseConv2D,
                                     keras.layers.SeparableConv2D)):
                    last_conv = layer
                    print(f"Found conv layer: {layer.name}")
                    break
        
        return last_conv
    
    def explain(
        self,
        image: np.ndarray,
        class_idx: Optional[int] = None
    ) -> np.ndarray:
        """
        Generate improved Grad-CAM heatmap with better visualization
        
        Args:
            image: Preprocessed image array (1, H, W, 3)
            class_idx: Class index to explain (if None, uses top prediction)
            
        Returns:
            Heatmap array (H, W) normalized to [0, 1] with better contrast
        """
        if self.last_conv_layer is None:
            # Fallback: return center-focused heatmap
            return self._generate_fallback_heatmap(image.shape[1:3] if len(image.shape) > 2 else (224, 224))
        
        try:
            # Simple approach: use the last conv layer output directly
            # Create a model that outputs both the conv layer and predictions
            grad_model = keras.Model(
                inputs=self.model.inputs,
                outputs=[self.last_conv_layer.output, self.model.output]
            )
            
            # Get predictions first to determine class
            _, predictions = grad_model(image, training=False)
            
            if class_idx is None:
                class_idx = int(np.argmax(predictions[0]))
            
            # Now compute gradients
            with tf.GradientTape() as tape:
                conv_outputs, predictions = grad_model(image, training=False)
                class_output = predictions[:, class_idx]
            
            # Compute gradients
            grads = tape.gradient(class_output, conv_outputs)
            
            # Check if gradients are valid
            if grads is None:
                print("Warning: Gradients are None, using fallback")
                return self._generate_fallback_heatmap(image.shape[1:3] if len(image.shape) > 2 else (224, 224))
            
            # Global average pooling of gradients (Grad-CAM)
            pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
            
            # Weight the feature maps
            conv_outputs = conv_outputs[0]
            heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
            heatmap = tf.squeeze(heatmap)
            
            # Apply ReLU to get only positive contributions
            heatmap = tf.maximum(heatmap, 0)
            
            # Normalize to [0, 1]
            heatmap_max = tf.reduce_max(heatmap)
            if heatmap_max > 1e-8:
                heatmap = heatmap / heatmap_max
            else:
                # If all zeros, create a center-focused heatmap
                return self._generate_fallback_heatmap(image.shape[1:3] if len(image.shape) > 2 else (224, 224))
            
            # Resize to original image size
            heatmap = tf.image.resize(
                tf.expand_dims(heatmap, axis=-1),
                (image.shape[1], image.shape[2])
            )
            heatmap = tf.squeeze(heatmap).numpy()
            
            # Apply Gaussian blur for smoother visualization
            if CV2_AVAILABLE:
                try:
                    heatmap = cv2.GaussianBlur(heatmap, (11, 11), 0)
                except:
                    pass
            
            # Enhance contrast using power transformation (gamma correction)
            # Lower power = more contrast (highlights important areas)
            heatmap = np.power(heatmap, 0.3)  # Strong contrast enhancement
            
            # Re-normalize
            if heatmap.max() > 0:
                heatmap = heatmap / heatmap.max()
            
            return heatmap.astype(np.float32)
            
        except Exception as e:
            # Fallback on error
            print(f"Grad-CAM error: {e}")
            import traceback
            traceback.print_exc()
            return self._generate_fallback_heatmap(image.shape[1:3] if len(image.shape) > 2 else (224, 224))
    
    def _generate_fallback_heatmap(self, shape: tuple) -> np.ndarray:
        """Generate a simple fallback heatmap"""
        height, width = shape[:2] if len(shape) >= 2 else (224, 224)
        center_x, center_y = width // 2, height // 2
        
        # Create radial gradient using numpy (faster)
        y_coords, x_coords = np.ogrid[:height, :width]
        dist_from_center = np.sqrt((x_coords - center_x)**2 + (y_coords - center_y)**2)
        max_dist = np.sqrt(center_x**2 + center_y**2)
        heatmap = np.clip(1.0 - (dist_from_center / max_dist), 0, 1).astype(np.float32)
        
        return heatmap
