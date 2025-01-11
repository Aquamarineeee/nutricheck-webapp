import React, { useEffect, useState, useContext } from "react";
import { Alert, Typography } from "@mui/material";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { AppContext } from "../Context/AppContext";

const UserInfo = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo, weekData, fetchWeekData } = useContext(AppContext);

  const [totalCaloriesWeek, setTotalCaloriesWeek] = useState(0);
  const [totalCaloriesMonth, setTotalCaloriesMonth] = useState(0);
  const [nutritionSummaryWeek, setNutritionSummaryWeek] = useState({});
  const [nutritionSummaryMonth, setNutritionSummaryMonth] = useState({});
  const [highestNutrientWeek, setHighestNutrientWeek] = useState("");
  const [highestNutrientMonth, setHighestNutrientMonth] = useState("");

  useEffect(() => {
    const calculateNutrition = () => {
      // Tổng hợp calo và các dinh dưỡng trong tuần
      const weekCalories = weekData.reduce((sum, day) => sum + day.CALORIES, 0);
      const monthCalories = weekCalories * 4; // Giả định 1 tháng có 4 tuần

      const totalNutrientsWeek = {
        protein: weekData.reduce((sum, day) => sum + (day.PROTEIN || 0), 0),
        carbs: weekData.reduce((sum, day) => sum + (day.CARBS || 0), 0),
        fat: weekData.reduce((sum, day) => sum + (day.FAT || 0), 0),
        calcium: weekData.reduce((sum, day) => sum + (day.CALCIUM || 0), 0),
      };

      const totalNutrientsMonth = {
        protein: totalNutrientsWeek.protein * 4,
        carbs: totalNutrientsWeek.carbs * 4,
        fat: totalNutrientsWeek.fat * 4,
        calcium: totalNutrientsWeek.calcium * 4,
      };

      // Xác định thành phần cao nhất
      const highestWeek = Object.entries(totalNutrientsWeek).sort((a, b) => b[1] - a[1])[0];
      const highestMonth = Object.entries(totalNutrientsMonth).sort((a, b) => b[1] - a[1])[0];

      setTotalCaloriesWeek(weekCalories);
      setTotalCaloriesMonth(monthCalories);
      setNutritionSummaryWeek(totalNutrientsWeek);
      setNutritionSummaryMonth(totalNutrientsMonth);
      setHighestNutrientWeek(highestWeek[0]);
      setHighestNutrientMonth(highestMonth[0]);
    };

    fetchWeekData();
    calculateNutrition();
  }, [weekData, fetchWeekData]);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Báo cáo dinh dưỡng tuần này
      </Typography>

      {/* Hiển thị tổng lượng calo */}
      <Typography variant="body1">
        <strong>Tổng calo tiêu thụ trong tuần:</strong> {totalCaloriesWeek.toFixed(1)} calo
      </Typography>
      <Typography variant="body1">
        <strong>Tổng calo tiêu thụ trong tháng:</strong> {totalCaloriesMonth.toFixed(1)} calo
      </Typography>

      {/* Hiển thị tổng hợp dinh dưỡng */}
      <Typography variant="body1" gutterBottom>
        <strong>Tổng dinh dưỡng trong tuần:</strong>
      </Typography>
      <Typography variant="body2">
        - Protein: {nutritionSummaryWeek.protein.toFixed(1)} g
      </Typography>
      <Typography variant="body2">
        - Tinh bột (Carbs): {nutritionSummaryWeek.carbs.toFixed(1)} g
      </Typography>
      <Typography variant="body2">
        - Chất béo (Fat): {nutritionSummaryWeek.fat.toFixed(1)} g
      </Typography>
      <Typography variant="body2">
        - Canxi: {nutritionSummaryWeek.calcium.toFixed(1)} mg
      </Typography>

      <Typography variant="body1" gutterBottom>
        <strong>Tổng dinh dưỡng trong tháng:</strong>
      </Typography>
      <Typography variant="body2">
        - Protein: {nutritionSummaryMonth.protein.toFixed(1)} g
      </Typography>
      <Typography variant="body2">
        - Tinh bột (Carbs): {nutritionSummaryMonth.carbs.toFixed(1)} g
      </Typography>
      <Typography variant="body2">
        - Chất béo (Fat): {nutritionSummaryMonth.fat.toFixed(1)} g
      </Typography>
      <Typography variant="body2">
        - Canxi: {nutritionSummaryMonth.calcium.toFixed(1)} mg
      </Typography>

      {/* Hiển thị hàm lượng cao nhất */}
      <Typography variant="body1" gutterBottom>
        <strong>Thành phần cao nhất trong tuần:</strong> {highestNutrientWeek}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Thành phần cao nhất trong tháng:</strong> {highestNutrientMonth}
      </Typography>

      {/* Biểu đồ calo tuần */}
      {weekData.length > 0 ? (
        <Chart
          type="bar"
          series={[{ name: "Calo", data: weekData.map((day) => day.CALORIES) }]}
          height={350}
          options={{
            xaxis: {
              categories: weekData.map((day) => day.DAY),
              title: { text: "Ngày" },
            },
            yaxis: { title: { text: "Calo" } },
            chart: { toolbar: { show: false } },
            plotOptions: {
              bar: { borderRadius: 4, columnWidth: "50%" },
            },
            dataLabels: { enabled: false },
          }}
        />
      ) : (
        <Alert severity="info">Không có dữ liệu tuần này.</Alert>
      )}
    </div>
  );
};

export default UserInfo;
