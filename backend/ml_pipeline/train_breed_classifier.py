"""
Training script for breed classification model with improved accuracy
Includes data augmentation, better architecture, and advanced training techniques
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, optimizers, callbacks
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
from pathlib import Path
import argparse
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight
from PIL import Image
import os
import json


def create_data_augmentation():
    """Create data augmentation pipeline for better generalization"""
    return keras.Sequential([
        layers.RandomRotation(0.15),
        layers.RandomTranslation(0.1, 0.1),
        layers.RandomZoom(0.1),
        layers.RandomFlip("horizontal"),
        layers.RandomContrast(0.1),
        layers.RandomBrightness(0.1),
    ])


def load_dataset(data_dir, img_size=(224, 224)):
    """
    Load and preprocess dataset with better preprocessing
    
    Expected structure:
    data_dir/
        breed1/
            image1.jpg
            image2.jpg
        breed2/
            ...
    """
    images = []
    labels = []
    breed_names = sorted([d for d in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, d))])
    
    print(f"Found {len(breed_names)} breeds: {breed_names}")
    
    for breed_idx, breed_name in enumerate(breed_names):
        breed_dir = os.path.join(data_dir, breed_name)
        image_files = [f for f in os.listdir(breed_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        print(f"Loading {len(image_files)} images for {breed_name}...")
        
        for img_file in image_files:
            img_path = os.path.join(breed_dir, img_file)
            try:
                img = Image.open(img_path).convert('RGB')
                img = img.resize(img_size, Image.Resampling.LANCZOS)  # Better resampling
                img_array = np.array(img) / 255.0
                
                # Validate image
                if img_array.shape == (*img_size, 3):
                    images.append(img_array)
                    labels.append(breed_idx)
            except Exception as e:
                print(f"Error loading {img_path}: {e}")
                continue
    
    return np.array(images), np.array(labels), breed_names


def create_improved_model(num_classes, img_size=(256, 256), use_efficientnet=True, model_size='b4'):
    """
    Create state-of-the-art breed classifier with maximum accuracy
    
    Args:
        num_classes: Number of breed classes
        img_size: Input image size (256x256 for B4/B5, 224x224 for smaller)
        use_efficientnet: Use EfficientNet (better accuracy) or MobileNetV3 (lighter)
        model_size: EfficientNet size ('b0', 'b1', 'b2', 'b3', 'b4', 'b5')
    """
    # Choose base model - try larger models first for maximum accuracy
    if use_efficientnet:
        base_model = None
        model_map = {
            'b5': lambda: keras.applications.EfficientNetB5(
                input_shape=(*img_size, 3),
                include_top=False,
                weights='imagenet',
                pooling=None
            ),
            'b4': lambda: keras.applications.EfficientNetB4(
                input_shape=(*img_size, 3),
                include_top=False,
                weights='imagenet',
                pooling=None
            ),
            'b3': lambda: keras.applications.EfficientNetB3(
                input_shape=(*img_size, 3),
                include_top=False,
                weights='imagenet',
                pooling=None
            ),
            'b2': lambda: keras.applications.EfficientNetB2(
                input_shape=(*img_size, 3),
                include_top=False,
                weights='imagenet',
                pooling=None
            ),
            'b1': lambda: keras.applications.EfficientNetB1(
                input_shape=(*img_size, 3),
                include_top=False,
                weights='imagenet',
                pooling=None
            ),
            'b0': lambda: keras.applications.EfficientNetB0(
                input_shape=(*img_size, 3),
                include_top=False,
                weights='imagenet',
                pooling=None
            )
        }
        
        # Try requested model size, then fallback to smaller
        model_order = [model_size] + ['b3', 'b2', 'b1', 'b0']
        for size in model_order:
            if size in model_map:
                try:
                    base_model = model_map[size]()
                    print(f"✅ Using EfficientNet{size.upper()} for maximum accuracy")
                    break
                except Exception as e:
                    print(f"⚠️ EfficientNet{size.upper()} not available: {e}")
                    continue
        
        if base_model is None:
            print("EfficientNet not available, using MobileNetV3")
            base_model = keras.applications.MobileNetV3Small(
                input_shape=(*img_size, 3),
                include_top=False,
                weights='imagenet'
            )
    else:
        base_model = keras.applications.MobileNetV3Small(
            input_shape=(*img_size, 3),
            include_top=False,
            weights='imagenet'
        )
    
    # Freeze base initially
    base_model.trainable = False
    
    # Data augmentation
    data_augmentation = create_data_augmentation()
    
    # Enhanced custom head
    inputs = keras.Input(shape=(*img_size, 3))
    x = data_augmentation(inputs)
    x = base_model(x, training=False)
    
    # Use both GlobalAveragePooling and GlobalMaxPooling
    gap = layers.GlobalAveragePooling2D()(x)
    gmp = layers.GlobalMaxPooling2D()(x)
    x = layers.Concatenate()([gap, gmp])
    
    # Batch normalization
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.3)(x)
    
    # Deeper head with better regularization
    x1 = layers.Dense(256, activation='relu')(x)
    x1 = layers.BatchNormalization()(x1)
    x1 = layers.Dropout(0.3)(x1)
    
    x2 = layers.Dense(128, activation='relu')(x1)
    x2 = layers.BatchNormalization()(x2)
    x2 = layers.Dropout(0.2)(x2)
    
    outputs = layers.Dense(num_classes, activation='softmax', name='breed_output')(x2)
    
    model = keras.Model(inputs, outputs, name='improved_breed_classifier')
    return model


def train_model(
    data_dir,
    output_dir,
    epochs=100,
    batch_size=32,
    validation_split=0.2,
    learning_rate=0.001,
    use_efficientnet=True,
    use_class_weights=True
):
    """
    Train improved breed classification model with advanced techniques
    
    Features:
    - Data augmentation
    - Class weights for imbalanced data
    - Learning rate scheduling
    - Early stopping
    - Model checkpointing
    - Fine-tuning
    """
    
    # Load dataset
    print("Loading dataset...")
    images, labels, breed_names = load_dataset(data_dir)
    
    if len(images) == 0:
        raise ValueError("No images found in dataset directory")
    
    print(f"Loaded {len(images)} images")
    
    # Split data with stratification
    X_train, X_val, y_train, y_val = train_test_split(
        images, labels, 
        test_size=validation_split, 
        random_state=42, 
        stratify=labels,
        shuffle=True
    )
    
    print(f"Training samples: {len(X_train)}, Validation samples: {len(X_val)}")
    
    # Compute class weights for imbalanced datasets
    class_weights = None
    if use_class_weights:
        unique_labels = np.unique(y_train)
        class_weights_dict = compute_class_weight(
            'balanced',
            classes=unique_labels,
            y=y_train
        )
        class_weights = dict(zip(unique_labels, class_weights_dict))
        print(f"Class weights: {class_weights}")
    
    # Create model
    num_classes = len(breed_names)
    model = create_improved_model(num_classes, use_efficientnet=use_efficientnet)
    
    # Compile with better optimizer settings
    model.compile(
        optimizer=optimizers.Adam(
            learning_rate=learning_rate,
            beta_1=0.9,
            beta_2=0.999,
            epsilon=1e-07
        ),
        loss='sparse_categorical_crossentropy',
        metrics=[
            'accuracy',
            keras.metrics.TopKCategoricalAccuracy(k=3, name='top_3_accuracy'),
            keras.metrics.TopKCategoricalAccuracy(k=5, name='top_5_accuracy')
        ]
    )
    
    # Advanced callbacks
    callbacks_list = [
        callbacks.ModelCheckpoint(
            os.path.join(output_dir, 'breed_classifier_best.h5'),
            save_best_only=True,
            monitor='val_accuracy',
            mode='max',
            verbose=1
        ),
        callbacks.EarlyStopping(
            monitor='val_accuracy',
            patience=15,
            restore_best_weights=True,
            verbose=1
        ),
        callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=7,
            min_lr=1e-7,
            verbose=1
        ),
        callbacks.CosineRestartScheduler(
            T_0=10,
            T_mult=2,
            eta_min=1e-7
        ) if hasattr(callbacks, 'CosineRestartScheduler') else callbacks.LearningRateScheduler(
            lambda epoch: learning_rate * (0.9 ** epoch)
        )
    ]
    
    # Train Phase 1: Frozen base model
    print("=" * 50)
    print("Phase 1: Training with frozen base model")
    print("=" * 50)
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=epochs,
        batch_size=batch_size,
        callbacks=callbacks_list,
        class_weight=class_weights,
        verbose=1
    )
    
    # Fine-tuning Phase 2: Unfreeze base model
    print("=" * 50)
    print("Phase 2: Fine-tuning (unfreezing base model)")
    print("=" * 50)
    
    # Unfreeze base model layers gradually
    base_model = model.layers[2]  # Base model is after input and augmentation
    base_model.trainable = True
    
    # Fine-tune only top layers first
    for layer in base_model.layers[:-30]:  # Freeze bottom layers
        layer.trainable = False
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=optimizers.Adam(learning_rate=learning_rate / 10),
        loss='sparse_categorical_crossentropy',
        metrics=[
            'accuracy',
            keras.metrics.TopKCategoricalAccuracy(k=3, name='top_3_accuracy'),
            keras.metrics.TopKCategoricalAccuracy(k=5, name='top_5_accuracy')
        ]
    )
    
    # Continue training
    history_finetune = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=epochs // 2,
        batch_size=batch_size // 2,  # Smaller batch for fine-tuning
        callbacks=callbacks_list,
        class_weight=class_weights,
        verbose=1
    )
    
    # Phase 3: Full fine-tuning
    print("=" * 50)
    print("Phase 3: Full fine-tuning (all layers)")
    print("=" * 50)
    
    # Unfreeze all layers
    for layer in base_model.layers:
        layer.trainable = True
    
    model.compile(
        optimizer=optimizers.Adam(learning_rate=learning_rate / 50),
        loss='sparse_categorical_crossentropy',
        metrics=[
            'accuracy',
            keras.metrics.TopKCategoricalAccuracy(k=3, name='top_3_accuracy'),
            keras.metrics.TopKCategoricalAccuracy(k=5, name='top_5_accuracy')
        ]
    )
    
    history_full_finetune = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=epochs // 4,
        batch_size=batch_size // 2,
        callbacks=callbacks_list,
        class_weight=class_weights,
        verbose=1
    )
    
    # Save final model
    final_model_path = os.path.join(output_dir, 'breed_classifier.h5')
    model.save(final_model_path)
    print(f"Model saved to {final_model_path}")
    
    # Save breed names and metadata
    with open(os.path.join(output_dir, 'breed_names.json'), 'w') as f:
        json.dump(breed_names, f, indent=2)
    
    # Save training history
    history_dict = {
        'phase1': {k: [float(v) for v in vals] for k, vals in history.history.items()},
        'phase2': {k: [float(v) for v in vals] for k, vals in history_finetune.history.items()},
        'phase3': {k: [float(v) for v in vals] for k, vals in history_full_finetune.history.items()}
    }
    with open(os.path.join(output_dir, 'training_history.json'), 'w') as f:
        json.dump(history_dict, f, indent=2)
    
    # Print final metrics
    print("\n" + "=" * 50)
    print("Training Complete!")
    print("=" * 50)
    print(f"Final Validation Accuracy: {max(history_full_finetune.history['val_accuracy']):.4f}")
    print(f"Final Top-3 Accuracy: {max(history_full_finetune.history['val_top_3_accuracy']):.4f}")
    print(f"Final Top-5 Accuracy: {max(history_full_finetune.history['val_top_5_accuracy']):.4f}")
    
    return model, breed_names


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Train improved breed classification model')
    parser.add_argument('--data_dir', type=str, required=True, help='Path to dataset directory')
    parser.add_argument('--output_dir', type=str, default='models', help='Output directory for model')
    parser.add_argument('--epochs', type=int, default=100, help='Number of epochs per phase')
    parser.add_argument('--batch_size', type=int, default=32, help='Batch size')
    parser.add_argument('--validation_split', type=float, default=0.2, help='Validation split ratio')
    parser.add_argument('--learning_rate', type=float, default=0.001, help='Initial learning rate')
    parser.add_argument('--use_efficientnet', action='store_true', help='Use EfficientNet instead of MobileNetV3')
    parser.add_argument('--no_class_weights', action='store_true', help='Disable class weights')
    
    args = parser.parse_args()
    
    # Create output directory
    os.makedirs(args.output_dir, exist_ok=True)
    
    # Train
    train_model(
        data_dir=args.data_dir,
        output_dir=args.output_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        validation_split=args.validation_split,
        learning_rate=args.learning_rate,
        use_efficientnet=args.use_efficientnet,
        use_class_weights=not args.no_class_weights
    )
