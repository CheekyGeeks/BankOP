import cv2
import base64
import requests
import time
import json

# === Configuration ===
SERVER_URL = "http://192.168.1.5/face-recognition"
  # Replace with your actual server IP address
SEND_INTERVAL = 0.5  # Time between sending frames (in seconds)

def encode_frame(frame):
    _, buffer = cv2.imencode('.jpg', frame)
    encoded_string = base64.b64encode(buffer).decode('utf-8')
    return encoded_string

def send_frame(encoded_frame):
    payload = {
        'frame': encoded_frame
    }
    try:
        response = requests.post(SERVER_URL, json=payload, timeout=5)
        return response.json()
    except Exception as e:
        print(f"[ERROR] Failed to send frame to server: {e}")
        return {"status": "error", "message": str(e)}

def main():
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("❌ Unable to access webcam.")
        return

    print("📡 Streaming frames to server for authentication...")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Failed to read frame from webcam.")
            break

        encoded = encode_frame(frame)
        result = send_frame(encoded)

        print(f"[Server Response] {result}")

        # Optional: Show the camera view on client side
        cv2.imshow("Client Camera - Streaming", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        time.sleep(SEND_INTERVAL)

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()


# pyinstaller --onefile client_streamer.py
