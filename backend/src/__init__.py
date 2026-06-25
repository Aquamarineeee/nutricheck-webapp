from flask import Flask
import os
from src.routes.auth import auth
from src.routes.food import food
from flask_cors import CORS
from src.routes.chatbot import chatbot_bp

def create_app():

    app = Flask(__name__)
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'this is a secret'
    app.config['SECRET_KEY'] = SECRET_KEY
    app.config['IMAGE_UPLOADS'] = os.path.abspath('./uploads')
    


    app.config['GEMINI_API_KEY'] = os.environ.get('GEMINI_API_KEY')
    if not app.config['GEMINI_API_KEY']:
        print("WARNING: GEMINI_API_KEY missing!")

    # CẤU HÌNH CORS CHÍNH XÁC:
    # domain frontend 
    allowed_frontend_origins = [
        "https://nutriwiseadvisor.vercel.app",  # Frontend chính
        "https://www.nutricheck.io.vn"
    ]
    CORS(app, resources={r"/api/*": {"origins": allowed_frontend_origins}})

    # Đăng ký các Blueprint
    app.register_blueprint(auth)
    app.register_blueprint(food)
    app.register_blueprint(chatbot_bp)

    return app