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
  const [feedback, setFeedback] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

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
      return "Tuy nhiên, tôi cũng sẽ đưa ra khuyến cáo sức khỏe cho bạn với lượng calo trên: \nBạn tiêu thụ quá ít calo trong tuần, điều này có thể dẫn đến suy dinh dưỡng. \nLượng calo quá thấp sẽ không đủ để cơ thể tạo năng lượng cần thiết cho các hoạt động cơ bản như hô hấp, tuần hoàn, và vận động.\n Hãy kiểm tra lại chế độ ăn của mình, bổ sung các thực phẩm giàu dinh dưỡng như rau, protein, và ngũ cốc nguyên hạt để cải thiện năng lượng hàng ngày.\n Người bệnh thừa cân, béo phì phải đối mặt với nhiều nguy cơ sức khỏe như: bệnh tim, cao huyết áp, đột quỵ, viêm khớp, giảm khả năng sinh sản, gan nhiễm mỡ không do rượu, đái tháo đường type 2, hội chứng ngưng thở khi ngủ…\n -> Đặc biệt, béo phì được cho là có liên quan đến 13 loại ung thư, gồm: ung thư buồng trứng, ung thư gan, ung thư não, ung thư tuyến tụy…  \nNếu bạn đang có nhu cầu giảm cân, vui lòng hãy đọc khuyến cáo sức khỏe ở trên và chú ý phòng các bệnh tật liên quan để giữ cho mình sức khỏe tốt nhất.";
    } 
    // Kiểm tra xem lượng calo tiêu thụ có vượt quá 120% lượng calo tối thiểu không
    else if (totalCalories > minCaloriesWeek * 1.2) {
      // Giải thích chi tiết về tác hại của việc tiêu thụ quá nhiều calo
      return "Tuy nhiên, tôi cũng sẽ đưa ra khuyến cáo sức khỏe cho bạn với lượng calo trên: \nBạn tiêu thụ quá nhiều calo trong tuần, điều này có thể dẫn đến tăng cân và các bệnh mãn tính. \n Khi lượng calo nạp vào vượt quá mức cơ thể cần, năng lượng dư thừa sẽ chuyển hóa thành mỡ, tích tụ lâu ngày gây béo phì. \n -> Điều này làm tăng nguy cơ mắc các bệnh như tiểu đường, cao huyết áp, và tim mạch. \n -> Ngoài ra, mức năng lượng giảm cũng làm tăng giải phóng hormone cortisol, gây căng thẳng, ảnh hưởng khả năng tập trung… \n Thiếu calo khiến quá trình trao đổi chất của cơ thể chậm lại.\n -> Khi ăn quá ít hoặc không ăn, cơ thể sẽ suy yếu, rối loạn điện giải, rối loạn nhịp tim, yếu cơ, xương… \n -> Trường hợp suy dinh dưỡng nghiêm trọng có thể dẫn đến tổn thương nội tạng vĩnh viễn. \nHãy điều chỉnh chế độ ăn, giảm thực phẩm chứa nhiều đường và chất béo, tăng cường rau xanh và thực phẩm ít calo.";
    } 
    // Trường hợp lượng calo tiêu thụ nằm trong mức hợp lý
    else {
      // Giải thích về lợi ích của việc duy trì mức calo hợp lý
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
  
  // Hàm gợi ý thực đơn
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
      result += "-> Bạn nên giảm lượng calo tiêu thụ để tránh các biến chứng nghiêm trọng.\n";
    }

    result += "Dưới đây là gợi ý thực đơn phù hợp cho bạn:\n";
    result += suggestMenu(selectedCondition);

    setFeedback(result);
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
      <div>
      <h1>Lựa chọn nhóm bệnh và nhận gợi ý thực đơn</h1>

      <div>
        <label>Chọn nhóm bệnh:</label>
        <select value={selectedCondition} onChange={(e) => setSelectedCondition(e.target.value)}>
          <option value="">-- Chọn một nhóm bệnh --</option>
          {Object.keys(conditions).map((category) =>
            conditions[category].map((condition, index) => (
              <option key={`${category}-${index}`} value={condition}>
                {condition}
              </option>
            ))
          )}
        </select>
      </div>
      <button onClick={handleSubmit}>Xem nhận xét và thực đơn</button>
      {feedback && (
        <div>
          <h2>Kết quả</h2>
          <pre>{feedback}</pre>
        </div>
      )}
    </div>
    </div>
  );
};

export default UserInfo;

