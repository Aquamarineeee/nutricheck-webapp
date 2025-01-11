import React, { useEffect, useState, useContext } from "react";
import { Alert, Typography } from "@mui/material";
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
  const [nutritionSummary, setNutritionSummary] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
    calcium: 0,
  });
  const [dailyTopNutrients, setDailyTopNutrients] = useState([]);
  const [weeklyTopNutrients, setWeeklyTopNutrients] = useState([]);

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
      if (weekData.length > 0) {
        calculateNutritionData(); };
      const totalWeek = weekData.reduce((sum, item) => sum + item.CALORIES, 0);
      setTotalCalories(totalWeek);

      // Giả sử tuần dữ liệu đại diện, nhân tổng calo tuần với 4 để ước tính tháng
      const totalMonth = totalWeek * 4;
      setTotalMonthlyCalories(totalMonth);

      // Tổng hợp dinh dưỡng
      const totalProtein = weekData.reduce((sum, item) => sum + (item.PROTEIN || 0), 0);
      const totalCarbs = weekData.reduce((sum, item) => sum + (item.CARBS || 0), 0);
      const totalFat = weekData.reduce((sum, item) => sum + (item.FAT || 0), 0);
      const totalCalcium = weekData.reduce((sum, item) => sum + (item.CALCIUM || 0), 0);


      

      setNutritionSummary({
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        calcium: totalCalcium,
      });
    };

    const findTopNutrients = () => {
      // Lọc thành phần dinh dưỡng cao nhất trong ngày
      const dailyTop = weekData.map((day) => {
        const nutrients = [
          { name: "Protein", value: day.PROTEIN || 0 },
          { name: "Carbs", value: day.CARBS || 0 },
          { name: "Fat", value: day.FAT || 0 },
          { name: "Calcium", value: day.CALCIUM || 0 },
        ];
        nutrients.sort((a, b) => b.value - a.value);
        return { day: day.DAY, topNutrient: nutrients[0] };
      });

      setDailyTopNutrients(dailyTop);

      // Tổng hợp thành phần dinh dưỡng trong tuần
      const weeklyTotal = {
        protein: weekData.reduce((sum, item) => sum + (item.PROTEIN || 0), 0),
        carbs: weekData.reduce((sum, item) => sum + (item.CARBS || 0), 0),
        fat: weekData.reduce((sum, item) => sum + (item.FAT || 0), 0),
        calcium: weekData.reduce((sum, item) => sum + (item.CALCIUM || 0), 0),
      };
      const weeklySorted = Object.entries(weeklyTotal)
        .map(([key, value]) => ({ name: key, value }))
        .sort((a, b) => b.value - a.value);

      setWeeklyTopNutrients(weeklySorted);
    };

    fetchWeekData();
    calculateTotalCalories();
    findTopNutrients();
  }, [weekData, fetchWeekData]);

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
<Typography variant="h6">Tổng lượng calo tiêu thụ</Typography>
<Typography variant="body1">
    <strong>Tuần:</strong>
    <ul>
        <li>Chất béo: {weeklyNutrition.fat?.toFixed(2)} cal</li>
        <li>Tinh bột: {weeklyNutrition.carbs?.toFixed(2)} cal</li>
        <li>Đạm: {weeklyNutrition.protein?.toFixed(2)} cal</li>
        <li>Canxi: {weeklyNutrition.calcium?.toFixed(2)} mg</li>
    </ul>
</Typography>
<Typography variant="body1">
    <strong>Hàm lượng cao nhất tuần:</strong> {maxWeekly[0]} ({maxWeekly[1]?.toFixed(2)} cal)
</Typography>

<Typography variant="body1">
    <strong>Tháng:</strong>
    <ul>
        <li>Chất béo: {monthlyNutrition.fat?.toFixed(2)} cal</li>
        <li>Tinh bột: {monthlyNutrition.carbs?.toFixed(2)} cal</li>
        <li>Đạm: {monthlyNutrition.protein?.toFixed(2)} cal</li>
        <li>Canxi: {monthlyNutrition.calcium?.toFixed(2)} mg</li>
    </ul>
</Typography>
<Typography variant="body1">
    <strong>Hàm lượng cao nhất tháng:</strong> {maxMonthly[0]} ({maxMonthly[1]?.toFixed(2)} cal)
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
          series={[
            {
              name: "Calo",
              data: weekCalories,
              color: "#FFA726", // Màu thanh biểu đồ
            },
          ]}
          height={350}
          options={{
            xaxis: {
              categories: categories,
              title: { text: "Ngày" },
            },
            yaxis: {
              title: { text: "Calo" },
            },
            chart: {
              toolbar: { show: false },
            },
            plotOptions: {
              bar: {
                borderRadius: 6,
                columnWidth: "50%",
              },
            },
            dataLabels: {
              enabled: false,
            },
          }}
        />
      ) : (
        <Alert severity="info">Không có dữ liệu calo tuần này.</Alert>
      )}
    </div>
  );
};

export default UserInfo;
