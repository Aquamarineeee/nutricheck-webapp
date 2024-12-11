
import os
from flask import Blueprint, request, current_app
import requests
clarifai = Blueprint('clarifai', __name__, url_prefix='/api/clarifai')
from googletrans import Translator


@clarifai.post('/detect-food')
def detectFood():
    try:
        data = request.json
        imageUrl = data.get('image_url')

        # Log imageUrl
        current_app.logger.info(f"Received image URL: {imageUrl}")

        if imageUrl is None:
            return {
                'msg': 'Invalid data. request body should contains [image_url]'
            }, 400

        foodResponse = requests.post('https://api.clarifai.com/v2/models/bd367be194cf45149e75f01d59f77ba7/outputs', json={
            "inputs": [
                {
                    "data": {
                        "image": {
                            "url": imageUrl
                        }
                    }
                }
            ]
        }, headers={'Authorization': 'Key '+str(os.environ.get('CLARIFAI_API_KEY'))})

#         foodItems = foodResponse.json()['outputs'][0]['data']['concepts']
#         translator = Translator()
#         # Combine translated results
#         translated_foodItems = [
#             {
#                 "id": item["id"],
#                 "name": translator.translate(item["name"], src='en', dest='vi').text,
#                 "value": item["value"]
#             }
#             for item in foodItems
# ]
#         return {
#             'foodItems': translated_foodItems,
#             'res': foodResponse.json()
#         }
#     except Exception as e:
#         return {
#             'msg': 'Something went wrong. Try again',
#             'error': str(e),
#             'res': foodResponse.json()
#         }
        # Lấy dữ liệu từ API
        foodResponseData = foodResponse.json()
        
        # Lấy danh sách concepts
        foodItems = foodResponseData['outputs'][0]['data']['concepts']

        # Dùng Translator để dịch
        translator = Translator()
        translated_foodItems = [
            {
                "id": item["id"],
                "name": translator.translate(item["name"], src='en', dest='vi').text,
                "value": item["value"]
            }
            for item in foodItems
        ]
        
        # Thay thế concepts bằng foodItems
        foodResponseData['outputs'][0]['data']['foodItems'] = translated_foodItems
        del foodResponseData['outputs'][0]['data']['concepts']  # Xóa concepts

        return {
            'foodItems': translated_foodItems,
            'res': foodResponseData
        }
    except Exception as e:
        return {
            'msg': 'Something went wrong. Try again',
            'error': str(e),
            'res': foodResponse.json()  # Dùng foodResponse.json() để ghi log
        }