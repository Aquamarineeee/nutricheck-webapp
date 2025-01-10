import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WeeklyReport from './WeeklyReport';  // Import WeeklyReport component

const UserInfo = () => {
  const [calories, setCalories] = useState(0); // Total calories
  const [weeklyData, setWeeklyData] = useState([]); // Weekly data for WeeklyReport
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch total calories since registration
    const fetchCalories = async () => {
      try {
        const response = await axios.get('/api/food/total-calories-since-registration', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // If token is needed
          },
        });
        setCalories(response.data.total_calories || 0);
      } catch (error) {
        console.error('Error fetching total calories:', error);
      }
    };

    // Fetch data for last week (weekly calories)
    const fetchWeeklyData = async () => {
      try {
        const response = await axios.get('/api/food/last-week-nutrition-details');
        setWeeklyData(response.data.weekData); // Store the weekly data
      } catch (error) {
        console.error('Error fetching weekly data:', error);
      }
    };

    fetchCalories();
    fetchWeeklyData(); // Fetch weekly data
  }, []);

  return (
    <div>
      <h2>Thông tin người dùng</h2>
      <p> Tổng tiêu thụ: {calories} calo từ khi đăng ký</p>
      <p>Người dùng có thể đọc thêm các khuyến nghị về lượng calo tiêu thụ đối với từng thể trạng khác nhau ở: </p>
      <button
        onClick={() => navigate("/blog/suggest")}
        className="switch-to-signup"
      >
        Đánh giá mức độ tiêu thụ khuyến cáo
      </button>

      {/* Render WeeklyReport and pass the weekly data */}
      <WeeklyReport weeklyFoodItems={weeklyData} />
    </div>
  );
};

export default UserInfo;
