from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
import dlib

app = Flask(__name__)

# Load face detection models
face_detector = dlib.get_frontal_face_detector()

# Example liveness detection placeholder function
def detect_liveness(image):
    # Placeholder logic for actual liveness detection
    return True

# Process image input and detect face/liveness
@app.route('/detect_face', methods=['POST'])
def detect_face():
    data = request.json
    if 'image' not in data:
        return jsonify({"status": "error", "message": "No image provided."}), 400

    try:
        # Decode the base64 image
        img_data = base64.b64decode(data['image'])
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Face Detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_detector(gray)

        if len(faces) == 0:
            return jsonify({"status": "fail", "message": "No face detected."})

        # Liveness Detection (placeholder)
        if not detect_liveness(img):
            return jsonify({"status": "fail", "message": "Spoof face detected."})

        return jsonify({"status": "success", "message": "Face detected and verified."})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
