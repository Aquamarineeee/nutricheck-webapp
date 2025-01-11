import React, { useContext } from "react";
import { Typography, Alert } from "@mui/material";
import { AppContext } from "../context/AppContext";

const UserInfo = () => {
  const { userInfo, weekData, nutrients, maxCalories } = useContext(AppContext);

  // Tính tổng lượng calo tiêu thụ trong tuần
  const totalCalories = weekData.reduce((sum, item) => sum + item.CALORIES, 0);

  // Tính lượng calo tối thiểu cần thiết dựa trên thông tin người dùng
  const calculateMinWeeklyCalories = () => {
    if (!userInfo || !userInfo.weight || !userInfo.height || !userInfo.age || !userInfo.activity) {
      return null; // Thiếu thông tin để tính toán
    }

    const { weight, height, age, gender, activity } = userInfo;

    // Công thức Mifflin-St Jeor
    const BMR =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    // Hệ số vận động
    const activityFactor = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const activityMultiplier = activityFactor[activity] || 1.2;
    const dailyCalories = BMR * activityMultiplier; // Lượng calo mỗi ngày
    return dailyCalories * 7; // Lượng calo mỗi tuần
  };

  const minWeeklyCalories = calculateMinWeeklyCalories();

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Thông tin người dùng:
      </Typography>
      <Typography variant="body1" gutterBottom>
        Tên: {userInfo?.username || "Không có thông tin"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Cân nặng: {userInfo?.weight || "Không có thông tin"} kg
      </Typography>
      <Typography variant="body1" gutterBottom>
        Chiều cao: {userInfo?.height || "Không có thông tin"} cm
      </Typography>
      <Typography variant="body1" gutterBottom>
        Tuổi: {userInfo?.age || "Không có thông tin"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Giới tính: {userInfo?.gender === "male" ? "Nam" : "Nữ"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Mức độ vận động: {userInfo?.activity || "Không có thông tin"}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Tổng lượng calo tiêu thụ trong tuần: {totalCalories.toFixed(1)} calo
      </Typography>
      <Typography variant="h6" gutterBottom>
        Lượng calo tối thiểu cần thiết trong tuần:{" "}
        {minWeeklyCalories ? minWeeklyCalories.toFixed(1) : "Không xác định"} calo
      </Typography>
      {minWeeklyCalories && totalCalories < minWeeklyCalories ? (
        <Alert severity="warning">
          Bạn tiêu thụ ít hơn mức calo tối thiểu cần thiết trong tuần. Hãy bổ
          sung thêm dinh dưỡng!
        </Alert>
      ) : (
        <Alert severity="success">
          Bạn đã tiêu thụ đủ lượng calo tối thiểu trong tuần.
        </Alert>
      )}
    </div>
  );
};

export default UserInfo;
