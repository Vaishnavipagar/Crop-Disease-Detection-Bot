#!/usr/bin/env python3
"""
Test script to verify model loading and prediction functionality
"""
import os
import sys

def test_imports():
    """Test if all required packages can be imported"""
    try:
        import torch
        print(f"✓ PyTorch version: {torch.__version__}")
    except ImportError as e:
        print(f"✗ Failed to import torch: {e}")
        return False
        
    try:
        import torchvision
        print(f"✓ Torchvision version: {torchvision.__version__}")
    except ImportError as e:
        print(f"✗ Failed to import torchvision: {e}")
        return False
        
    try:
        from PIL import Image
        print(f"✓ PIL imported successfully")
    except ImportError as e:
        print(f"✗ Failed to import PIL: {e}")
        return False
        
    try:
        import flask
        print(f"✓ Flask version: {flask.__version__}")
    except ImportError as e:
        print(f"✗ Failed to import Flask: {e}")
        return False
        
    return True

def test_model_loading():
    """Test if the model can be loaded"""
    try:
        from src.model import disease_model, disease_classes
        print(f"✓ Model loaded successfully")
        print(f"✓ Disease classes: {disease_classes}")
        return True
    except Exception as e:
        print(f"✗ Failed to load model: {e}")
        return False

def test_model_file():
    """Test if the model file exists"""
    model_path = "best_resnet9_hybrid_model.pth"
    if os.path.exists(model_path):
        print(f"✓ Model file exists: {model_path}")
        file_size = os.path.getsize(model_path) / (1024 * 1024)  # MB
        print(f"✓ Model file size: {file_size:.2f} MB")
        return True
    else:
        print(f"✗ Model file not found: {model_path}")
        return False

def test_prediction():
    """Test prediction with a sample image"""
    try:
        from src.model import predict_image
        
        # Check if there are any sample images in uploads folder
        uploads_dir = "uploads"
        if os.path.exists(uploads_dir):
            image_files = [f for f in os.listdir(uploads_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            if image_files:
                sample_image = os.path.join(uploads_dir, image_files[0])
                print(f"✓ Testing with sample image: {sample_image}")
                result = predict_image(sample_image)
                print(f"✓ Prediction result: {result}")
                return True
            else:
                print("ℹ No sample images found in uploads folder")
                return True
        else:
            print("ℹ Uploads folder not found")
            return True
    except Exception as e:
        print(f"✗ Prediction test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=== Testing Image Chatbot Project ===\n")
    
    all_passed = True
    
    print("1. Testing imports...")
    all_passed &= test_imports()
    print()
    
    print("2. Testing model file...")
    all_passed &= test_model_file()
    print()
    
    print("3. Testing model loading...")
    all_passed &= test_model_loading()
    print()
    
    print("4. Testing prediction...")
    all_passed &= test_prediction()
    print()
    
    if all_passed:
        print("🎉 All tests passed! The project should work correctly.")
    else:
        print("❌ Some tests failed. Please check the issues above.")
    
    return all_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
