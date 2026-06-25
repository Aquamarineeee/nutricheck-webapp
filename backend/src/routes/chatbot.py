from flask import Blueprint, request, jsonify, current_app
from google import genai
from google.genai import types

chatbot_bp = Blueprint(
    'chatbot',
    __name__,
    url_prefix='/api/chatbot'
)

@chatbot_bp.route('/message', methods=['POST'])
def send_message_to_chatbot():
    try:
        user_message = request.form.get('message')
        image_files = request.files.getlist('image')

        contents = []

        if user_message:
            contents.append(user_message)

        for img in image_files:
            if img:
                contents.append(
                    types.Part.from_bytes(
                        data=img.read(),
                        mime_type=img.mimetype
                    )
                )

        if not contents:
            return jsonify({
                "error": "No message or image provided"
            }), 400

        api_key = current_app.config.get("GEMINI_API_KEY")

        if not api_key:
            return jsonify({
                "error": "GEMINI_API_KEY missing"
            }), 500

        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents
        )

        return jsonify({
            "response": response.text
        })

    except Exception as e:
        print("Gemini Error:", str(e))
        return jsonify({
            "error": str(e)
        }), 500