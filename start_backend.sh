#!/bin/bash
echo "========================================"
echo "Starting Livestock AI Platform Backend"
echo "========================================"
cd backend
python3 init_models.py
python3 start.py

