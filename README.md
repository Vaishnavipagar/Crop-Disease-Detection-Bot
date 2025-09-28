# Crop Disease Prediction Chatbot

## Project Overview
The **Crop Disease Prediction Chatbot** is an AI-powered application designed to help farmers and agricultural enthusiasts quickly identify diseases in crop leaves using image-based inputs. By leveraging a Convolutional Neural Network (CNN), the system provides accurate predictions and recommendations to manage crop health effectively.

## Features
- Upload crop leaf images to detect diseases.
- Provides detailed information about the disease, its symptoms, and preventive measures.
- Interactive chatbot interface for seamless user experience.
- Fast and accurate predictions using a trained CNN model.
- Multi-crop support with an extensive knowledge base.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Flask (Python)
- **Machine Learning:** Convolutional Neural Network (CNN), TensorFlow/Keras
- **Database/Knowledge Base:** JSON or SQLite
- **Deployment:** Local server / Cloud deployment options

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd crop-disease-chatbot
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask application:
   ```bash
   python app.py
   ```
5. Open your browser and go to:
   ```
   http://127.0.0.1:5000
   ```

## Usage
1. Upload an image of the crop leaf.
2. The chatbot will process the image and identify the disease.
3. Receive recommendations and preventive measures for managing the disease.

## Dataset
The model is trained on publicly available crop disease datasets, which include images of healthy and diseased leaves for multiple crops.

## Model
- Model Architecture: CNN-based (lightweight for faster inference)
- Input: Crop leaf image
- Output: Predicted disease label with accuracy

## Future Improvements
- Support for more crops and diseases.
- Mobile app integration.
- Real-time disease detection using camera feed.
- Enhanced knowledge base with video tutorials.

## Authors
- Vaishnavi Pagar

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any queries, please contact: vaishnavipagar31@gmail.com

