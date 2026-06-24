# src/routes/chatbot.py
from flask import Blueprint, request, jsonify, current_app
from google import genai
from google.genai import types
import requests # Giữ lại nếu các phần khác cần, hoặc có thể bỏ nếu không dùng

chatbot_bp = Blueprint('chatbot', __name__, url_prefix='/api/chatbot')

@chatbot_bp.route('/message', methods=['POST'])
def send_message_to_chatbot():
    try:
        # 1. Lấy dữ liệu từ Frontend FormData
        user_message_text = request.form.get('message')
        image_files = request.files.getlist('image') 

        # Khởi tạo danh sách chứa các phần tử nội dung gửi cho Gemini
        # Gemini nhận một list gồm text và dict cấu trúc ảnh (hoặc object)
        contents = []

        # 2. Thêm tin nhắn văn bản vào nội dung (nếu có)
        if user_message_text:
            contents.append(user_message_text)
        
        # 3. Xử lý và thêm từng file hình ảnh (nếu có)
        for img_file in image_files:
            if img_file: 
                image_data = img_file.read() # Đọc dữ liệu nhị phân của ảnh
                media_type = img_file.mimetype # Lấy kiểu media (e.g., image/png, image/jpeg)

                # Cấu trúc dữ liệu ảnh dạng InlineData của Gemini API
                contents.append(
                    types.Part.from_bytes(
                        data=image_data,
                        mime_type=media_type
                    )
                )

        # Kiểm tra nếu không có nội dung nào được gửi lên
        if not contents:
            return jsonify({"error": "Không có tin nhắn hoặc tệp được cung cấp."}), 400

        # 4. Lấy API Key từ cấu hình hệ thống
        gemini_api_key = current_app.config.get('GEMINI_API_KEY')
        if not gemini_api_key:
            return jsonify({"error": "Cấu hình API Gemini chưa đầy đủ trên server."}), 500

        # Khởi tạo Client của Gemini
        client = genai.Client(api_key=gemini_api_key)

        # Sử dụng model gemini-2.5-flash (Nhanh, rẻ, hỗ trợ cả text + ảnh cực tốt)
        # Nếu muốn thông minh hơn hẳn thì chọn 'gemini-2.5-pro'
        model_name = 'gemini-2.5-flash'

        # Debug log trước khi gửi (Tránh in binary data)
        print(f"Đang gửi request tới {model_name} với {len(contents)} phần tử nội dung.")

        # 5. Gọi API Gemini để sinh câu trả lời
        response = client.models.generate_content(
            model=model_name,
            contents=contents,
            # Bạn có thể bổ sung cấu hình hệ thống (System Instruction) ở đây nếu muốn:
            # config=types.GenerateContentConfig(system_instruction="Bạn là trợ lý ảo...")
        )

        # Lấy phản hồi văn bản từ Gemini
        assistant_message_content = response.text

        return jsonify({"response": assistant_message_content})

    except Exception as e:
        print(f"Lỗi hệ thống khi xử lý chatbot: {e}")
        # Bắt lỗi chi tiết hơn từ Google API nếu có
        return jsonify({"error": f"Đã xảy ra lỗi khi giao tiếp với Gemini: {str(e)}"}), 500