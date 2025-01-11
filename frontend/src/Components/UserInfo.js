import React, { useEffect, useState, useContext } from "react";
import { Alert, Typography } from "@mui/material";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { AppContext } from "../../Context/AppContext";

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
  const [dailyNutrition, setDailyNutrition] = useState([]);
  const [highestNutritionDays, setHighestNutritionDays] = useState({});

  useEffect(() => {
    const calculateMinCalories = () => {
      if (!userInfo || !userInfo.WEIGHT || !userInfo.HEIGHT || !userInfo.AGE || !userInfo.GENDER || !userInfo.ACTIVITY) {
        enqueueSnackbar("Thông tin người dùng không đầy đủ để tính toán calo tối thiểu.", {
          variant: "warning",
        });
        return;
      }

      const { WEIGHT: weight, HEIGHT: height, AGE: age, GENDER: gender, ACTIVITY: activity } = userInfo;

      const BMR =
        gender === "male"
          ? 10 * weight + 6.25 * height - 5 * age + 5
          : 10 * weight + 6.25 * height - 5 * age - 161;

      const activityFactor = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
      };

      const dailyCalories = BMR * (activityFactor[activity] || 1.2);
      setMinCaloriesWeek(dailyCalories * 7);
      setMinCaloriesMonth(dailyCalories * 30);
    };

    calculateMinCalories();
  }, [userInfo, enqueueSnackbar]);

  useEffect(() => {
    const calculateTotalCalories = () => {
      const totalWeek = weekData.reduce((sum, item) => sum + item.CALORIES, 0);
      setTotalCalories(totalWeek);

      const totalMonth = totalWeek * 4;
      setTotalMonthlyCalories(totalMonth);

      const dailyNutritionData = weekData.map((item) => ({
        day: item.DAY,
        protein: item.PROTEIN || 0,
        carbs: item.CARBS || 0,
        fat: item.FAT || 0,
        calcium: item.CALCIUM || 0,
      }));

      const totalProtein = dailyNutritionData.reduce((sum, item) => sum + item.protein, 0);
      const totalCarbs = dailyNutritionData.reduce((sum, item) => sum + item.carbs, 0);
      const totalFat = dailyNutritionData.reduce((sum, item) => sum + item.fat, 0);
      const totalCalcium = dailyNutritionData.reduce((sum, item) => sum + item.calcium, 0);

      setNutritionSummary({ protein: totalProtein, carbs: totalCarbs, fat: totalFat, calcium: totalCalcium });
      setDailyNutrition(dailyNutritionData);

      const highestDays = {
        protein: dailyNutritionData.reduce((max, item) => (item.protein > max.value ? { day: item.day, value: item.protein } : max), { day: "", value: 0 }),
        carbs: dailyNutritionData.reduce((max, item) => (item.carbs > max.value ? { day: item.day, value: item.carbs } : max), { day: "", value: 0 }),
        fat: dailyNutritionData.reduce((max, item) => (item.fat > max.value ? { day: item.day, value: item.fat } : max), { day: "", value: 0 }),
        calcium: dailyNutritionData.reduce((max, item) => (item.calcium > max.value ? { day: item.day, value: item.calcium } : max), { day: "", value: 0 }),
      };

      setHighestNutritionDays(highestDays);
    };

    fetchWeekData();
    calculateTotalCalories();
  }, [weekData, fetchWeekData]);

  const categories = weekData.map((item) => item.DAY);
  const weekCalories = weekData.map((item) => item.CALORIES);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Báo cáo calo tuần này
      </Typography>

      <Typography variant="body1" gutterBottom>
        <strong>Tổng hợp dinh dưỡng trong tuần:</strong>
      </Typography>
      <Typography variant="body2" gutterBottom>
        - Đạm (Protein): {nutritionSummary.protein.toFixed(1)} g (Ngày cao nhất: {highestNutritionDays.protein.day} - {highestNutritionDays.protein.value.toFixed(1)} g)
      </Typography>
      <Typography variant="body2" gutterBottom>
        - Tinh bột (Carbs): {nutritionSummary.carbs.toFixed(1)} g (Ngày cao nhất: {highestNutritionDays.carbs.day} - {highestNutritionDays.carbs.value.toFixed(1)} g)
      </Typography>
      <Typography variant="body2" gutterBottom>
        - Chất béo (Fat): {nutritionSummary.fat.toFixed(1)} g (Ngày cao nhất: {highestNutritionDays.fat.day} - {highestNutritionDays.fat.value.toFixed(1)} g)
      </Typography>
      <Typography variant="body2" gutterBottom>
        - Canxi (Calcium): {nutritionSummary.calcium.toFixed(1)} mg (Ngày cao nhất: {highestNutritionDays.calcium.day} - {highestNutritionDays.calcium.value.toFixed(1)} mg)
      </Typography>

      {weekData.length > 0 ? (
        <Chart
          type="bar"
          series={[
            {
              name: "Calo",
              data: weekCalories,
              color: "#FFA726",
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
