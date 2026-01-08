#!/usr/bin/env python3
"""
Initialize placeholder models if they don't exist
This allows the app to start even without trained models
"""

import os
from pathlib import Path
import tensorflow as tf
from tensorflow import keras

def create_placeholder_models():
    """Create placeholder models for demo purposes"""
    
    models_dir = Path("ml_pipeline/models")
    models_dir.mkdir(parents=True, exist_ok=True)
    
    breed_model_path = models_dir / "breed_classifier.h5"
    risk_model_path = models_dir / "risk_assessor.h5"
    
    print("🔧 Initializing placeholder models...")
    
    # Create placeholder breed classifier
    if not breed_model_path.exists():
        print("Creating placeholder breed classifier...")
        base_model = keras.applications.MobileNetV3Small(
            input_shape=(224, 224, 3),
            include_top=False,
            weights='imagenet'
        )
        base_model.trainable = False
        
        inputs = keras.Input(shape=(224, 224, 3))
        x = base_model(inputs, training=False)
        x = keras.layers.GlobalAveragePooling2D()(x)
        x = keras.layers.Dropout(0.2)(x)
        x = keras.layers.Dense(128, activation='relu')(x)
        x = keras.layers.Dropout(0.2)(x)
        outputs = keras.layers.Dense(21, activation='softmax')(x)
        
        model = keras.Model(inputs, outputs)
        model.compile(optimizer='adam', loss='sparse_categorical_crossentropy')
        model.save(str(breed_model_path))
        print(f"✅ Created: {breed_model_path}")
    
    # Create placeholder risk assessor
    if not risk_model_path.exists():
        print("Creating placeholder risk assessor...")
        base_model = keras.applications.EfficientNetB0(
            input_shape=(224, 224, 3),
            include_top=False,
            weights='imagenet'
        )
        base_model.trainable = False
        
        inputs = keras.Input(shape=(224, 224, 3))
        x = base_model(inputs, training=False)
        x = keras.layers.GlobalAveragePooling2D()(x)
        x = keras.layers.Dense(64, activation='relu')(x)
        
        bcs_output = keras.layers.Dense(1, activation='sigmoid', name='bcs')(x)
        coat_output = keras.layers.Dense(1, activation='sigmoid', name='coat')(x)
        discharge_output = keras.layers.Dense(1, activation='sigmoid', name='discharge')(x)
        
        model = keras.Model(inputs, [bcs_output, coat_output, discharge_output])
        model.compile(
            optimizer='adam',
            loss={'bcs': 'mse', 'coat': 'mse', 'discharge': 'mse'},
            loss_weights={'bcs': 0.4, 'coat': 0.3, 'discharge': 0.3}
        )
        model.save(str(risk_model_path))
        print(f"✅ Created: {risk_model_path}")
    
    print("✅ Model initialization complete!")
    print("⚠️  Note: These are placeholder models. Train with real data for production use.")

if __name__ == "__main__":
    create_placeholder_models()

