from flask import Flask, request, jsonify
import cv2
import face_recognition
import dlib
import numpy as np
import base64
import os
import random

app = Flask(__name__)

# Dlib & EAR constants
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
detector = dlib.get_frontal_face_detector()
LEFT_EYE_IDX = list(range(36, 42))
RIGHT_EYE_IDX = list(range(42, 48))

EAR_THRESHOLD = 0.21
FRAME_SKIP = 2  # Skip alternate frames

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

# Motion captcha challenge (updated every session)
current_challenge = {
    "blinks_required": random.randint(1, 2),
    "turn": random.choice(["left", "right", "none"])
}

# EAR calculation
def compute_EAR(eye):
    from scipy.spatial import distance
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    ear = (A + B) / (2.0 * C)
    return ear

@app.route('/challenge', methods=['GET'])
def get_challenge():
    return jsonify(current_challenge)

@app.route('/face-recognition', methods=['POST'])
def authenticate_face():
    try:
        data = request.get_json()
        if not data or 'frame' not in data:
            return jsonify({'status': 'error', 'message': 'No frame data received'}), 400

        frame_data = data['frame']
        img_bytes = base64.b64decode(frame_data)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if frame is None:
            return jsonify({'status': 'error', 'message': 'Failed to decode image'}), 400

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        face_locations = face_recognition.face_locations(rgb)
        face_encodings = face_recognition.face_encodings(rgb, face_locations)
        rects = detector(gray)

        name = "Unknown"
        blink_count = 0
        head_turned = None

        for rect in rects:
            shape = predictor(gray, rect)
            shape_np = np.array([[p.x, p.y] for p in shape.parts()])

            left_eye = shape_np[LEFT_EYE_IDX]
            right_eye = shape_np[RIGHT_EYE_IDX]

            left_ear = compute_EAR(left_eye)
            right_ear = compute_EAR(right_eye)
            avg_ear = (left_ear + right_ear) / 2.0

            nose = shape_np[30][0]
            left_cheek = shape_np[1][0]
            right_cheek = shape_np[15][0]

            if avg_ear < EAR_THRESHOLD:
                blink_count += 1

            if nose - left_cheek < 30:
                head_turned = "left"
            elif right_cheek - nose < 30:
                head_turned = "right"

        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            if len(face_distances) > 0:
                best_match = np.argmin(face_distances)
                if matches[best_match]:
                    name = known_face_names[best_match]

        # Final validation
        challenge = current_challenge
        if (
            name != "Unknown" and
            blink_count >= challenge["blinks_required"] and
            (challenge["turn"] == "none" or head_turned == challenge["turn"])
        ):
            return jsonify({'status': 'success', 'name': name})
        else:
            return jsonify({
                'status': 'fail',
                'reason': 'Failed captcha or mismatch',
                'detected_blinks': blink_count,
                'detected_turn': head_turned,
                'expected_blinks': challenge["blinks_required"],
                'expected_turn': challenge["turn"]
            })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Face Recognition API Server running at http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000)
