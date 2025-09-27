from flask import Flask, request, jsonify, render_template, session
from flask_cors import CORS
import os
from src.model import predict_image
from src.dict import get_dict, diseases_leaf, healthy_leaf

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config["UPLOAD_FOLDER"] = "uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


@app.route("/")
def index():
    return render_template("upload_new.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        if "leaf" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["leaf"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(file_path)  # ✅ Use your real prediction function
        result = predict_image(file_path)

        # Clean up the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)

        return jsonify(result)
    except Exception as e:
        print(f"Error in analyze route: {str(e)}")
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


@app.route("/command", methods=["POST"])
def handle_command():
    data = request.get_json()
    command = data.get("command")
    disease_class = data.get("disease")

    if not disease_class:
        return jsonify({"reply": "Please upload and analyze an image first!"})

    disease_info = get_dict(disease_class)

    if not disease_info:
        return jsonify({"reply": "Disease information not found."})

    if command == "description":
        info = f"Description: {disease_info.get('Description', 'No description available.')}"
    elif command == "symptoms":
        info = f"Symptoms: {disease_info.get('Symptoms', 'No symptoms information available.')}"
    elif command == "solutions":
        solutions = disease_info.get("Solutions", {})
        info = "Solutions:\n"
        for category, treatments in solutions.items():
            info += f"  {category}:\n"
            if isinstance(treatments, list):
                for treatment in treatments:
                    info += f"    - {treatment}\n"
            else:
                info += f"    - {treatments}\n"
    elif command == "cultural":
        cultural = disease_info.get("Solutions", {}).get("Cultural", [])
        info = "Cultural Solutions:\n"
        if isinstance(cultural, list):
            for treatment in cultural:
                info += f"  - {treatment}\n"
        else:
            info += f"  - {cultural}"
    elif command == "chemical":
        chemical = disease_info.get("Solutions", {}).get("Chemical", [])
        info = "Chemical Solutions:\n"
        if isinstance(chemical, list):
            for treatment in chemical:
                info += f"  - {treatment}\n"
        else:
            info += f"  - {chemical}"
    elif command == "organic":
        organic = disease_info.get("Solutions", {}).get("Organic", [])
        info = "Organic Solutions:\n"
        if isinstance(organic, list):
            for treatment in organic:
                info += f"  - {treatment}\n"
        else:
            info += f"  - {organic}"
    elif command == "prevention":
        cultural = disease_info.get("Solutions", {}).get("Cultural", [])
        info = "Prevention Tips (Cultural Methods):\n"
        if isinstance(cultural, list):
            for treatment in cultural:
                info += f"  - {treatment}\n"
        else:
            info += f"  - {cultural}"
    elif command == "product":
        products = disease_info.get("Product", {})
        if products:
            info = "Recommended Products:\n"
            for product, link in products.items():
                info += f"  - {product}: {link}\n"
        else:
            info = "No specific products recommended for this disease."
    elif command == "full_info":
        info = f"Name: {disease_info.get('Name', 'Unknown')}\n"
        info += f"Description: {disease_info.get('Description', 'No description available.')}\n"
        info += (
            f"Symptoms: {disease_info.get('Symptoms', 'No symptoms information.')}\n"
        )
        info += "\nSolutions:\n"
        solutions = disease_info.get("Solutions", {})
        for category, treatments in solutions.items():
            info += f"  {category}:\n"
            if isinstance(treatments, list):
                for treatment in treatments:
                    info += f"    - {treatment}\n"
            else:
                info += f"    - {treatments}\n"
    else:
        info = "Invalid command. Please select a valid option from the dropdown."

    return jsonify({"info": info})


if __name__ == "__main__":
    app.run(debug=True)
