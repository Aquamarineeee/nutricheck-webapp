import React, { useEffect, useState, useContext } from "react";
import { Alert, Typography } from "@mui/material";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { AppContext } from "../Context/AppContext";
import { API } from "../services/apis";
import { Button } from "@mui/material";


const UserInfo = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo, weekData, fetchWeekData } = useContext(AppContext);
  const [totalCalories, setTotalCalories] = useState(0);
  const [minCaloriesWeek, setMinCaloriesWeek] = useState(0);
  const [minCaloriesMonth, setMinCaloriesMonth] = useState(0);
  const [totalMonthlyCalories, setTotalMonthlyCalories] = useState(0);
  const [weekNutrition, setWeekNutrition] = useState(null); // Dữ liệu dinh dưỡng tuần
  const [monthNutrition, setMonthNutrition] = useState(null); // Dữ liệu dinh dưỡng tháng
  const [activePeriod, setActivePeriod] = useState("week"); // Giai đoạn hiển thị: "week" hoặc "month"

  useEffect(() => {
    const fetchNutritionData = async (period) => {
      try {
        if (!userInfo?.USER_ID) {
          enqueueSnackbar("Không tìm thấy ID người dùng.", { variant: "warning" });
          return;
        }
        const data = await totalNutrition({ user_id: userInfo.USER_ID, period });
        if (period === "week") setWeekNutrition(data);
        if (period === "month") setMonthNutrition(data);
      } catch (error) {
        enqueueSnackbar("Không thể lấy dữ liệu dinh dưỡng.", { variant: "error" });
      }
    };
        // Gọi API cho cả tuần và tháng
        fetchNutritionData("week");
        fetchNutritionData("month");
      }, [userInfo, enqueueSnackbar]);

  const activeNutrition = activePeriod === "week" ? weekNutrition : monthNutrition;
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
      <Button
        variant={activePeriod === "week" ? "contained" : "outlined"}
        onClick={() => setActivePeriod("week")}
      >
        Tuần này
      </Button>
      <Button
        variant={activePeriod === "month" ? "contained" : "outlined"}
        onClick={() => setActivePeriod("month")}
      >
        Tháng này
      </Button>

      {activeNutrition ? (
        <div>
          <Typography variant="body1">
            <strong>Tổng lượng Protein:</strong> {activeNutrition.total_nutrition.proteins.toFixed(1)} g
          </Typography>
          <Typography variant="body1">
            <strong>Tổng lượng Chất béo:</strong> {activeNutrition.total_nutrition.fat.toFixed(1)} g
          </Typography>
          <Typography variant="body1">
            <strong>Tổng lượng Tinh bột:</strong> {activeNutrition.total_nutrition.carbohydrates.toFixed(1)} g
          </Typography>
          <Typography variant="body1">
            <strong>Tổng lượng Canxi:</strong> {activeNutrition.total_nutrition.calcium.toFixed(1)} mg
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Mức tối thiểu cần thiết:</strong>
          </Typography>
          <ul>
            <li>Protein: {activeNutrition.minimum_requirements.proteins.toFixed(1)} g</li>
            <li>Chất béo: {activeNutrition.minimum_requirements.fat.toFixed(1)} g</li>
            <li>Tinh bột: {activeNutrition.minimum_requirements.carbohydrates.toFixed(1)} g</li>
            <li>Canxi: {activeNutrition.minimum_requirements.calcium.toFixed(1)} mg</li>
          </ul>
          <Typography variant="body1" gutterBottom>
            <strong>Chênh lệch so với mức tối thiểu:</strong>
          </Typography>
          <ul>
            <li>Protein: {activeNutrition.differences.proteins.toFixed(1)} g</li>
            <li>Chất béo: {activeNutrition.differences.fat.toFixed(1)} g</li>
            <li>Tinh bột: {activeNutrition.differences.carbohydrates.toFixed(1)} g</li>
            <li>Canxi: {activeNutrition.differences.calcium.toFixed(1)} mg</li>
          </ul>
        </div>
      ) : (
        <Alert severity="info">Đang tải dữ liệu dinh dưỡng...</Alert>
      )}

      {activeNutrition && activeNutrition.differences.proteins < 0 && (
        <Alert severity="warning">
          Bạn chưa đạt mức tiêu thụ tối thiểu một số thành phần dinh dưỡng trong giai đoạn này!
        </Alert> )}

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