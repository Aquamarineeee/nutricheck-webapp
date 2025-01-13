import React, { useEffect, useState, useContext } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { AppContext } from "../Context/AppContext";


const UserInfo = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo, weekData, fetchWeekData } = useContext(AppContext);
  const [totalCalories, setTotalCalories] = useState(0);
  const [dailyCaloriesConsumed, setDailyCaloriesConsumed] = useState(0);
  const [minCaloriesDay, setMinCaloriesDay] = useState(0);
  const [minCaloriesWeek, setMinCaloriesWeek] = useState(0);
  const [minCaloriesMonth, setMinCaloriesMonth] = useState(0);
  const [totalMonthlyCalories, setTotalMonthlyCalories] = useState(0);
  const [suggestedMeals, setSuggestedMeals] = useState({ gain: [], lose: [], maintain: [] });


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

      setMinCaloriesDay(dailyCalories)
      setMinCaloriesWeek(weeklyCalories);
      setMinCaloriesMonth(monthlyCalories);
    };

    calculateMinCalories();
  }, [userInfo, enqueueSnackbar]);

  useEffect(() => {
    const calculateTotalCalories = () => {
      const totalWeek = weekData.reduce((sum, item) => sum + item.CALORIES, 0);
      setTotalCalories(totalWeek);

      const todayData = weekData.find((item) => item.DAY === new Date().toLocaleDateString("en-US", { weekday: "long" }));
      setDailyCaloriesConsumed(todayData ? todayData.CALORIES : 0);

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

    return meals[goal] ? meals[goal].sort(() => Math.random() - 0.5).slice(0, 5) : [];
  };

  useEffect(() => {
    const goal = totalCalories < minCaloriesWeek ? "gain" : totalCalories > minCaloriesWeek ? "lose" : "maintain";
    setSuggestedMeals({
      gain: getMealSuggestions("gain"),
      lose: getMealSuggestions("lose"),
      maintain: getMealSuggestions("maintain"),
    });
  }, [totalCalories, minCaloriesWeek]);

  // Tạo dữ liệu biểu đồ
  const categories = weekData.map((item) => item.DAY); // Tên các ngày trong tuần
  const weekCalories = weekData.map((item) => item.CALORIES); // Calo từng ngày

  return (
    <div>
      <Typography variant="h6" align="center" gutterBottom style={{ fontWeight: "bold", fontSize: "20px" }}>
  Báo cáo calo tuần này của người dùng...
</Typography>

{userInfo && (
  <TableContainer component={Paper} style={{ margin: "20px auto", maxWidth: "600px" }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center" colSpan={2} style={{ fontWeight: "bold", fontSize: "16px" }}>
            Thông tin người dùng
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell align="right"><strong>Tên:</strong></TableCell>
          <TableCell align="left">{userInfo.USERNAME}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right"><strong>Tuổi:</strong></TableCell>
          <TableCell align="left">{userInfo.AGE}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right"><strong>Giới tính:</strong></TableCell>
          <TableCell align="left">{userInfo.GENDER === "male" ? "Nam" : "Nữ"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right"><strong>Chiều cao:</strong></TableCell>
          <TableCell align="left">{userInfo.HEIGHT} cm</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right"><strong>Cân nặng:</strong></TableCell>
          <TableCell align="left">{userInfo.WEIGHT} kg</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right"><strong>Mức độ vận động:</strong></TableCell>
          <TableCell align="left">{userInfo.ACTIVITY}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
)}

      <Typography variant="body1" gutterBottom>
        <strong><br /> Tổng lượng calo tiêu thụ (tuần):</strong> {totalCalories.toFixed(1)} calo
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
        <strong><br />Lượng calo tối thiểu mỗi ngày:</strong> {minCaloriesDay.toFixed(1)} calo
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Lượng calo tiêu thụ hôm nay:</strong> {dailyCaloriesConsumed.toFixed(1)} calo
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Lượng calo tối thiểu mỗi tuần:</strong> {minCaloriesWeek.toFixed(1)} calo
      </Typography>

      <Alert severity={dailyCaloriesConsumed < minCaloriesDay ? "warning" : "success"}>
      <br /> Dựa trên lượng calo bạn đã tiêu thụ, có thể thấy bạn {dailyCaloriesConsumed < minCaloriesDay ? "cần ăn thêm để tăng calo" : "đã tiêu thụ đủ calo trong ngày"}.
      </Alert>


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
        <Typography variant="h6" align="center" gutterBottom style={{ fontWeight: "bold", fontSize: "20px" }} >
                      Gợi ý thực đơn <br />
      </Typography>

      {Object.keys(suggestedMeals).map((goal) => (
        <div key={goal}>
          <Typography variant="body1" gutterBottom>
            <strong>{goal === "gain" ? "Tăng cân" : goal === "lose" ? "Giảm cân" : "Giữ cân"}</strong>
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên món</TableCell>
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
        </div>
      ))}
    </div>
  );
};

export default UserInfo;

