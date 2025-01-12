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
  const [mealSuggestions, setMealSuggestions] = useState([]);

  // Cập nhật gợi ý món ăn
  const generateMealSuggestions = () => {
    if (!userInfo) return;

    const { GOAL } = userInfo; // Giả sử 'GOAL' là mục tiêu dinh dưỡng của người dùng

    let suggestions = [];
    if (GOAL === "increase_weight") {
      suggestions = [
        "Cháo yến mạch với quả bơ và hạt chia",
        "Salad bơ, hạt điều, và thịt gà",
        "Sinh tố chuối, sữa chua và hạt lanh",
        "Cơm chiên với trứng, thịt và rau củ"
      ];
    } else if (GOAL === "lose_weight") {
      suggestions = [
        "Salad rau xanh với ức gà nướng",
        "Súp cà rốt, khoai lang và thịt bò",
        "Sữa chua không đường với quả mọng",
        "Trứng luộc và rau cải xào"
      ];
    } else if (GOAL === "maintain_weight") {
      suggestions = [
        "Cơm gạo lứt với cá hồi và rau cải",
        "Bánh mì nguyên cám với trứng và bơ",
        "Sữa đậu nành và ngũ cốc",
        "Mỳ ống với thịt gà và rau củ"
      ];
    } else if (GOAL === "improve_health") {
      suggestions = [
        "Cháo yến mạch với trái cây tươi",
        "Sữa chua với hạt chia và quả mâm xôi",
        "Salad rau quả với dầu ô liu",
        "Sinh tố bơ và rau xanh"
      ];
    }

    setMealSuggestions(suggestions);
  };

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
    generateMealSuggestions(); // Gọi hàm tạo gợi ý món ăn
  }, [weekData, fetchWeekData, userInfo]);

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

      <Typography variant="h6" gutterBottom>
        Gợi ý món ăn:
      </Typography>
      <ul>
        {mealSuggestions.map((meal, index) => (
          <li key={index}>{meal}</li>
        ))}
      </ul>

      {weekData.length > 0 ? (
        <Chart
          type="bar"
          series={[{ name: "Calo", data: weekCalories, color: "#FFA726" }]}
          height={350}
          options={{
            xaxis: { categories: categories, title: { text: "Ngày" } },
            yaxis: { title: { text: "Calo" } },
            chart: { toolbar: { show: false } },
            plotOptions: {
              bar: { borderRadius: 6, columnWidth: "50%" },
            },
            dataLabels: { enabled: false },
          }}
        />
      ) : (
        <Alert severity="info">Không có dữ liệu calo tuần này.</Alert>
      )}
    </div>
  );
};

export default UserInfo;
