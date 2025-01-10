import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeeklyReport from './WeeklyReport'; // Import WeeklyReport

const UserInfo = () => {
  const [calories, setCalories] = useState(0); // Tổng calo từ khi đăng ký

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
      <p><strong>Tổng calo từ khi đăng ký:</strong> {calories} calo</p>
      
      {/* Hiển thị báo cáo tuần */}
      <WeeklyReport />
    </div>
  );
};

export default UserInfo;
