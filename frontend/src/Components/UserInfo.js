import React, { useEffect, useState, useContext } from "react";
import { Alert, Typography, Grid } from "@mui/material";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { AppContext } from "../Context/AppContext";

const UserInfo = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo, weekData, fetchWeekData } = useContext(AppContext);
  const [totalCalories, setTotalCalories] = useState(0);
  const [minCaloriesWeek, setMinCaloriesWeek] = useState(0);
  const [minCaloriesMonth, setMinCaloriesMonth] = useState(0);
  const [totalMonthlyCalories, setTotalMonthlyCalories] = useState(0);
  const [suggestedMeals, setSuggestedMeals] = useState([]);

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
        sedentary: 1.2, // Không vận động
        light: 1.375, // Vận động nhẹ
        moderate: 1.55, // Vận động trung bình
        active: 1.725, // Vận động cao
        very_active: 1.9, // Vận động rất cao
      };

      const dailyCalories = BMR * (activityFactor[activity] || 1.2); // Lượng calo mỗi ngày
      const weeklyCalories = dailyCalories * 7; // Lượng calo mỗi tuần
      const monthlyCalories = dailyCalories * 30; // Lượng calo mỗi tháng
      setMinCaloriesWeek(weeklyCalories);
      setMinCaloriesMonth(monthlyCalories);
    };

    calculateMinCalories();
  }, [userInfo, enqueueSnackbar]);

  useEffect(() => {
    const calculateTotalCalories = () => {
      const totalWeek = weekData.reduce((sum, item) => sum + item.CALORIES, 0);
      setTotalCalories(totalWeek);

      // Giả sử tuần dữ liệu đại diện, nhân tổng calo tuần với 4 để ước tính tháng
      const totalMonth = totalWeek * 4;
      setTotalMonthlyCalories(totalMonth);
    };

    fetchWeekData();
    calculateTotalCalories();
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

    return meals[goal] || [];
  };

  useEffect(() => {
    const goal = totalCalories < minCaloriesWeek ? "gain" : totalCalories > minCaloriesWeek ? "lose" : "maintain";
    const suggestedMeals = getMealSuggestions(goal);
    setSuggestedMeals(suggestedMeals);
  }, [totalCalories, minCaloriesWeek]);

  // Tạo dữ liệu biểu đồ
  const categories = weekData.map((item) => item.DAY); // Tên các ngày trong tuần
  const weekCalories = weekData.map((item) => item.CALORIES); // Calo từng ngày

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
            <strong>Giới tính:</strong> {userInfo.GENDER === "male" ? "Nam" : "Nữ"}
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
        <strong>Tổng lượng calo tiêu thụ (tuần):</strong> {totalCalories.toFixed(1)} calo
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Lượng calo tối thiểu cần thiết trong tuần:</strong> {minCaloriesWeek.toFixed(1)} calo
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Tổng lượng calo tiêu thụ (tháng):</strong> {totalMonthlyCalories.toFixed(1)} calo
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Lượng calo tối thiểu cần thiết trong tháng:</strong> {minCaloriesMonth.toFixed(1)} calo
      </Typography>

      {totalCalories < minCaloriesWeek ? (
        <Alert severity="warning">
          Bạn tiêu thụ ít hơn mức calo tối thiểu cần thiết trong tuần. Hãy chú ý bổ sung thêm dinh dưỡng!
        </Alert>
      ) : (
        <Alert severity="success">
          Bạn đã tiêu thụ đủ lượng calo tối thiểu trong tuần.
        </Alert>
      )}

      {weekData.length > 0 ? (
        <Chart
          type="bar"
          series={[{ name: "Calo", data: weekCalories, color: "#FFA726" }]}
          height={350}
          options={{
            xaxis: { categories, title: { text: "Ngày" } },
            yaxis: { title: { text: "Calo" } },
            chart: { toolbar: { show: false } },
            plotOptions: { bar: { borderRadius: 6, columnWidth: "50%" } },
            dataLabels: { enabled: false },
          }}
        />
      ) : (
        <Alert severity="info">Không có dữ liệu calo tuần này.</Alert>
      )}

      <Typography variant="h6" gutterBottom>
        Gợi ý món ăn (Tăng cân)
      </Typography>

      <Grid container spacing={2}>
        {suggestedMeals.slice(0, 10).map((meal, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Typography variant="body1">{meal.name} - {meal.calories} calo</Typography>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" gutterBottom>
        Gợi ý món ăn (Giảm cân)
      </Typography>

      <Grid container spacing={2}>
        {suggestedMeals.slice(10, 20).map((meal, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Typography variant="body1">{meal.name} - {meal.calories} calo</Typography>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" gutterBottom>
        Gợi ý món ăn (Giữ cân)
      </Typography>

      <Grid container spacing={2}>
        {suggestedMeals.slice(20, 30).map((meal, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Typography variant="body1">{meal.name} - {meal.calories} calo</Typography>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default UserInfo;
