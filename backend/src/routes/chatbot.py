from flask import Blueprint, request, jsonify, current_app
import requests
import base64

chatbot_bp = Blueprint(
    'chatbot',
    __name__,
    url_prefix='/api/chatbot'
)

@chatbot_bp.route('/message', methods=['POST'])
def send_message_to_chatbot():
    try:
        user_message_text = request.form.get('message')
        image_files = request.files.getlist('image')

        parts = []

        if user_message_text:
            parts.append({
                "text": user_message_text
            })

        for img_file in image_files:
            if img_file:
                image_data = img_file.read()

                encoded_image = base64.b64encode(
                    image_data
                ).decode("utf-8")

                parts.append({
                    "inline_data": {
                        "mime_type": img_file.mimetype,
                        "data": encoded_image
                    }
                })

        if not parts:
            return jsonify({
                "error": "Không có dữ liệu gửi lên."
            }), 400

        gemini_api_key = current_app.config.get(
            "CHATBOT_API_KEY"
        )

        gemini_endpoint = current_app.config.get(
            "CHATBOT_EXTERNAL_API_ENDPOINT"
        )

        if not gemini_api_key:
            return jsonify({
                "error": "Thiếu CHATBOT_API_KEY"
            }), 500

        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": gemini_api_key
        }

        payload = {
            "contents": [
                {
                    "parts": parts
                }
            ],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 2048
            }
        }

        print("Sending Gemini request...")

        response = requests.post(
            gemini_endpoint,
            headers=headers,
            json=payload,
            timeout=60
        )

        response.raise_for_status()

        data = response.json()

        assistant_message = ""

        if (
            "candidates" in data
            and len(data["candidates"]) > 0
        ):
            candidate = data["candidates"][0]

            if (
                "content" in candidate
                and "parts" in candidate["content"]
            ):
                for part in candidate["content"]["parts"]:
                    if "text" in part:
                        assistant_message += part["text"]

        if not assistant_message:
            assistant_message = (
                "Xin lỗi, tôi không thể xử lý yêu cầu này."
            )

        return jsonify({
            "response": assistant_message
        })

    except requests.exceptions.Timeout:
        return jsonify({
            "error": "Gemini timeout."
        }), 504

    except requests.exceptions.RequestException as e:
        try:
            detail = e.response.json()
            print(detail)

            return jsonify({
                "error": detail
            }), 500

        except Exception:
            return jsonify({
                "error": str(e)
            }), 500

    except Exception as e:
        print(e)

        return jsonify({
            "error": str(e)
        }), 500