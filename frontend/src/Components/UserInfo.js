import React, { useEffect, useState, useContext } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Alert, Box } from "@mui/material";
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
  const getHealthWarnings = () => {
    // Kiểm tra xem lượng calo tiêu thụ có thấp hơn 80% lượng calo tối thiểu không
    if (totalCalories < minCaloriesWeek * 0.8) {
      // Giải thích chi tiết cho người dùng về tác hại của việc tiêu thụ quá ít calo
      return "Tuy nhiên, tôi cũng sẽ đưa ra khuyến cáo sức khỏe cho bạn với lượng calo trên: Bạn tiêu thụ quá ít calo trong tuần, điều này có thể dẫn đến suy dinh dưỡng. Lượng calo quá thấp sẽ không đủ để cơ thể tạo năng lượng cần thiết cho các hoạt động cơ bản như hô hấp, tuần hoàn, và vận động. Hãy kiểm tra lại chế độ ăn của mình, bổ sung các thực phẩm giàu dinh dưỡng như rau, protein, và ngũ cốc nguyên hạt để cải thiện năng lượng hàng ngày. \nNếu bạn đang có nhu cầu giảm cân, vui lòng hãy đọc khuyến cáo sức khỏe ở trên và chú ý phòng các bệnh tật liên quan để giữ cho mình sức khỏe tốt nhất.";
    } 
    // Kiểm tra xem lượng calo tiêu thụ có vượt quá 120% lượng calo tối thiểu không
    else if (totalCalories > minCaloriesWeek * 1.2) {
      // Giải thích chi tiết về tác hại của việc tiêu thụ quá nhiều calo
      return "Tuy nhiên, tôi cũng sẽ đưa ra khuyến cáo sức khỏe cho bạn với lượng calo trên: \nBạn tiêu thụ quá nhiều calo trong tuần, điều này có thể dẫn đến tăng cân và các bệnh mãn tính. Khi lượng calo nạp vào vượt quá mức cơ thể cần, năng lượng dư thừa sẽ chuyển hóa thành mỡ, tích tụ lâu ngày gây béo phì. Điều này làm tăng nguy cơ mắc các bệnh như tiểu đường, cao huyết áp, và tim mạch. Hãy điều chỉnh chế độ ăn, giảm thực phẩm chứa nhiều đường và chất béo, tăng cường rau xanh và thực phẩm ít calo.";
    } 
    // Trường hợp lượng calo tiêu thụ nằm trong mức hợp lý
    else {
      // Giải thích về lợi ích của việc duy trì mức calo hợp lý
      return "Lượng calo tiêu thụ trong tuần của bạn nằm trong mức hợp lý, cho thấy bạn đang duy trì một chế độ ăn uống cân bằng. Điều này giúp cơ thể bạn có đủ năng lượng để hoạt động mà không tích tụ mỡ thừa, đồng thời giảm nguy cơ mắc các bệnh liên quan đến dinh dưỡng. Hãy tiếp tục duy trì chế độ ăn uống này, kết hợp với luyện tập thể dục để tăng cường sức khỏe.";
    }
  };

  return (
    <div>
      <Box
    sx={{
      border: "2px solid #A5D6A7", // Màu xanh lá cây nhạt
      borderRadius: "8px",         // Bo góc
      padding: "16px",             // Khoảng cách bên trong
      margin: "16px 0",            // Khoảng cách bên ngoài
      backgroundColor: "#E8F5E9",  // Màu nền nhẹ
    }}
  >
    <Typography
      variant="h6"
      align="center"
      gutterBottom
      style={{ fontWeight: "bold", fontSize: "23px" }}
    >
      <br /> Báo cáo calo tuần này của người dùng...
    </Typography>
  </Box>

{userInfo && (
  <TableContainer component={Paper} style={{ margin: "20px auto", maxWidth: "600px" }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center" colSpan={2} style={{ fontWeight: "bold", fontSize: "23px" }}>
            Thông tin người dùng
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }} ><strong>Tên:</strong></TableCell>
          <TableCell align="left" style={{fontSize: "19px"}}>{userInfo.USERNAME}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}><strong>Tuổi:</strong></TableCell>
          <TableCell align="left" style={{fontSize: "19px"}}>{userInfo.AGE}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}><strong>Giới tính:</strong></TableCell>
          <TableCell align="left" style={{fontSize: "19px"}}>{userInfo.GENDER === "male" ? "Nam" : "Nữ"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}><strong>Chiều cao:</strong></TableCell>
          <TableCell align="left" style={{fontSize: "19px"}}>{userInfo.HEIGHT} cm</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }} ><strong>Cân nặng:</strong></TableCell>
          <TableCell align="left" style={{fontSize: "19px"}}>{userInfo.WEIGHT} kg</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}><strong>Mức độ vận động:</strong></TableCell>
          <TableCell align="left" style={{fontSize: "19px"}}>{userInfo.ACTIVITY}</TableCell>
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
        <Alert severity="warning" sx={{ fontWeight: "bold", fontSize: "17px" }} >
          Bạn tiêu thụ ít hơn mức calo tối thiểu cần thiết trong tuần. Hãy chú ý bổ sung thêm dinh dưỡng!
        </Alert>
      ) : (
        <Alert severity="success" sx={{ fontWeight: "bold", fontSize: "17px" }} >
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

      <Alert severity={dailyCaloriesConsumed < minCaloriesDay ? "warning" : "success"} sx={{ fontWeight: "bold", fontSize: "17px" }} >
        Dựa trên lượng calo bạn đã tiêu thụ, có thể thấy bạn {dailyCaloriesConsumed < minCaloriesDay ? "cần ăn thêm để tăng calo" : "đã tiêu thụ đủ calo trong ngày"}.
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
      <Box
            sx={{
              border: "2px solidrgb(130, 194, 244)", // Màu xanh dương cây nhạt
              borderRadius: "5px",         // Bo góc
              padding: "16px",             // Khoảng cách bên trong
              margin: "16px 0",            // Khoảng cách bên ngoài
              backgroundColor: "#7FFFD4",  // Màu nền nhẹ
            }}
          >
            <Typography variant="h6" align="center" gutterBottom style={{ fontWeight: "bold", fontSize: "25px" }} >
                      Gợi ý thực đơn <br />
            </Typography>
  </Box>
        

      {Object.keys(suggestedMeals).map((goal) => (
        <div key={goal}>
          <Typography
            variant="body1"
            align="center"
            gutterBottom
            style={{ fontWeight: "bold", fontSize: "20px" }}
          >
            <strong>{goal === "gain" ? "\nNhu cầu tăng cân" : goal === "lose" ? "\nNhu cầu giảm cân" : "\nNhu cầu giữ cân nặng ổn định"}</strong>
          </Typography>
          <Box
            sx={{
              border: "2px solid #A5D6A7", // Màu xanh lá cây nhạt
              borderRadius: "8px",         // Bo góc
              padding: "16px",             // Khoảng cách bên trong
              margin: "16px 0",            // Khoảng cách bên ngoài
              backgroundColor: "#E8F5E9",  // Màu nền nhẹ
            }}
          >
            <Typography variant="h6" align="center" gutterBottom style={{ fontWeight: "bold", fontSize: "18px" }} >
            Dựa trên lượng calo, thành phần dinh dưỡng bạn đã tiêu thụ và thể trạng của bạn, chúng tôi đã lập gợi ý thực đơn cá nhân hóa cho riêng bạn, tùy thuộc vào lựa chọn của bạn... <br/>
            </Typography>
  </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: "20px", fontWeight: "bold" }}>Tên món</TableCell>
                <TableCell style={{ fontSize: "20px" , fontWeight: "bold" }}>Calo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suggestedMeals[goal].map((meal, index) => (
                <TableRow key={index}>
                  <TableCell style={{ fontWeight: "bold", fontSize: "20px" }}>{meal.name}</TableCell>
                  <TableCell style={{ fontSize: "20px" }}>{meal.calories}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
))}
    <Box
            sx={{
              border: "2px solid #EF9A9A", // Màu đỏ nhạt
              borderRadius: "8px",
              padding: "16px",
              margin: "16px 0",
              backgroundColor: "#FFEBEE", // Màu nền nhẹ
            }}
          >
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              style={{ fontWeight: "bold", fontSize: "22px" }}
            >
              <br/> Khuyến cáo sức khỏe về nguy cơ bệnh tật 
            </Typography>
            <Typography variant="body1" style={{ fontSize: "18px" }}>
              {getHealthWarnings()}
            </Typography>
          </Box>
    </div>
  );
};

export default UserInfo;

