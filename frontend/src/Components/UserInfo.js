import React, { useEffect, useState, useContext } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography, Paper, Alert, Box, Grid, Card, CardContent, 
  Button, Select, MenuItem, InputLabel, FormControl, Divider 
} from "@mui/material";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo, weekData, fetchWeekData } = useContext(AppContext);
  const [totalCalories, setTotalCalories] = useState(0);
  const [dailyCaloriesConsumed, setDailyCaloriesConsumed] = useState(0);
  const [minCaloriesDay, setMinCaloriesDay] = useState(0);
  const [minCaloriesWeek, setMinCaloriesWeek] = useState(0);
  const [minCaloriesMonth, setMinCaloriesMonth] = useState(0);
  const [totalMonthlyCalories, setTotalMonthlyCalories] = useState(0);
  const [suggestedMeals, setSuggestedMeals] = useState({ gain: [], lose: [], maintain: [] });
  const [feedback, setFeedback] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [goal, setGoal] = useState("maintain"); // 'gain', 'lose', or 'maintain'
  const [targetWeightChange, setTargetWeightChange] = useState(0);
  const [goalCalories, setGoalCalories] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation effect
  useEffect(() => {
  const handleScroll = () => {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < window.innerHeight - 100) {
        element.classList.add('visible');
        setIsVisible(true); // Thêm dòng này
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

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

      const dailyCalories = BMR * (activityFactor[activity] || 1.2);
      const weeklyCalories = dailyCalories * 7;
      const monthlyCalories = dailyCalories * 30;

      setMinCaloriesDay(dailyCalories);
      setMinCaloriesWeek(weeklyCalories);
      setMinCaloriesMonth(monthlyCalories);
      setGoalCalories(dailyCalories); // Default to maintenance calories
    };

    calculateMinCalories();
  }, [userInfo, enqueueSnackbar]);

  useEffect(() => {
    const calculateTotalCalories = () => {
      const totalWeek = weekData.reduce((sum, item) => sum + item.CALORIES, 0);
      setTotalCalories(totalWeek);

      const todayData = weekData.find((item) => item.DAY === new Date().toLocaleDateString("en-US", { weekday: "long" }));
      setDailyCaloriesConsumed(todayData ? todayData.CALORIES : 0);

      const totalMonth = totalWeek * 4;
      setTotalMonthlyCalories(totalMonth);
    };

    fetchWeekData();
    calculateTotalCalories();
  }, [weekData, fetchWeekData]);

  const calculateGoalCalories = () => {
    let adjustedCalories = minCaloriesDay;
    
    if (goal === "lose") {
      // 1 kg = ~7700 calories, so for 0.5kg/week we need ~550 calorie deficit per day
      adjustedCalories = minCaloriesDay - (targetWeightChange * 550);
    } else if (goal === "gain") {
      // For weight gain, add calories
      adjustedCalories = minCaloriesDay + (targetWeightChange * 550);
    }
    
    setGoalCalories(adjustedCalories);
  };

  const getMealSuggestions = (goal) => {
    const meals = {
      gain: [
        { name: "Sữa chua với trái cây", calories: 300, protein: 10, fat: 5, carbs: 45, weight: 200 },
        { name: "Cơm gà xào rau", calories: 500, protein: 30, fat: 15, carbs: 60, weight: 350 },
        { name: "Bánh mì kẹp thịt", calories: 450, protein: 25, fat: 20, carbs: 45, weight: 250 },
        { name: "Nước ép bơ", calories: 200, protein: 2, fat: 15, carbs: 10, weight: 300 },
        { name: "Mỳ Ý sốt kem", calories: 700, protein: 25, fat: 30, carbs: 80, weight: 400 },
        { name: "Bò viên sốt cà chua", calories: 550, protein: 35, fat: 25, carbs: 40, weight: 300 },
        { name: "Phở gà", calories: 600, protein: 30, fat: 20, carbs: 70, weight: 500 },
        { name: "Cơm chiên dương châu", calories: 650, protein: 20, fat: 25, carbs: 85, weight: 400 },
        { name: "Cháo yến mạch với chuối", calories: 350, protein: 12, fat: 8, carbs: 55, weight: 300 },
        { name: "Trái cây khô và hạt chia", calories: 250, protein: 8, fat: 12, carbs: 25, weight: 100 },
      ],
      lose: [
        { name: "Salad rau xanh", calories: 150, protein: 5, fat: 5, carbs: 20, weight: 200 },
        { name: "Cá hồi nướng", calories: 200, protein: 25, fat: 10, carbs: 0, weight: 150 },
        { name: "Gà luộc", calories: 180, protein: 30, fat: 5, carbs: 0, weight: 150 },
        { name: "Trái cây tươi", calories: 100, protein: 1, fat: 0, carbs: 25, weight: 150 },
        { name: "Soup bí đỏ", calories: 120, protein: 3, fat: 5, carbs: 15, weight: 250 },
        { name: "Salad cá ngừ", calories: 250, protein: 20, fat: 15, carbs: 5, weight: 200 },
        { name: "Gà xào rau củ", calories: 250, protein: 25, fat: 10, carbs: 15, weight: 250 },
        { name: "Bánh mì nướng với bơ", calories: 170, protein: 5, fat: 10, carbs: 15, weight: 100 },
        { name: "Trái cây tươi trộn hạt", calories: 150, protein: 5, fat: 8, carbs: 15, weight: 150 },
        { name: "Sữa chua không đường", calories: 100, protein: 10, fat: 0, carbs: 5, weight: 150 },
      ],
      maintain: [
        { name: "Cơm với thịt bò xào", calories: 350, protein: 25, fat: 15, carbs: 30, weight: 300 },
        { name: "Mỳ Ý sốt cà chua", calories: 450, protein: 15, fat: 10, carbs: 70, weight: 350 },
        { name: "Cháo yến mạch", calories: 200, protein: 8, fat: 5, carbs: 30, weight: 250 },
        { name: "Trái cây trộn", calories: 150, protein: 2, fat: 0, carbs: 35, weight: 200 },
        { name: "Gà nướng", calories: 400, protein: 40, fat: 20, carbs: 5, weight: 250 },
        { name: "Cá ngừ salad", calories: 300, protein: 25, fat: 15, carbs: 10, weight: 250 },
        { name: "Cơm gà luộc", calories: 500, protein: 30, fat: 15, carbs: 60, weight: 400 },
        { name: "Súp cà rốt", calories: 180, protein: 3, fat: 5, carbs: 30, weight: 300 },
        { name: "Bánh mì sandwich với trứng", calories: 250, protein: 15, fat: 10, carbs: 25, weight: 150 },
        { name: "Mì gà xào rau củ", calories: 450, protein: 25, fat: 15, carbs: 50, weight: 350 },
      ],
    };

    return meals[goal] ? meals[goal].sort(() => Math.random() - 0.5).slice(0, 5) : [];
  };

  useEffect(() => {
    const currentGoal = totalCalories < minCaloriesWeek ? "gain" : totalCalories > minCaloriesWeek ? "lose" : "maintain";
    setSuggestedMeals({
      gain: getMealSuggestions("gain"),
      lose: getMealSuggestions("lose"),
      maintain: getMealSuggestions("maintain"),
    });
  }, [totalCalories, minCaloriesWeek]);

  const getHealthWarnings = () => {
    if (totalCalories < minCaloriesWeek * 0.8) {
      return "Bạn tiêu thụ quá ít calo trong tuần, điều này có thể dẫn đến suy dinh dưỡng. Lượng calo quá thấp sẽ không đủ để cơ thể tạo năng lượng cần thiết cho các hoạt động cơ bản như hô hấp, tuần hoàn, và vận động. Hãy kiểm tra lại chế độ ăn của mình, bổ sung các thực phẩm giàu dinh dưỡng như rau, protein, và ngũ cốc nguyên hạt để cải thiện năng lượng hàng ngày. Người bệnh thừa cân, béo phì phải đối mặt với nhiều nguy cơ sức khỏe như: bệnh tim, cao huyết áp, đột quỵ, viêm khớp, giảm khả năng sinh sản, gan nhiễm mỡ không do rượu, đái tháo đường type 2, hội chứng ngưng thở khi ngủ… Đặc biệt, béo phì được cho là có liên quan đến 13 loại ung thư, gồm: ung thư buồng trứng, ung thư gan, ung thư não, ung thư tuyến tụy…";
    } else if (totalCalories > minCaloriesWeek * 1.2) {
      return "Bạn tiêu thụ quá nhiều calo trong tuần, điều này có thể dẫn đến tăng cân và các bệnh mãn tính. Khi lượng calo nạp vào vượt quá mức cơ thể cần, năng lượng dư thừa sẽ chuyển hóa thành mỡ, tích tụ lâu ngày gây béo phì. Điều này làm tăng nguy cơ mắc các bệnh như tiểu đường, cao huyết áp, và tim mạch. Người bệnh thừa cân, béo phì phải đối mặt với nhiều nguy cơ sức khỏe như: bệnh tim, cao huyết áp, đột quỵ, viêm khớp, giảm khả năng sinh sản, gan nhiễm mỡ không do rượu, đái tháo đường type 2, hội chứng ngưng thở khi ngủ… Đặc biệt, béo phì được cho là có liên quan đến 13 loại ung thư, gồm: ung thư buồng trứng, ung thư gan, ung thư não, ung thư tuyến tụy…";
    } else {
      return "Lượng calo tiêu thụ trong tuần của bạn nằm trong mức hợp lý, cho thấy bạn đang duy trì một chế độ ăn uống cân bằng. Điều này giúp cơ thể bạn có đủ năng lượng để hoạt động mà không tích tụ mỡ thừa, đồng thời giảm nguy cơ mắc các bệnh liên quan đến dinh dưỡng. Hãy tiếp tục duy trì chế độ ăn uống này, kết hợp với luyện tập thể dục để tăng cường sức khỏe.";
    }
  };

  const conditions = {
    calorie_deficit: [
      "Thiếu máu", "Suy dinh dưỡng", "Loãng xương", "Mất ngủ", "Mệt mỏi mãn tính",
      "Hạ đường huyết", "Trầm cảm", "Hệ miễn dịch yếu", "Chậm phát triển", "Dễ nhiễm trùng",
      "Giảm cân không kiểm soát", "Chán ăn tâm thần", "Rối loạn tiêu hóa", "Thiếu vitamin D",
      "Thiếu vitamin B12", "Hạ huyết áp", "Suy thận", "Giảm cơ", "Suy gan", "Thiếu máu cơ tim"
    ],
    calorie_surplus: [
      "Tiểu đường", "Béo phì", "Gan nhiễm mỡ", "Huyết áp cao", "Cholesterol cao",
      "Bệnh gout", "Viêm khớp", "Đột quỵ", "Ung thư đại tràng", "Chứng ngưng thở khi ngủ",
      "Loãng mạch máu", "Viêm tụy", "Rối loạn lipid máu", "Bệnh tim mạch", "Hội chứng buồng trứng đa nang",
      "Rối loạn chuyển hóa", "Chứng đau lưng mãn tính", "Hội chứng ruột kích thích", "Trào ngược dạ dày",
      "Bệnh Parkinson"
    ]
  };
  
  const suggestMenu = (condition) => {
    const menus = {
        "Thiếu máu": "Thịt đỏ, gan, rau bina, các loại đậu, ngũ cốc nguyên hạt.",
        "Suy dinh dưỡng": "Sữa chua, bơ đậu phộng, thịt đỏ, phô mai.",
        "Loãng xương": "Sữa, sữa chua, phô mai, cá hồi, trứng, cải bó xôi.",
        "Mất ngủ": "Chuối, hạnh nhân, trà hoa cúc, yến mạch, kiwi.",
        "Mệt mỏi mãn tính": "Cá hồi, hạt chia, bơ, trứng, rau cải.",
        "Hạ đường huyết": "Trái cây, các loại hạt, ngũ cốc nguyên hạt, sữa.",
        "Trầm cảm": "Cá hồi, socola đen, hạt óc chó, cải bó xôi, chuối.",
        "Hệ miễn dịch yếu": "Tỏi, nấm, gừng, cam, bông cải xanh.",
        "Chậm phát triển": "Thịt gà, cá, trứng, phô mai, sữa nguyên kem.",
        "Dễ nhiễm trùng": "Tỏi, nghệ, cá hồi, sữa chua, bông cải xanh.",
        "Giảm cân không kiểm soát": "Bơ, chuối, khoai lang, sữa nguyên kem, dầu ô liu.",
        "Chán ăn tâm thần": "Sữa, phô mai, bơ đậu phộng, chuối, ngũ cốc.",
        "Rối loạn tiêu hóa": "Sữa chua, kefir, gừng, chuối, yến mạch.",
        "Thiếu vitamin D": "Cá hồi, cá ngừ, lòng đỏ trứng, sữa tăng cường.",
        "Thiếu vitamin B12": "Gan bò, cá hồi, thịt gà, sữa chua, phô mai.",
        "Hạ huyết áp": "Chuối, cà phê, muối, quả lựu, nước dừa.",
        "Suy thận": "Táo, dâu tây, lòng trắng trứng, cải bắp, ớt chuông.",
        "Giảm cơ": "Ức gà, cá hồi, đậu lăng, hạt diêm mạch, sữa whey.",
        "Suy gan": "Trái cây tươi, rau xanh, cá, gừng, nghệ.",
        "Thiếu máu cơ tim": "Cá béo, dầu ô liu, quả bơ, hạt lanh, các loại hạt.",
        "Tiểu đường": "Cháo yến mạch, rau xanh, cá hồi, các loại hạt.",
        "Béo phì": "Salad ức gà, khoai lang, các loại hạt ít calo.",
        "Gan nhiễm mỡ": "Rau củ, cá hồi, quả óc chó, dầu ô liu, trà xanh.",
        "Huyết áp cao": "Rau xanh, chuối, hạt lanh, cá béo, dầu ô liu.",
        "Cholesterol cao": "Quả bơ, hạt chia, cá hồi, quả hạch, yến mạch.",
        "Bệnh gout": "Cải xanh, súp lơ, cherry, sữa ít béo, nước ép dưa leo.",
        "Viêm khớp": "Cá hồi, hạt óc chó, dầu ô liu, nghệ, gừng.",
        "Đột quỵ": "Quả bơ, cá béo, rau xanh, hạt lanh, các loại hạt.",
        "Ung thư đại tràng": "Bông cải xanh, cà chua, quả mọng, ngũ cốc nguyên hạt.",
        "Chứng ngưng thở khi ngủ": "Cá hồi, dầu cá, cải bó xôi, gừng, nghệ.",
        "Loãng mạch máu": "Rau bina, quả mọng, cá béo, nghệ, tỏi.",
        "Viêm tụy": "Rau luộc, súp nhạt, ngũ cốc nguyên hạt, trà thảo mộc.",
        "Rối loạn lipid máu": "Yến mạch, cá hồi, quả óc chó, rau xanh.",
        "Bệnh tim mạch": "Cá béo, rau cải xanh, quả mọng, dầu ô liu.",
        "Hội chứng buồng trứng đa nang": "Cá béo, cải bó xôi, ngũ cốc nguyên hạt, dầu ô liu.",
        "Rối loạn chuyển hóa": "Trái cây ít đường, cá hồi, các loại hạt, bông cải xanh.",
        "Chứng đau lưng mãn tính": "Cá hồi, quả óc chó, nghệ, gừng, cải xoăn.",
        "Hội chứng ruột kích thích": "Chuối, yến mạch, trà bạc hà, cá trắng, gừng.",
        "Trào ngược dạ dày": "Bánh mì nguyên cám, gừng, chuối, sữa hạnh nhân.",
        "Bệnh Parkinson": "Cá béo, dầu cá, các loại hạt, rau xanh, nghệ."
    };
    return menus[condition] || "Thực đơn đang được cập nhật.";
  };

  const handleSubmit = () => {
    let result = `Nếu bạn đang bị ${selectedCondition}, với mức calo tiêu thụ như trên thì:\n`;

    if (conditions.calorie_deficit.includes(selectedCondition)) {
      result += "-> Bạn có thể cần tăng lượng calo nạp vào để cải thiện tình trạng sức khỏe.\n";
    } else if (conditions.calorie_surplus.includes(selectedCondition)) {
      result += "\n-> Bạn nên giảm lượng calo tiêu thụ để tránh các biến chứng nghiêm trọng.\n";
    }

    result += "Dưới đây là gợi ý thực đơn phù hợp cho bạn:\n";
    result += suggestMenu(selectedCondition);

    setFeedback(result);
  };

  const renderMealPlan = () => {
    const meals = suggestedMeals[goal] || [];
    const totalDailyCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    
    return (
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Thực đơn mẫu cho mục tiêu {goal === "gain" ? "tăng cân" : goal === "lose" ? "giảm cân" : "giữ cân"} 
          ({totalDailyCalories.toFixed(0)} calo/ngày)
        </Typography>
        
        <Grid container spacing={2}>
          {["Sáng", "Trưa", "Chiều", "Tối"].map((time, index) => {
            const meal = meals[index] || { name: "Chưa có gợi ý", calories: 0, protein: 0, fat: 0, carbs: 0, weight: 0 };
            return (
              <Grid item xs={12} sm={6} md={3} key={time}>
                <Card className="fade-in">
                  <CardContent>
                    <Typography variant="subtitle1" color="primary">{time}</Typography>
                    <Typography variant="h6">{meal.name}</Typography>
                    <Typography>Calo: {meal.calories}</Typography>
                    <Typography>Protein: {meal.protein}g</Typography>
                    <Typography>Chất béo: {meal.fat}g</Typography>
                    <Typography>Carbs: {meal.carbs}g</Typography>
                    <Typography>Khối lượng: {meal.weight}g</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        
        <Box mt={2}>
          <Typography variant="body1">
            <strong>Tổng lượng dinh dưỡng trong ngày:</strong>
          </Typography>
          <Typography>Calo: {totalDailyCalories.toFixed(0)}</Typography>
          <Typography>Protein: {meals.reduce((sum, m) => sum + m.protein, 0).toFixed(1)}g</Typography>
          <Typography>Chất béo: {meals.reduce((sum, m) => sum + m.fat, 0).toFixed(1)}g</Typography>
          <Typography>Carbs: {meals.reduce((sum, m) => sum + m.carbs, 0).toFixed(1)}g</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" style={{ fontWeight: "bold" }}>Trang cá nhân</Typography>
      </Box>

      {/* User Info */}
      {userInfo && (
        <TableContainer component={Paper} style={{ margin: "20px auto", maxWidth: "800px" }} className="fade-in">
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
                <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}><strong>Tên:</strong></TableCell>
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
                <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}><strong>Cân nặng:</strong></TableCell>
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

      {/* Two-panel layout for calorie tracking */}
      <Grid container spacing={3} className="fade-in">
        {/* Left panel - Current status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Thống kê calo hiện tại</Typography>
              
              <Typography variant="body1">
                <strong>Lượng calo tối thiểu mỗi ngày:</strong> {minCaloriesDay.toFixed(1)} calo
              </Typography>
              <Typography variant="body1">
                <strong>Lượng calo đã tiêu thụ hôm nay:</strong> {dailyCaloriesConsumed.toFixed(1)} calo
              </Typography>
              
              <Box mt={2}>
                <Typography variant="body1">
                  <strong>Tổng lượng calo đã tiêu thụ (tuần):</strong> {totalCalories.toFixed(1)} calo
                </Typography>
                <Typography variant="body1">
                  <strong>Lượng calo tối thiểu cần thiết trong tuần:</strong> {minCaloriesWeek.toFixed(1)} calo
                </Typography>
              </Box>
              
              <Box mt={2}>
                {totalCalories < minCaloriesWeek ? (
                  <Alert severity="warning">
                    Bạn tiêu thụ ít hơn mức calo tối thiểu cần thiết trong tuần. Hãy chú ý bổ sung thêm dinh dưỡng!
                  </Alert>
                ) : (
                  <Alert severity="success">
                    Bạn đã tiêu thụ đủ lượng calo tối thiểu trong tuần.
                  </Alert>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right panel - Goal setting */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Thiết lập mục tiêu</Typography>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Mục tiêu dinh dưỡng</InputLabel>
                <Select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  label="Mục tiêu dinh dưỡng"
                >
                  <MenuItem value="gain">Tăng cân</MenuItem>
                  <MenuItem value="lose">Giảm cân</MenuItem>
                  <MenuItem value="maintain">Giữ cân</MenuItem>
                </Select>
              </FormControl>
              
              {(goal === "gain" || goal === "lose") && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>
                    {goal === "gain" ? "Mong muốn tăng (kg/tuần)" : "Mong muốn giảm (kg/tuần)"}
                  </InputLabel>
                  <Select
                    value={targetWeightChange}
                    onChange={(e) => setTargetWeightChange(e.target.value)}
                    label={goal === "gain" ? "Mong muốn tăng (kg/tuần)" : "Mong muốn giảm (kg/tuần)"}
                  >
                    {[0.5, 1, 1.5, 2].map((value) => (
                      <MenuItem key={value} value={value}>{value} kg</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={calculateGoalCalories}
                style={{ marginTop: "16px" }}
              >
                Tính toán lượng calo mục tiêu
              </Button>
              
              {goalCalories > 0 && (
                <Box mt={2}>
                  <Typography variant="body1">
                    <strong>Lượng calo mục tiêu mỗi ngày:</strong> {goalCalories.toFixed(0)} calo
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      {weekData.length > 0 && (
        <Box mt={4} className="fade-in">
          <Typography variant="h6" gutterBottom>Biểu đồ calo tiêu thụ trong tuần</Typography>
          <Chart
            type="bar"
            series={[{ name: "Calo", data: weekData.map(item => item.CALORIES), color: "#FFA726" }]}
            height={350}
            options={{
              xaxis: { 
                categories: weekData.map(item => item.DAY), 
                title: { text: "Ngày" } 
              },
              yaxis: { title: { text: "Calo" } },
              chart: { toolbar: { show: false } },
              plotOptions: { bar: { borderRadius: 6, columnWidth: "50%" } },
              dataLabels: { enabled: false },
            }}
          />
        </Box>
      )}

      {/* Meal suggestions */}
      <Box mt={4} className="fade-in">
        <Typography variant="h5" gutterBottom>Gợi ý thực đơn</Typography>
        <Typography variant="body1" gutterBottom>
          Dựa trên lượng calo, thành phần dinh dưỡng bạn đã tiêu thụ và thể trạng của bạn, 
          chúng tôi đã lập gợi ý thực đơn cá nhân hóa cho riêng bạn, tùy thuộc vào lựa chọn của bạn...
        </Typography>
        
        {renderMealPlan()}
      </Box>

      {/* Health warnings */}
      <Box mt={4} className="fade-in">
        <Card style={{ backgroundColor: "#FFF3E0" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>Khuyến cáo sức khỏe</Typography>
            <Typography variant="body1">{getHealthWarnings()}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Disease condition selector */}
      <Box mt={4} className="fade-in">
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>Lựa chọn nhóm bệnh và nhận gợi ý thực đơn</Typography>
            
            <FormControl fullWidth margin="normal">
            <InputLabel>Chọn nhóm bệnh</InputLabel>
            <Select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              label="Chọn nhóm bệnh"
            >
              <MenuItem value="">-- Chọn một nhóm bệnh --</MenuItem>
              {Object.keys(conditions).map((category) =>
                conditions[category].map((condition, index) => (
                  <MenuItem key={`${category}-${index}`} value={condition}>
                    {condition}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSubmit}
              style={{ marginTop: "16px" }}
              disabled={!selectedCondition}
            >
              Xem nhận xét và thực đơn
            </Button>
            
            {feedback && (
              <Box mt={2} style={{ whiteSpace: "pre-wrap" }}>
                <Typography variant="h6">Kết quả</Typography>
                <Typography variant="body1">{feedback}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Footer */}
      <Box mt={4} pt={2} borderTop={1} borderColor="divider" className="fade-in">
        <Typography variant="body2" align="center">
          Bất cứ thông tin thắc mắc vui lòng liên hệ: 
          <a href="https://web.facebook.com/mochi.mocha.77377" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </Typography>
      </Box>

      {/* Chatbot link */}
      <Box mt={2} textAlign="center" className="fade-in">
        <a
          href="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/01/13/15/20250113155620-ZUX3U765.json"
          target="_blank"
          rel="noopener noreferrer"
          className="custom-link chatbot-link"
        >
          Có bất cứ thắc mắc nào, bạn hãy trao đổi với chat bot nhé!
        </a>
      </Box>

      {/* CSS for animations */}
      <style jsx>{`
      .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }
      .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `}</style>
        </div>
  );
};

export default UserInfo;
