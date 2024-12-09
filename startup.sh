#!/bin/bash

echo "npm version"
npm --version
echo "node version"
node -v

# 1. Naviga nella directory frontend e installa le dipendenze Node.js
echo "Entering frontend directory..."
cd frontend
ls .
echo "Installing Node.js dependencies..."
npm install  --loglevel verbose

# 2. Build del frontend
echo "Building React app..."
npm run build

# 4. Torna alla directory root e poi al backend
echo "Entering backend directory..."
cd ../backend

# 5. Installa le dipendenze Python
echo "Installing Python dependencies..."
pip install -r requirements.txt

# 6. Avvia Gunicorn per eseguire l'app Flask
echo "Starting Flask app with Gunicorn..."
gunicorn app:app --bind=0.0.0.0:8000