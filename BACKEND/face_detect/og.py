import cv2
import face_recognition
import dlib
import numpy as np
import random
from scipy.spatial import distance
import os

# --- EAR Calculation ---
def compute_EAR(eye):
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    ear = (A + B) / (2.0 * C)
    return ear

# --- Constants ---
EAR_THRESHOLD = 0.19
EAR_CONSEC_FRAMES = 1
blink_counter = 0
consec_frame_counter = 0
head_turn_done = False
required_blinks = random.choice([1, 2])
required_turn = random.choice(["left", "right"])

# --- Load Models ---
predictor_path = "shape_predictor_68_face_landmarks.dat"
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_path)

# Eye and nose landmarks
LEFT_EYE_IDX = list(range(36, 42))
RIGHT_EYE_IDX = list(range(42, 48))
NOSE_IDX = 30  # Nose tip

# --- Load known faces ---
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

# --- Init Camera ---
cap = cv2.VideoCapture(0)
print("🔐 Please follow the instructions on screen...")

authenticated = False
frame_count = 0
initial_nose_x = None

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ Failed to grab frame.")
        break

    frame_count += 1
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
    rects = detector(gray)

    for rect in rects:
        shape = predictor(gray, rect)
        shape_np = np.array([[p.x, p.y] for p in shape.parts()])
        left_eye = shape_np[LEFT_EYE_IDX]
        right_eye = shape_np[RIGHT_EYE_IDX]

        left_EAR = compute_EAR(left_eye)
        right_EAR = compute_EAR(right_eye)
        avg_EAR = (left_EAR + right_EAR) / 2.0

        # Blink detection
        if avg_EAR < EAR_THRESHOLD:
            consec_frame_counter += 1
        else:
            if consec_frame_counter >= EAR_CONSEC_FRAMES:
                blink_counter += 1
                print(f"👁️ Blink Detected: {blink_counter}")
            consec_frame_counter = 0

        # Draw eye landmarks
        for (x, y) in np.concatenate((left_eye, right_eye), axis=0):
            cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

        # Head turn detection using nose position
        nose_x = shape.part(NOSE_IDX).x
        if initial_nose_x is None:
            initial_nose_x = nose_x
        shift = nose_x - initial_nose_x

        if required_turn == "left" and shift < -20:
            head_turn_done = True
        elif required_turn == "right" and shift > 20:
            head_turn_done = True

        # Draw debug EAR
        cv2.putText(frame, f"EAR: {avg_EAR:.2f}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        name = "Unknown"

        if len(face_distances) > 0:
            best_match = np.argmin(face_distances)
            if matches[best_match]:
                name = known_face_names[best_match]

        # Draw face box
        cv2.rectangle(frame, (left, top), (right, bottom), (255, 0, 0), 2)
        cv2.rectangle(frame, (left, bottom - 30), (right, bottom), (255, 0, 0), cv2.FILLED)
        cv2.putText(frame, name, (left + 6, bottom - 6),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

        # Authentication check
        if name != "Unknown":
            print(f"✅ Face Match: {name}")
            if blink_counter >= required_blinks and head_turn_done:
                print("✅ Liveness Challenge Passed")
                print("✅ Authenticated Successfully")
                authenticated = True
                break

    # Show instructions
    instruction = f"Blink {required_blinks}x and turn {required_turn}"
    cv2.putText(frame, instruction, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

    # Show frame
    cv2.imshow("Face Authentication", frame)

    if cv2.waitKey(1) & 0xFF == ord('q') or authenticated:
        break

cap.release()
cv2.destroyAllWindows()
