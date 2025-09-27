#!/bin/bash

# Startup script for the Image Chatbot Project
# This script activates the uv environment and runs the Flask application

echo "=== Image Chatbot Project Startup ==="
echo "Current directory: $(pwd)"
echo

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ uv is not installed. Please install it first:"
    echo "curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

echo "✓ uv is available"

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment with uv..."
    uv venv
fi

echo "✓ Virtual environment ready"

# Install/sync dependencies
echo "Installing dependencies..."
uv sync

echo "✓ Dependencies installed"

# Run tests
echo "Running tests..."
uv run python test_model.py

if [ $? -eq 0 ]; then
    echo
    echo "🚀 Starting Flask application..."
    echo "The application will be available at: http://localhost:5000"
    echo "Press Ctrl+C to stop the server"
    echo
    uv run python app.py
else
    echo "❌ Tests failed. Please check the issues above."
    exit 1
fi
