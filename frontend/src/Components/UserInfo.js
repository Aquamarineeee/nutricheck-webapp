import React, { useEffect, useState } from "react";
import { Typography, Alert } from "@mui/material";
import { API } from "../services/apis";
import { AppContext } from "../../Context/AppContext";

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [minCalories, setMinCalories] = useState(0);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Lấy thông tin người dùng
        const { userInfo } = useContext(AppContext);
        setUser(userInfo);

        // Lấy dữ liệu calo hàng tuần
        const weekResponse = await API.lastWeekCalorieDetails();
        const weekData = weekResponse.weekData || [];
        const total = weekData.reduce((sum, item) => sum + item.CALORIES, 0);
        setTotalCalories(total);

        // Tính lượng calo tối thiểu theo công thức BMR

        // Công thức Mifflin-St Jeor
        const BMR =
          gender === "male"
            ? 10 * weight + 6.25 * height - 5 * age + 5
            : 10 * weight + 6.25 * height - 5 * age - 161;

        // Hệ số vận động
        const activityFactor = {
          sedentary: 1.2, // Không vận động
          light: 1.375, // Vận động nhẹ
          moderate: 1.55, // Vận động trung bình
          active: 1.725, // Vận động cao
          very_active: 1.9, // Vận động rất cao
        };

        const dailyCalories = BMR * (activityFactor[activity] || 1.2); // Lượng calo mỗi ngày
        const weeklyCalories = dailyCalories * 7; // Lượng calo mỗi tuần
        setMinCalories(weeklyCalories);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };

    fetchUserInfo();
  }, []);

  if (!user) {
    return <Alert severity="info">Đang tải thông tin người dùng...</Alert>;
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Thông tin người dùng:
      </Typography>
      <Typography variant="body1" gutterBottom>
        Tên: {userInfo.USERNAME}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Cân nặng: {userInfo.WEIGHT} kg
      </Typography>
      <Typography variant="body1" gutterBottom>
        Chiều cao: {userInfo.HEIGHT} cm
      </Typography>
      <Typography variant="body1" gutterBottom>
        Tuổi: {userInfo.AGE}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Giới tính: {userInfo.GENDER === "male" ? "Nam" : "Nữ"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Mức độ vận động: {userInfo.ACTIVITY}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Tổng lượng calo tiêu thụ trong tuần: {totalCalories.toFixed(1)} calo
        <br />
        Lượng calo tối thiểu cần thiết trong tuần: {minCalories.toFixed(1)} calo
      </Typography>
      {totalCalories < minCalories ? (
        <Alert severity="warning">
          Bạn tiêu thụ ít hơn mức calo tối thiểu cần thiết trong tuần. Hãy chú ý
          bổ sung thêm dinh dưỡng!
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
