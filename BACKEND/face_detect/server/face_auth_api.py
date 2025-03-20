from flask import Flask, request, jsonify
import cv2
import face_recognition
import dlib
import numpy as np
from scipy.spatial import distance
import base64
import os

app = Flask(__name__)

# EAR Calculation Function
def compute_EAR(eye):
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    ear = (A + B) / (2.0 * C)
    return ear

# Constants
EAR_THRESHOLD = 0.21
EAR_CONSEC_FRAMES = 2

# Load known faces
known_face_encodings = []
known_face_names = []
images_dir = "images"
for filename in os.listdir(images_dir):
    if filename.endswith(('.jpg', '.jpeg', '.png', '.webp')):
        path = os.path.join(images_dir, filename)
        image = face_recognition.load_image_file(path)
        encodings = face_recognition.face_encodings(image)
        if encodings:
            known_face_encodings.append(encodings[0])
            known_face_names.append(os.path.splitext(filename)[0])

# Dlib detector and predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

LEFT_EYE_IDX = list(range(36, 42))
RIGHT_EYE_IDX = list(range(42, 48))

@app.route('/face-recognition', methods=['POST'])  # Make sure this route matches your client
def authenticate_face():
    try:
        data = request.get_json()
        if not data or 'frame' not in data:
            return jsonify({'status': 'error', 'message': 'No frame data received'}), 400

        frame_data = data['frame']

        # Try to decode Base64 image
        try:
            img_bytes = base64.b64decode(frame_data)
            np_arr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        except Exception as decode_err:
            return jsonify({'status': 'error', 'message': f'Base64 decode error: {decode_err}'}), 400

        if frame is None:
            return jsonify({'status': 'error', 'message': 'Failed to decode image (frame is None)'}), 400

        # Proceed with recognition
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        rects = detector(gray)

        blink_detected = False
        auth_name = "Unknown"

        for rect in rects:
            shape = predictor(gray, rect)
            shape_np = np.array([[p.x, p.y] for p in shape.parts()])
            left_eye = shape_np[LEFT_EYE_IDX]
            right_eye = shape_np[RIGHT_EYE_IDX]

            left_EAR = compute_EAR(left_eye)
            right_EAR = compute_EAR(right_eye)
            avg_EAR = (left_EAR + right_EAR) / 2.0

            if avg_EAR < EAR_THRESHOLD:
                blink_detected = True

        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            if face_distances.size > 0:
                best_match = np.argmin(face_distances)
                if matches[best_match]:
                    auth_name = known_face_names[best_match]

        if auth_name != "Unknown" and blink_detected:
            return jsonify({'status': 'success', 'name': auth_name})
        else:
            return jsonify({'status': 'fail', 'reason': 'Face mismatch or no blink detected'})

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Face Recognition API Server is running at http://0.0.0.0:80/face-recognition")
    app.run(host='0.0.0.0', port=5000)
