import datetime
from functools import wraps
import jwt
from flask import request
from flask import current_app
from src.config.db import session, User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        try:
            if "Authorization" in request.headers:
                token = request.headers["Authorization"].split(" ")
            if token and len(token) < 2 and not token[1]:
                return {
                    "msg": "Authentication Token is missing!",
                    "data": None,
                    "error": "Unauthorized"
                }, 401
            token = token[1]
        except Exception:
            return {
                "msg": "Authentication Token is missing!",
                "data": None,
                "error": "Unauthorized"
            }, 401

        try:
            # Giải mã JWT và kiểm tra token
            data = jwt.decode(
                token, current_app.config["SECRET_KEY"], algorithms=["HS256"])

            # Truy vấn thông tin người dùng từ DB
            current_user = session.query(User).get(data.get('user_id'))
            if current_user is None:
                return {
                    "message": "Invalid Authentication token!",
                    "data": None,
                    "error": "Unauthorized"
                }, 401

        except jwt.ExpiredSignatureError:
            return {
                "message": "Token has expired!",
                "data": None,
                "error": "Unauthorized"
            }, 401
        except jwt.InvalidTokenError as e:
            return {
                "message": f"Invalid token: {str(e)}",
                "data": None,
                "error": "Unauthorized"
            }, 401
        except Exception as e:
            return {
                "message": "Something went wrong",
                "data": None,
                "error": str(e)
            }, 500

        return f(current_user, *args, **kwargs)

    return decorated


def encode_auth_token(user_id):
    """
    Generates the Auth Token
    :return: string
    """
    try:
        payload = {
            'iat': datetime.datetime.utcnow(),
            'user_id': user_id
        }
        encoded_jwt = jwt.encode(payload, current_app.config.get(
            'SECRET_KEY'), algorithm="HS256")
        return encoded_jwt
    except Exception as e:
        print(e)
        return None