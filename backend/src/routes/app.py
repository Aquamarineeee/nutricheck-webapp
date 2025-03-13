from flask import Flask, request, jsonify
from sqlalchemy import func
from config.db import session  # Gọi session từ file config đã tạo
from config.db import ConsumedFood  # Import mô hình bảng ConsumedFood từ file đã định nghĩa
import datetime

# Khởi tạo Flask app
app = Flask(__name__)

@app.route("/food/total-nutrition", methods=["GET"])
def get_total_nutrition():
    user_id = request.args.get("user_id", type=int)
    period = request.args.get("period", default="week", type=str)

    if not user_id:
        return jsonify({"error": "Missing user_id parameter."}), 400

    if period not in ["week", "month"]:
        return jsonify({"error": "Invalid period. Choose 'week' or 'month'."}), 400

    # Xác định khoảng thời gian
    now = datetime.datetime.utcnow()
    start_date = now - datetime.timedelta(weeks=1) if period == "week" else now - datetime.timedelta(days=30)

    try:
        # Truy vấn dữ liệu từ bảng ConsumedFood
        result = session.query(
            func.sum(ConsumedFood.proteins).label("total_proteins"),
            func.sum(ConsumedFood.fat).label("total_fat"),
            func.sum(ConsumedFood.carbohydrates).label("total_carbohydrates"),
            func.sum(ConsumedFood.calcium).label("total_calcium"),
        ).filter(
            ConsumedFood.user_id == user_id,
            ConsumedFood.consumed_on >= start_date
        ).one_or_none()

        if not result:
            return jsonify({"error": "No data found for the given user_id and period."}), 404

        # Tính toán
        total_values = dict(zip(["proteins", "fat", "carbohydrates", "calcium"], [val or 0 for val in result]))
        highest_nutrition = max(total_values, key=total_values.get)

        # Ngưỡng dinh dưỡng tối thiểu
        minimum_requirements = {
            "proteins": 50.0,
            "fat": 70.0,
            "carbohydrates": 300.0,
            "calcium": 1000.0,
        }
        total_days = 7 if period == "week" else 30
        for key in minimum_requirements:
            minimum_requirements[key] *= total_days

        differences = {
            key: total_values[key] - minimum_requirements[key]
            for key in minimum_requirements
        }

        return jsonify({
            "total_nutrition": total_values,
            "minimum_requirements": minimum_requirements,
            "differences": differences,
            "highest_nutrition": highest_nutrition,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
