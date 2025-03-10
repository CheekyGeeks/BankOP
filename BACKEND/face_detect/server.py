# server_app.py (run on your server PC)
from flask import Flask, request, jsonify
import cv2
import numpy as np
import face_recognition

app = Flask(__name__)

# Load known face encodings (example)
known_face_encodings = [...]  # load or define encodings
known_face_names = [...]      # associated names

@app.route('/face-recognition', methods=['POST'])
def recognize_face():
    if 'frame' not in request.files:
        return jsonify({"status": "error", "message": "No frame received"})

    file = request.files['frame']
    npimg = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    # Detect faces
    face_locations = face_recognition.face_locations(frame)
    face_encodings = face_recognition.face_encodings(frame, face_locations)

    for encoding in face_encodings:
        matches = face_recognition.compare_faces(known_face_encodings, encoding)
        if True in matches:
            matched_name = known_face_names[matches.index(True)]
            return jsonify({"status": "authenticated", "user": matched_name})

    return jsonify({"status": "unauthenticated", "user": None})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
