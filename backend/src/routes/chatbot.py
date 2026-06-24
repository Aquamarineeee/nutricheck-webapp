# src/routes/chatbot.py
from flask import Blueprint, request, jsonify, current_app
import requests
import base64 # Import thư viện base64 để mã hóa ảnh

chatbot_bp = Blueprint('chatbot', __name__, url_prefix='/api/chatbot')

@chatbot_bp.route('/message', methods=['POST'])
def send_message_to_chatbot():
    try:
        # Lấy tin nhắn văn bản từ FormData (frontend gửi bằng formData.append('message', ...))
        user_message_text = request.form.get('message')
        
        # Lấy danh sách các tệp hình ảnh từ FormData (frontend gửi bằng formData.append('image', ...))
        # Quan trọng: Key 'image' phải khớp với key bạn dùng trong frontend
        image_files = request.files.getlist('image') 

        # Khởi tạo danh sách nội dung cho trường 'content' của Claude API
        # Đây sẽ là một list các dictionary, mỗi dictionary là một phần của content (text hoặc image)
        messages_content = []

        # 1. Thêm tin nhắn văn bản vào content (nếu có)
        if user_message_text:
            messages_content.append({
                "type": "text",
                "text": user_message_text
            })
        
        # 2. Xử lý và thêm từng tệp hình ảnh vào content (nếu có)
        for img_file in image_files:
            if img_file: # Đảm bảo file không rỗng
                image_data = img_file.read() # Đọc dữ liệu nhị phân của ảnh
                encoded_image = base64.b64encode(image_data).decode('utf-8') # Mã hóa Base64
                media_type = img_file.mimetype # Lấy kiểu media (e.g., image/png, image/jpeg)

                # Thêm đối tượng hình ảnh vào danh sách content
                messages_content.append({
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": media_type,
                        "data": encoded_image
                    }
                })

        # Kiểm tra nếu không có tin nhắn văn bản và không có tệp hình ảnh nào được cung cấp
        if not messages_content:
            return jsonify({"error": "Không có tin nhắn hoặc tệp được cung cấp."}), 400

        claude_api_key = current_app.config.get('CHATBOT_API_KEY')
        claude_api_endpoint = current_app.config.get('CHATBOT_EXTERNAL_API_ENDPOINT')

        if not claude_api_key or not claude_api_endpoint:
            return jsonify({"error": "Cấu hình API Claude chưa đầy đủ trên server."}), 500

        headers = {
            "x-api-key": claude_api_key,
            "anthropic-version": "2023-06-01", # Phiên bản API Claude khuyến nghị
            "content-type": "application/json" # API Messages yêu cầu Content-Type này
        }

        # Cấu hình payload cho API Claude Messages (định dạng mới)
        payload = {
            "model": "claude-4-sonnet-20250514", # Chọn Opus nếu bạn muốn khả năng mạnh mẽ nhất, hoặc Sonnet/Haiku
            "max_tokens": 4000, # Đảm bảo dưới 4096 cho Opus. Giảm xuống 1024-2000 nếu bạn muốn phản hồi nhanh hơn
            "messages": [
                {"role": "user", "content": messages_content} # Sử dụng list 'messages_content' đã tạo
            ]
        }
        
        # THÊM DÒNG PRINT NÀY ĐỂ DEBUG TRÊN VERCEL LOGS
        # In ra cấu trúc messages (trừ phần data của ảnh để tránh log quá lớn)
        debug_payload_content = []
        for item in messages_content:
            if item["type"] == "text":
                debug_payload_content.append({"type": "text", "text": item["text"]})
            elif item["type"] == "image":
                debug_payload_content.append({"type": "image", "media_type": item["source"]["media_type"], "data_length": len(item["source"]["data"])})
        print(f"Payload gửi đến Claude: {debug_payload_content}")
        
        # Gửi yêu cầu đến API Claude với timeout
        # Đặt timeout lớn hơn 10 giây nếu bạn kỳ vọng Claude phản hồi lâu, nhưng nhớ giới hạn của Vercel (10s mặc định)
        response = requests.post(claude_api_endpoint, headers=headers, json=payload, timeout=15)
        response.raise_for_status() # Nâng ngoại lệ nếu có lỗi HTTP

        # Lấy phản hồi từ Claude
        claude_response_data = response.json()

        # Claude API trả về một đối tượng với trường 'content' là một mảng
        assistant_message_content = ""
        if claude_response_data and "content" in claude_response_data:
            for block in claude_response_data["content"]:
                if block.get("type") == "text":
                    assistant_message_content += block.get("text", "")

        return jsonify({"response": assistant_message_content}) # Trả về chỉ phần text của phản hồi

    except requests.exceptions.Timeout:
        print("Lỗi: Yêu cầu đến Claude API đã hết thời gian chờ.")
        return jsonify({"error": "Dịch vụ AI đang mất nhiều thời gian hơn dự kiến để phản hồi. Vui lòng thử lại sau."}), 504
    except requests.exceptions.RequestException as e:
        print(f"Lỗi khi giao tiếp với API Claude: {e}")
        # Log chi tiết lỗi từ Claude nếu có thể
        if hasattr(e, 'response') and e.response is not None:
            print(f"Phản hồi lỗi từ Claude: {e.response.text}")
            # Trả về lỗi chi tiết từ Claude nếu có
            try:
                error_detail = e.response.json()
                error_message = error_detail.get('error', {}).get('message', 'Không rõ lỗi')
                return jsonify({"error": f"Lỗi từ Claude API: {error_message} (Mã lỗi: {e.response.status_code})"}), 500
            except:
                return jsonify({"error": f"Lỗi khi giao tiếp với dịch vụ Claude: {e.response.status_code} {e.response.reason}"}), 500
        return jsonify({"error": f"Lỗi khi giao tiếp với dịch vụ Claude: {e}"}), 500
    except Exception as e:
        print(f"Lỗi không xác định trong chatbot_bp: {e}")
        return jsonify({"error": "Đã xảy ra lỗi nội bộ trên server."}), 500