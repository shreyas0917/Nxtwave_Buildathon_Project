# Installation Guide

## Backend Installation

### Step 1: Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### Step 2: Upgrade pip

```bash
python -m pip install --upgrade pip
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

**Note:** If you encounter any version conflicts, you can install packages individually or use:

```bash
pip install --upgrade -r requirements.txt
```

### Step 4: Initialize Models

```bash
python init_models.py
```

This will create placeholder models if they don't exist.

### Step 5: Start Backend

```bash
python start.py
```

Backend will be available at: http://localhost:8000

## Frontend Installation

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

Frontend will be available at: http://localhost:3000

## Troubleshooting

### TensorFlow Installation Issues

If TensorFlow installation fails:

1. **Upgrade pip first:**
   ```bash
   python -m pip install --upgrade pip
   ```

2. **Install TensorFlow separately:**
   ```bash
   pip install tensorflow
   ```

3. **Then install other requirements:**
   ```bash
   pip install -r requirements.txt
   ```

### NumPy Compatibility

If you get NumPy compatibility errors, you can pin to a specific version:

```bash
pip install "numpy>=1.26.0,<2.0.0"
```

### Package Version Conflicts

If you encounter version conflicts:

1. **Install without version constraints:**
   ```bash
   pip install fastapi uvicorn tensorflow torch pillow numpy opencv-python
   ```

2. **Then install remaining packages:**
   ```bash
   pip install -r requirements.txt --no-deps
   pip install -r requirements.txt
   ```

### Windows-Specific Issues

On Windows, you might need:

```bash
# Install Visual C++ Build Tools if you get compilation errors
# Download from: https://visualstudio.microsoft.com/downloads/

# Or use pre-built wheels
pip install --only-binary :all: -r requirements.txt
```

## Verification

### Check Backend

```bash
python -c "import tensorflow as tf; print('TensorFlow:', tf.__version__)"
python -c "import fastapi; print('FastAPI:', fastapi.__version__)"
```

### Check Frontend

```bash
cd frontend
npm list react react-dom
```

## System Requirements

- **Python**: 3.11 or higher
- **Node.js**: 18 or higher
- **RAM**: 8GB+ recommended (for ML models)
- **Disk Space**: 5GB+ (for dependencies and models)

## Next Steps

After installation:
1. Run `python init_models.py` to create placeholder models
2. Start backend: `python start.py`
3. Start frontend: `npm run dev`
4. Open http://localhost:3000 in your browser

