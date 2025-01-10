import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeeklyReport = () => {
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const response = await axios.get('/api/food/last-week-nutrition-details', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Nếu cần token
          },
        });

        // Tính tổng calo từ dữ liệu trả về
        const weekData = response.data.weekData || [];
        const total = weekData.reduce((sum, day) => {
          const dailyCalories = day.foodItems.reduce((daySum, item) => daySum + item.CALORIE, 0);
          return sum + dailyCalories;
        }, 0);

        setTotalCalories(total);
      } catch (error) {
        console.error('Error fetching weekly calories:', error);
      }
    };

    fetchWeeklyData();
  }, []);

  return (
    <div>
      <h3>Weekly Report</h3>
      <p>Tổng calo tiêu thụ trong tuần: <strong>{totalCalories.toFixed(1)}</strong> calo</p>
    </div>
  );
};

export default WeeklyReport;
