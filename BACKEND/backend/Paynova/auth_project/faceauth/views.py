from rest_framework.decorators import api_view
from rest_framework.response import Response
from PIL import Image
import numpy as np
import cv2
import face_recognition
import dlib
from scipy.spatial import distance
import os

# EAR Calculation Function
def compute_EAR(eye):
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    ear = (A + B) / (2.0 * C)
    return ear

# Constants
EAR_THRESHOLD = 0.21
LEFT_EYE_IDX = list(range(36, 42))
RIGHT_EYE_IDX = list(range(42, 48))

# Load Dlib predictor and face detector (initialize once)
predictor_path = "shape_predictor_68_face_landmarks.dat"
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_path)

# Load known face encodings
known_face_encodings = []
known_face_names = []

images_dir = "images"
for filename in os.listdir(images_dir):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
        image_path = os.path.join(images_dir, filename)
        image = face_recognition.load_image_file(image_path)
        encodings = face_recognition.face_encodings(image)
        if encodings:
            known_face_encodings.append(encodings[0])
            known_face_names.append(os.path.splitext(filename)[0])

# -------------------- 🔐 Face Auth Function --------------------
def run_face_auth(image_file):
    try:
        # Convert uploaded image to RGB numpy array
        pil_image = Image.open(image_file).convert('RGB')
        frame = np.array(pil_image)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(rgb_frame, cv2.COLOR_BGR2GRAY)

        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        rects = detector(gray)

        liveness_passed = False
        matched_user = None

        for rect in rects:
            shape = predictor(gray, rect)
            shape_np = np.array([[p.x, p.y] for p in shape.parts()])
            left_eye = shape_np[LEFT_EYE_IDX]
            right_eye = shape_np[RIGHT_EYE_IDX]

            left_EAR = compute_EAR(left_eye)
            right_EAR = compute_EAR(right_eye)
            avg_EAR = (left_EAR + right_EAR) / 2.0

            if avg_EAR < EAR_THRESHOLD:
                liveness_passed = True  # Eye closure detected (blink-like)

        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            name = "Unknown"

            if len(face_distances) > 0:
                best_match = np.argmin(face_distances)
                if matches[best_match]:
                    name = known_face_names[best_match]

            if name != "Unknown":
                matched_user = name
                break

        return {
            "authenticated": matched_user is not None and liveness_passed,
            "user": matched_user,
            "liveness": liveness_passed
        }

    except Exception as e:
        return {
            "authenticated": False,
            "error": str(e)
        }

# -------------------- 🔐 API View --------------------
@api_view(['POST'])
def authenticate_face(request):
    image_file = request.FILES.get('frame')
    if not image_file:
        return Response({'error': 'No image frame received'}, status=400)

    result = run_face_auth(image_file)
    return Response(result)
