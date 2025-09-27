#!/bin/bash

# Startup script for the Grape Disease Detection Chatbot

echo "🌿 Starting Grape Disease Detection Chatbot..."

# Navigate to project directory
cd "/home/codelab/dev/Files(1)/image chatbot project"

# Activate virtual environment
echo "📦 Activating virtual environment..."
source .venv/bin/activate

# Install any missing dependencies
echo "🔧 Checking dependencies..."
uv pip install Flask flask-cors torch torchvision Pillow

# Start the Flask application
echo "🚀 Starting Flask server..."
echo "📱 Access the application at: http://localhost:5000"
echo "⏹️  Press Ctrl+C to stop the server"

python app.py
