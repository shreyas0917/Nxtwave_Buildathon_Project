"""
Training script for health risk assessment model
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, optimizers, callbacks
import numpy as np
from pathlib import Path
import argparse
from sklearn.model_selection import train_test_split
from PIL import Image
import os
import json


def load_risk_dataset(data_dir, img_size=(224, 224)):
    """
    Load risk assessment dataset
    
    Expected structure:
    data_dir/
        low_risk/
            image1.jpg
        medium_risk/
            image2.jpg
        high_risk/
            image3.jpg
    
    Or with annotations:
    data_dir/
        images/
            image1.jpg
        annotations.json (with risk labels)
    """
    images = []
    bcs_scores = []  # Body Condition Score (0-1)
    coat_scores = []  # Coat quality (0-1)
    discharge_scores = []  # Discharge presence (0-1)
    
    # Check if using annotation file
    annotation_file = os.path.join(data_dir, 'annotations.json')
    if os.path.exists(annotation_file):
        with open(annotation_file, 'r') as f:
            annotations = json.load(f)
        
        for img_name, ann in annotations.items():
            img_path = os.path.join(data_dir, 'images', img_name)
            if os.path.exists(img_path):
                try:
                    img = Image.open(img_path).convert('RGB')
                    img = img.resize(img_size)
                    img_array = np.array(img) / 255.0
                    images.append(img_array)
                    
                    # Extract scores from annotations
                    bcs_scores.append(ann.get('bcs', 0.5))
                    coat_scores.append(ann.get('coat', 0.5))
                    discharge_scores.append(ann.get('discharge', 0.0))
                except Exception as e:
                    print(f"Error loading {img_path}: {e}")
                    continue
    else:
        # Load from directory structure
        risk_levels = ['low_risk', 'medium_risk', 'high_risk']
        for risk_level in risk_levels:
            risk_dir = os.path.join(data_dir, risk_level)
            if not os.path.exists(risk_dir):
                continue
            
            image_files = [f for f in os.listdir(risk_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            
            for img_file in image_files:
                img_path = os.path.join(risk_dir, img_file)
                try:
                    img = Image.open(img_path).convert('RGB')
                    img = img.resize(img_size)
                    img_array = np.array(img) / 255.0
                    images.append(img_array)
                    
                    # Assign scores based on risk level
                    if risk_level == 'low_risk':
                        bcs_scores.append(0.8)
                        coat_scores.append(0.8)
                        discharge_scores.append(0.1)
                    elif risk_level == 'medium_risk':
                        bcs_scores.append(0.5)
                        coat_scores.append(0.6)
                        discharge_scores.append(0.3)
                    else:  # high_risk
                        bcs_scores.append(0.3)
                        coat_scores.append(0.4)
                        discharge_scores.append(0.7)
                except Exception as e:
                    print(f"Error loading {img_path}: {e}")
                    continue
    
    return (
        np.array(images),
        np.array(bcs_scores),
        np.array(coat_scores),
        np.array(discharge_scores)
    )


def create_risk_model(img_size=(224, 224)):
    """Create EfficientNet-based risk assessor"""
    # Base model
    base_model = keras.applications.EfficientNetB0(
        input_shape=(*img_size, 3),
        include_top=False,
        weights='imagenet'
    )
    
    base_model.trainable = False
    
    # Multi-task head
    inputs = keras.Input(shape=(*img_size, 3))
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(64, activation='relu')(x)
    
    # Three outputs
    bcs_output = layers.Dense(1, activation='sigmoid', name='bcs')(x)
    coat_output = layers.Dense(1, activation='sigmoid', name='coat')(x)
    discharge_output = layers.Dense(1, activation='sigmoid', name='discharge')(x)
    
    model = keras.Model(inputs, [bcs_output, coat_output, discharge_output])
    return model


def train_risk_model(
    data_dir,
    output_dir,
    epochs=50,
    batch_size=32,
    validation_split=0.2,
    learning_rate=0.001
):
    """Train risk assessment model"""
    
    print("Loading dataset...")
    images, bcs_scores, coat_scores, discharge_scores = load_risk_dataset(data_dir)
    
    if len(images) == 0:
        raise ValueError("No images found in dataset directory")
    
    print(f"Loaded {len(images)} images")
    
    # Split data
    X_train, X_val, y_bcs_train, y_bcs_val, y_coat_train, y_coat_val, y_discharge_train, y_discharge_val = train_test_split(
        images, bcs_scores, coat_scores, discharge_scores,
        test_size=validation_split, random_state=42
    )
    
    print(f"Training samples: {len(X_train)}, Validation samples: {len(X_val)}")
    
    # Create model
    model = create_risk_model()
    
    # Compile with multi-task loss
    model.compile(
        optimizer=optimizers.Adam(learning_rate=learning_rate),
        loss={
            'bcs': 'mse',
            'coat': 'mse',
            'discharge': 'mse'
        },
        loss_weights={
            'bcs': 0.4,
            'coat': 0.3,
            'discharge': 0.3
        },
        metrics=['mae']
    )
    
    # Callbacks
    callbacks_list = [
        callbacks.ModelCheckpoint(
            os.path.join(output_dir, 'risk_assessor_best.h5'),
            save_best_only=True,
            monitor='val_loss',
            mode='min'
        ),
        callbacks.EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        ),
        callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7
        )
    ]
    
    # Train
    print("Training model...")
    history = model.fit(
        X_train,
        {
            'bcs': y_bcs_train,
            'coat': y_coat_train,
            'discharge': y_discharge_train
        },
        validation_data=(
            X_val,
            {
                'bcs': y_bcs_val,
                'coat': y_coat_val,
                'discharge': y_discharge_val
            }
        ),
        epochs=epochs,
        batch_size=batch_size,
        callbacks=callbacks_list,
        verbose=1
    )
    
    # Fine-tuning
    print("Fine-tuning...")
    base_model = model.layers[1]
    base_model.trainable = True
    
    model.compile(
        optimizer=optimizers.Adam(learning_rate=learning_rate / 10),
        loss={
            'bcs': 'mse',
            'coat': 'mse',
            'discharge': 'mse'
        },
        loss_weights={
            'bcs': 0.4,
            'coat': 0.3,
            'discharge': 0.3
        },
        metrics=['mae']
    )
    
    history_finetune = model.fit(
        X_train,
        {
            'bcs': y_bcs_train,
            'coat': y_coat_train,
            'discharge': y_discharge_train
        },
        validation_data=(
            X_val,
            {
                'bcs': y_bcs_val,
                'coat': y_coat_val,
                'discharge': y_discharge_val
            }
        ),
        epochs=epochs // 2,
        batch_size=batch_size,
        callbacks=callbacks_list,
        verbose=1
    )
    
    # Save final model
    final_model_path = os.path.join(output_dir, 'risk_assessor.h5')
    model.save(final_model_path)
    print(f"Model saved to {final_model_path}")
    
    print("Training complete!")
    return model


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Train risk assessment model')
    parser.add_argument('--data_dir', type=str, required=True, help='Path to dataset directory')
    parser.add_argument('--output_dir', type=str, default='models', help='Output directory for model')
    parser.add_argument('--epochs', type=int, default=50, help='Number of epochs')
    parser.add_argument('--batch_size', type=int, default=32, help='Batch size')
    parser.add_argument('--validation_split', type=float, default=0.2, help='Validation split ratio')
    parser.add_argument('--learning_rate', type=float, default=0.001, help='Learning rate')
    
    args = parser.parse_args()
    
    os.makedirs(args.output_dir, exist_ok=True)
    
    train_risk_model(
        data_dir=args.data_dir,
        output_dir=args.output_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        validation_split=args.validation_split,
        learning_rate=args.learning_rate
    )

