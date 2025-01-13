import React, { useEffect, useState, useContext } from "react";
import { Alert, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { AppContext } from "../Context/AppContext";

const UserInfo = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo, weekData, fetchWeekData } = useContext(AppContext);
  const [totalCalories, setTotalCalories] = useState(0);
  const [minCaloriesDay, setMinCaloriesDay] = useState(0);
  const [minCaloriesWeek, setMinCaloriesWeek] = useState(0);
  const [totalDailyCalories, setTotalDailyCalories] = useState(0);
  const [suggestedMeals, setSuggestedMeals] = useState({});

  useEffect(() => {
    const calculateMinCalories = () => {
      if (!userInfo || !userInfo.WEIGHT || !userInfo.HEIGHT || !userInfo.AGE || !userInfo.GENDER || !userInfo.ACTIVITY) {
        enqueueSnackbar("Thông tin người dùng không đầy đủ để tính toán calo tối thiểu.", {
          variant: "warning",
        });
        return;
      }

      const { WEIGHT: weight, HEIGHT: height, AGE: age, GENDER: gender, ACTIVITY: activity } = userInfo;

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

      const dailyCalories = BMR * (activityFactor[activity] || 1.2);
      setMinCaloriesDay(dailyCalories);
      setMinCaloriesWeek(dailyCalories * 7);
    };

    calculateMinCalories();
  }, [userInfo, enqueueSnackbar]);

  useEffect(() => {
    const calculateCalories = () => {
      const totalWeek = weekData.reduce((sum, item) => sum + item.CALORIES, 0);
      setTotalCalories(totalWeek);

      const todayData = weekData.find((item) => item.DAY === new Date().toLocaleDateString("en-US", { weekday: "long" }));
      setTotalDailyCalories(todayData ? todayData.CALORIES : 0);
    };

    fetchWeekData();
    calculateCalories();
  }, [weekData, fetchWeekData]);

  const getMealSuggestions = (goal) => {
    const meals = {
      gain: [
        { name: "Sữa chua với trái cây", calories: 300 },
        { name: "Cơm gà xào rau", calories: 500 },
        { name: "Bánh mì kẹp thịt", calories: 450 },
        { name: "Nước ép bơ", calories: 200 },
        { name: "Mỳ Ý sốt kem", calories: 700 },
        { name: "Bò viên sốt cà chua", calories: 550 },
        { name: "Phở gà", calories: 600 },
        { name: "Cơm chiên dương châu", calories: 650 },
        { name: "Cháo yến mạch với chuối", calories: 350 },
        { name: "Trái cây khô và hạt chia", calories: 250 },
      ],
      lose: [
        { name: "Salad rau xanh", calories: 150 },
        { name: "Cá hồi nướng", calories: 200 },
        { name: "Gà luộc", calories: 180 },
        { name: "Trái cây tươi", calories: 100 },
        { name: "Soup bí đỏ", calories: 120 },
        { name: "Salad cá ngừ", calories: 250 },
        { name: "Gà xào rau củ", calories: 250 },
        { name: "Bánh mì nướng với bơ", calories: 170 },
        { name: "Trái cây tươi trộn hạt", calories: 150 },
        { name: "Sữa chua không đường", calories: 100 },
      ],
      maintain: [
        { name: "Cơm với thịt bò xào", calories: 350 },
        { name: "Mỳ Ý sốt cà chua", calories: 450 },
        { name: "Cháo yến mạch", calories: 200 },
        { name: "Trái cây trộn", calories: 150 },
        { name: "Gà nướng", calories: 400 },
        { name: "Cá ngừ salad", calories: 300 },
        { name: "Cơm gà luộc", calories: 500 },
        { name: "Súp cà rốt", calories: 180 },
        { name: "Bánh mì sandwich với trứng", calories: 250 },
        { name: "Mì gà xào rau củ", calories: 450 },
      ],
    };

    return meals[goal].sort(() => 0.5 - Math.random()).slice(0, 5);
  };

  useEffect(() => {
    const goal = totalCalories < minCaloriesWeek ? "gain" : totalCalories > minCaloriesWeek ? "lose" : "maintain";
    setSuggestedMeals({
      gain: getMealSuggestions("gain"),
      lose: getMealSuggestions("lose"),
      maintain: getMealSuggestions("maintain"),
    });
  }, [totalCalories, minCaloriesWeek]);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Báo cáo calo tuần này
      </Typography>

      {userInfo && (
        <div>
          <Typography variant="body1" gutterBottom>
            <strong>Tên:</strong> {userInfo.USERNAME}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Tuổi:</strong> {userInfo.AGE}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Chiều cao:</strong> {userInfo.HEIGHT} cm
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Cân nặng:</strong> {userInfo.WEIGHT} kg
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Mức độ vận động:</strong> {userInfo.ACTIVITY}
          </Typography>
        </div>
      )}

      <Typography variant="body1" gutterBottom>
        <strong>Lượng calo tối thiểu mỗi ngày:</strong> {minCaloriesDay.toFixed(1)} calo
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Lượng calo hôm nay:</strong> {totalDailyCalories.toFixed(1)} calo
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Tổng lượng calo tiêu thụ (tuần):</strong> {totalCalories.toFixed(1)} calo
      </Typography>

      <Alert severity={totalCalories < minCaloriesWeek ? "warning" : "success"}>
        {totalCalories < minCaloriesWeek
          ? "Bạn tiêu thụ ít hơn mức calo tối thiểu trong tuần."
          : "Bạn đã tiêu thụ đủ lượng calo tối thiểu trong tuần."}
      </Alert>

      <Typography variant="body1" gutterBottom>
        Dựa trên lượng calo bạn đã tiêu thụ, bạn cần điều chỉnh để:
        {totalCalories < minCaloriesWeek
          ? " Tăng lượng calo"
          : totalCalories > minCaloriesWeek
          ? " Giảm lượng calo"
          : " Giữ lượng calo ổn định"}
        .
      </Typography>

      <Typography variant="h6" gutterBottom>
        Gợi ý thực đơn
      </Typography>

      {Object.keys(suggestedMeals).map((goal) => (
        <div key={goal}>
          <Typography variant="subtitle1" gutterBottom>
            {goal === "gain" ? "Tăng cân" : goal === "lose" ? "Giảm cân" : "Giữ cân"}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Món ăn</TableCell>
                  <TableCell>Calo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suggestedMeals[goal].map((meal, index) => (
                  <TableRow key={index}>
                    <TableCell>{meal.name}</TableCell>
                    <TableCell>{meal.calories}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </div>
  );
};

export default UserInfo;
