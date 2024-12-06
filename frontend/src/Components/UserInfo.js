import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
  const [calories, setCalories] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCalories = async () => {
      try {
        const response = await axios.get('/api/food/total-calories-since-registration', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Nếu cần token
          },
        });
        setCalories(response.data.total_calories || 0);
      } catch (error) {
        console.error('Error fetching total calories:', error);
      }
    };

    fetchCalories();
  }, []);

  return (
    <div>
      <h2>Thông tin người dùng</h2>
      <p>Người dùng có thể đọc thêm các khuyến nghị về lượng calo tiêu thụ đối với từng thể trạng khác nhau ở: </p>
      <button
              onClick={() => navigate("/blog/suggest")}
              className="switch-to-signup"
            >
              Đánh giá mức độ tiêu thụ khuyến cáo
            </button>
    </div>
  );
};

export default UserInfo;
