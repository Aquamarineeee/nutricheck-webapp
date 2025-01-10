import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { calculateTotalCalories } from "../utils/utils";
import { Divider, Grid } from '@mui/material';
import WeeklyReport from './WeeklyReport';

const UserInfo = () => {
  const [calories, setCalories] = useState(0);
  const [weeklyFoodItems, setWeeklyFoodItems] = useState([]); // Dữ liệu thực phẩm cả tuần
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCalories = async () => {
      try {
        // Lấy tổng calo
        const caloriesResponse = await axios.get('/api/food/total-calories-since-registration', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCalories(caloriesResponse.data.total_calories || 0);

        // Lấy dữ liệu thực phẩm theo tuần
        const weeklyResponse = await axios.get('/api/food/weekly-report', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setWeeklyFoodItems(weeklyResponse.data.weekly_food_items || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCalories();
  }, []);

  return (
    <div>
      <h2>Thông tin người dùng</h2>
      <p>Tổng tiêu thụ: {calories.toFixed(1)} calo kể từ khi đăng ký</p>
      <p>Người dùng có thể đọc thêm các khuyến nghị về lượng calo tiêu thụ đối với từng thể trạng khác nhau ở: </p>
      <button
        onClick={() => navigate("/blog/suggest")}
        className="switch-to-signup"
      >
        Đánh giá mức độ tiêu thụ khuyến cáo
      </button>

      {/* Thêm WeeklyReport */}
      <WeeklyReport weeklyFoodItems={weeklyFoodItems} />
    </div>
  );
};

export default UserInfo;
