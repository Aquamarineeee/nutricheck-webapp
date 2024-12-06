import React, { useEffect, useState } from "react";
import axios from "axios";

const UserInfo = () => {
  const [calories, setCalories] = useState(0);

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
      <p>Tổng lượng calo tiêu thụ trong 1 tháng: {calories} calo</p>
    </div>
  );
};

export default UserInfo;
