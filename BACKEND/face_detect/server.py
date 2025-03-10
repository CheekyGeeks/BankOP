from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/face-recognition', methods=['POST'])
def face_recognition():
    data = request.files['image']  # Image sent from client
    # Process image (face recognition, etc.)
    return jsonify({"result": "Face verified"})

@app.route('/')
def home():
    return "Server is up!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
