import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeeklyReport = () => {
  const [totalCalories, setTotalCalories] = useState(0); // Tổng calo trong tuần
  const [weekData, setWeekData] = useState([]); // Dữ liệu calo từng ngày

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const response = await axios.get('/api/food/last-week-nutrition-details', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Nếu cần token
          },
        });

        const data = response.data.weekData || [];
        setWeekData(data);

        // Tính tổng calo trong tuần
        const total = data.reduce((sum, day) => sum + day.CALORIES, 0);
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
      <p><strong>Tổng calo tiêu thụ trong tuần:</strong> {totalCalories.toFixed(1)} calo</p>
      <ul>
        {weekData.map((day, index) => (
          <li key={index}>
            <strong>{day.DAY}</strong>: {day.CALORIES.toFixed(1)} calo ({day.CONSUMED_ON})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeeklyReport;
