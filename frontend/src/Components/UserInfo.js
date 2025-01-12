import React, { useEffect, useState, useContext } from "react";
import { Alert, Typography } from "@mui/material";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { AppContext } from "../Context/AppContext";
import { API } from '../services/apis';

const UserInfo = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo, weekData, fetchWeekData } = useContext(AppContext);
  const [totalCalories, setTotalCalories] = useState(0);
  const [minCaloriesWeek, setMinCaloriesWeek] = useState(0);
  const [minCaloriesMonth, setMinCaloriesMonth] = useState(0);
  const [totalMonthlyCalories, setTotalMonthlyCalories] = useState(0);

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
  const [totalNutritionWeek, setTotalNutritionWeek] = useState({});
  const [totalNutritionMonth, setTotalNutritionMonth] = useState({});
  const [highestNutritionWeek, setHighestNutritionWeek] = useState('');
  const [highestNutritionMonth, setHighestNutritionMonth] = useState('');
  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const weekData = await API.totalNutrition({ user_id: userInfo.USER_ID, period: "week" });
        const monthData = await API.totalNutrition({ user_id: userInfo.USER_ID, period: "month" });
  
        setTotalNutritionWeek(weekData.total_nutrition);
        setHighestNutritionWeek(weekData.highest_nutrition);
  
        setTotalNutritionMonth(monthData.total_nutrition);
        setHighestNutritionMonth(monthData.highest_nutrition);
      } catch (error) {
        enqueueSnackbar("Lỗi khi tải dữ liệu dinh dưỡng", { variant: "error" });
      }
    };
  
    if (userInfo) {
      fetchNutritionData();
    }
  }, [userInfo, enqueueSnackbar]);
  
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
      <Typography variant="body1" gutterBottom>
        <strong>Tổng đạm tiêu thụ trong tuần:</strong> {totalNutritionWeek.proteins?.toFixed(1) || 0} g
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Tổng chất béo tiêu thụ trong tuần:</strong> {totalNutritionWeek.fat?.toFixed(1) || 0} g
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Tổng tinh bột tiêu thụ trong tuần:</strong> {totalNutritionWeek.carbohydrates?.toFixed(1) || 0} g
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Tổng canxi tiêu thụ trong tuần:</strong> {totalNutritionWeek.calcium?.toFixed(1) || 0} mg
      </Typography>

      <Typography variant="body1" gutterBottom>
        <strong>Thành phần dinh dưỡng tiêu thụ cao nhất trong tuần:</strong> {highestNutritionWeek}
      </Typography>

      <Typography variant="body1" gutterBottom>
        <strong>Tổng đạm tiêu thụ trong tháng:</strong> {totalNutritionMonth.proteins?.toFixed(1) || 0} g
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Tổng chất béo tiêu thụ trong tháng:</strong> {totalNutritionMonth.fat?.toFixed(1) || 0} g
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Tổng tinh bột tiêu thụ trong tháng:</strong> {totalNutritionMonth.carbohydrates?.toFixed(1) || 0} g
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Tổng canxi tiêu thụ trong tháng:</strong> {totalNutritionMonth.calcium?.toFixed(1) || 0} mg
      </Typography>

      <Typography variant="body1" gutterBottom>
        <strong>Thành phần dinh dưỡng tiêu thụ cao nhất trong tháng:</strong> {highestNutritionMonth}
      </Typography>

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