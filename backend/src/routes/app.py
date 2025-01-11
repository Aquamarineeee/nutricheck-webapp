from flask import Flask, request, jsonify
import requests
import os
app = Flask(__name__)

# API Key được lưu trong biến môi trường để bảo mật
API_KEY = os.environ.get("GEMINI_API_KEY")
BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    try:
        # Lấy dữ liệu từ frontend
        data = request.json
        prompt = data.get("prompt", "")

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Tạo payload cho API của Gemini
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ]
        }

        # Gửi yêu cầu đến API Gemini
        headers = {"Content-Type": "application/json"}
        response = requests.post(
            f"{BASE_URL}?key={API_KEY}",
            json=payload,
            headers=headers
        )

        # Xử lý phản hồi từ Gemini
        if response.status_code != 200:
            return jsonify({"error": "Error from Gemini API", "details": response.text}), response.status_code

        response_data = response.json()
        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({"error": "Server error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
