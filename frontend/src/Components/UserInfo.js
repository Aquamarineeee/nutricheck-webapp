import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeeklyReport from './WeeklyReport';

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
      <p>Tổng tiêu thụ: {calories} calo từ khi đăng ký</p>

      {/* Hiển thị WeeklyReport */}
      <WeeklyReport />
    </div>
  );
};

export default UserInfo;
