import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Alert, Grid, styled, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import FoodCard from "../../Components/FoodCard";
import BottomNavBar from "../../Components/BottomNavBar";
import { API } from "../../services/apis";
import { useSnackbar } from "notistack";
import { formatAMPM } from "../../utils/utils";
import { FullPageLoading } from "../../Components/LoadingSpinner";
import { AppContext } from "../../Context/AppContext";
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { motion } from "framer-motion";

const tourMotion = {
  offscreen: {
    x: -300,
  },
  onscreen: {
    x: 0,
    scale: 1,

    transition: {
      type: "spring",
      duration: 1,
    },
  },
};

const ProtienLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 900],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#DA0037",
  },
}));
const FiberLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 900],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#3CCF4E",
  },
}));
const CarbsLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 900],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#876445",
  },
}));
const FatsLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 900],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#8758FF",
  },
}));

const MAX_CALORIES = 2000;
function calorieProgressColor({ value, seriesIndex, w }) {
  if (value < 35) {
    return "#42855B";
  } else if (value >= 35 && value < 50) {
    return "#FFE162";
  } else if (value >= 50 && value < 80) {
    return "#F76E11";
  } else {
    return "#B20600";
  }
}
const Dashboard = () => {
  const { nutrients, setnutrients, todayFoodItems } = useContext(AppContext);
  const [tourRun, settourRun] = useState(false);
  const { isLoading, isTourTaken, setisTourTaken } = useContext(AppContext);
  const todaysCaloriesPercent =
    nutrients.calorie > MAX_CALORIES
      ? 100
      : (nutrients.calorie / MAX_CALORIES) * 100;
  const CALORIES = parseInt(Number(nutrients.calorie));

  const steps = [
    {
      target: ".calorieBar",
      content: "Kiểm tra lượng calo hôm nay của bạn qua thanh tiến trình này",
      disableBeacon: true,
    },
    {
      target: ".nutrientBars",
      content:
        "Biết rõ lượng chất dinh dưỡng bạn đã tiêu thụ và giữ trong giới hạn",
      disableBeacon: true,
    },
    {
      target: ".todaysFood",
      content: "Xem những món ăn bạn đã dùng hôm nay",
      disableBeacon: true,
    },
    {
      target: "#reports",
      content:
        "Xem và phân tích thực phẩm, lượng calo tiêu thụ của bạn trong tuần qua",
      disableBeacon: true,
    },
    {
      target: "#scan",
      content: "Quét thực phẩm của bạn, biết thông tin và thêm vào nhật ký",
      disableBeacon: true,
    },
    {
      target: "#blogs",
      content:
        "Học cách sống lành mạnh, theo dõi các kế hoạch bữa ăn từ chuyên gia",
      disableBeacon: true,
    },
  ];

  const handleTour = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      settourRun(false);
    }
  };
  const getSuggestions = (nutrient, current, max) => {
    if (current < max) {
      const remaining = max - current;
      return {
        status: "Thiếu",
        message: `Bạn cần bổ sung ${remaining.toFixed(1)}g ${nutrient} nữa.`,
      };
    } else if (current > max) {
      const excess = current - max;
      return {
        status: "Thừa",
        message: `Bạn đã thừa ${excess.toFixed(1)}g ${nutrient}. Hãy giảm thiểu lượng ${nutrient} tiêu thụ.`,
      };
    }
    return {
      status: "Đủ",
      message: `Bạn đã tiêu thụ đủ ${nutrient}. Hãy duy trì chế độ này.`,
    };
  };
    
  const foodSuggestions = [
    { name: "Ức gà", protien: 25, carbs: 0, fats: 2, calcium: 15, calories: 120 },
    { name: "Cá hồi", protien: 22, carbs: 0, fats: 12, calcium: 20, calories: 200 },
    { name: "Sữa chua", protien: 10, carbs: 15, fats: 5, calcium: 150, calories: 100 },
    { name: "Trứng gà", protien: 6, carbs: 1, fats: 5, calcium: 30, calories: 70 },
    { name: "Bông cải xanh", protien: 3, carbs: 7, fats: 0, calcium: 47, calories: 35 },
    { name: "Chuối", protien: 1, carbs: 27, fats: 0, calcium: 5, calories: 105 },
    { name: "Táo", protien: 0.5, carbs: 25, fats: 0, calcium: 6, calories: 95 },
    { name: "Cá ngừ", protien: 20, carbs: 0, fats: 1, calcium: 15, calories: 90 },
    { name: "Hạnh nhân", protien: 6, carbs: 6, fats: 14, calcium: 76, calories: 160 },
    { name: "Đậu hũ", protien: 8, carbs: 2, fats: 4, calcium: 350, calories: 70 },
    { name: "Khoai lang", protien: 2, carbs: 24, fats: 0, calcium: 30, calories: 100 },
    { name: "Bơ", protien: 2, carbs: 9, fats: 15, calcium: 10, calories: 160 },
    { name: "Sữa bò", protien: 8, carbs: 12, fats: 8, calcium: 300, calories: 150 },
    { name: "Yến mạch", protien: 5, carbs: 27, fats: 3, calcium: 52, calories: 150 },
    { name: "Rau chân vịt", protien: 3, carbs: 4, fats: 0, calcium: 99, calories: 23 },
    { name: "Thịt bò nạc", protien: 26, carbs: 0, fats: 7, calcium: 20, calories: 190 },
    { name: "Tôm", protien: 20, carbs: 1, fats: 0.5, calcium: 70, calories: 85 },
    { name: "Phô mai", protien: 7, carbs: 1, fats: 9, calcium: 200, calories: 110 },
    { name: "Cam", protien: 1, carbs: 21, fats: 0, calcium: 40, calories: 80 },
    { name: "Mật ong", protien: 0, carbs: 17, fats: 0, calcium: 2, calories: 64 },
    { name: "Hạt chia", protien: 4, carbs: 12, fats: 9, calcium: 177, calories: 120 },
    { name: "Nấm", protien: 3, carbs: 3, fats: 0, calcium: 2, calories: 22 },
    { name: "Dưa hấu", protien: 1, carbs: 11, fats: 0, calcium: 10, calories: 46 },
    { name: "Quả óc chó", protien: 4, carbs: 4, fats: 18, calcium: 20, calories: 185 },
    { name: "Hạt điều", protien: 5, carbs: 9, fats: 13, calcium: 37, calories: 157 },
    { name: "Dâu tây", protien: 1, carbs: 11, fats: 0, calcium: 16, calories: 50 },
    { name: "Đậu đen", protien: 15, carbs: 41, fats: 0.5, calcium: 46, calories: 227 },
    { name: "Thịt gà quay", protien: 20, carbs: 0, fats: 8, calcium: 15, calories: 165 },
    { name: "Ngô", protien: 3, carbs: 19, fats: 1, calcium: 2, calories: 86 },
    { name: "Rau cải", protien: 2, carbs: 4, fats: 0, calcium: 50, calories: 20 },
  ];


    // Tương tự phần trên...
    const protienSuggestion = getSuggestions(
      "đạm",
      nutrients.protiens,
      nutrients.maxprotiens
    );
    const calciumSuggestion = getSuggestions(
      "canxi",
      nutrients.calcium,
      nutrients.maxcalcium
    );
    const carbsSuggestion = getSuggestions(
      "tinh bột",
      nutrients.carbs,
      nutrients.maxcarbs
    );
    const fatsSuggestion = getSuggestions(
      "chất béo",
      nutrients.fats,
      nutrients.maxfats
    );
    const getRandomFoods = (foodList, count) => {
      const shuffled = foodList.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };
    const randomFoods = getRandomFoods(foodSuggestions, 7);
  

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true }}
      style={{
        background: "var(--backgroundColor)",
        paddingBottom: "6rem",
      }}
    >
      <FullPageLoading isLoading={false} />
      <div
        style={{
          boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px 0px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            display: "inline-block",
            margin: "0 auto",
            padding: "0.8rem",
          }}
        >
          Bảng điều khiển
        </h1>
      </div>

      <motion.div
        variants={tourMotion}
        style={
          !isTourTaken && !isLoading
            ? {
                backgroundColor: "#fff",
                padding: "0.3rem",
                display: "inline-block",
                border: "0px solid var(--themecolor)",
                borderRadius: "10px",
                position: "absolute",
                zIndex: 100,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: "auto",
                width: "150px",
                height: "120px",
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6)",
              }
            : { display: "none" }
        }
      >
        {!isLoading && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "transparent",
                }}
                onClick={(e) => setisTourTaken(true)}
              >
                <CloseIcon />
              </button>
            </div>
            <div style={{ padding: "0 18px 10px 18px" }}>
              <div style={{ fontSize: "18px" }}>Hướng dẫn</div>

              <button
                style={{
                  padding: "4px 10px",
                  width: "100%",
                  borderRadius: "6px",
                  fontSize: "20px",
                  color: "white",
                  background: "var(--themecolor)",
                  border: "1px solid var(--themecolor)",
                  marginTop: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  settourRun(true);
                  setisTourTaken(true);
                }}
              >
                <span style={{ marginRight: "5px" }}>Tiếp</span>{" "}
                <PlayCircleFilledIcon />
              </button>
            </div>
          </>
        )}
      </motion.div>

      <Joyride
        callback={handleTour}
        continuous
        showProgress
        showSkipButton
        disableScrolling={true}
        hideCloseButton
        steps={steps}
        scrollToFirstStep
        run={tourRun}
        spotlightClicks={false}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: "var(--themecolor)",
          },
        }}
        locale={{
          back: "Quay lại",
          close: "Đóng",
          last: "Hoàn tất",
          next: "Tiếp theo",
          skip: "Bỏ qua",
        }}
      />
      <div>
        <Chart
          className="calorieBar"
          type="radialBar"
          series={[todaysCaloriesPercent]}
          height={400}
          options={{
            labels: ["Năng lượng"],
            CALORIES: CALORIES,
            plotOptions: {
              radialBar: {
                hollow: {
                  margin: 0,
                  size: "70%",
                  background: "#F9F9F9",
                  boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.18), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                  dropShadow: {
                    enabled: true,
                    top: 0,
                    left: 0,
                    blur: 4,
                    opacity: 0.24,
                  },
                },
                track: {
                  background: "#fff",
                  dropShadow: {
                    enabled: true,
                    top: 2,
                    left: 0,
                    blur: 4,
                    opacity: 0.5,
                  },
                },
                dataLabels: {
                  name: {
                    color: calorieProgressColor({
                      value: todaysCaloriesPercent,
                    }),
                    fontSize: "1.5rem",
                    offsetY: 40,
                    fontWeight: 300,
                  },
                  value: {
                    color: calorieProgressColor({
                      value: todaysCaloriesPercent,
                    }),
                    fontSize: "4.5rem",
                    fontWeight: 700,
                    margin: "1rem",
                    offsetY: -10,
                    show: true,
                    formatter: (value) => {
                      return CALORIES;
                    },
                  },
                },
              },
            },
            fill: {
              colors: [calorieProgressColor],
            },
            stroke: {
              lineCap: "round",
            },
          }}
        ></Chart>
      </div>
      <Container maxWidth="sm">
        <Box
          className="nutrientBars"
          sx={{
            mx: "1rem",
            p: "1rem",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          }}
        >
          <div
            style={{
              marginBottom: "0.2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#DA0037",
                color: "red",
                width: "9px",
                height: "9px",
                borderRadius: "100%",
              }}
            ></div>
            <p style={{ marginLeft: "10px" }}>
              Đạm{" "}
              <span>
                [{nutrients.protiens}g / {nutrients.maxprotiens}
                g]
              </span>
            </p>
          </div>
          <ProtienLinearProgress
            variant="determinate"
            value={
              nutrients.protiens > nutrients.maxprotiens
                ? 100
                : (nutrients.protiens / nutrients.maxprotiens) * 100
            }
          />
          <div
            style={{
              marginTop: "0.7rem",
              marginBottom: "0.2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#3CCF4E",
                color: "red",
                width: "9px",
                height: "9px",
                borderRadius: "100%",
              }}
            ></div>
            <p style={{ marginLeft: "10px" }}>
              Canxi{" "}
              <span>
                [{nutrients.calcium}mg / {nutrients.maxcalcium}
                mg]
              </span>
            </p>
          </div>
          <FiberLinearProgress
            variant="determinate"
            value={
              nutrients.calcium > nutrients.maxcalcium
                ? 100
                : (nutrients.calcium / nutrients.maxcalcium) * 100
            }
          />
          <div
            style={{
              marginTop: "0.7rem",
              marginBottom: "0.2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#876445",
                color: "red",
                width: "9px",
                height: "9px",
                borderRadius: "100%",
              }}
            ></div>
            <p style={{ marginLeft: "10px" }}>
              Tinh bột{" "}
              <span>
                [{nutrients.carbs}g / {nutrients.maxcarbs}g]
              </span>
            </p>
          </div>
          <CarbsLinearProgress
            variant="determinate"
            value={
              nutrients.carbs > nutrients.maxcarbs
                ? 100
                : (nutrients.carbs / nutrients.maxcarbs) * 100
            }
          />
          <div
            style={{
              marginTop: "0.7rem",
              marginBottom: "0.2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#8758FF",
                color: "red",
                width: "9px",
                height: "9px",
                borderRadius: "100%",
              }}
            ></div>
            <p style={{ marginLeft: "10px" }}>
              Chất béo{" "}
              <span>
                [{nutrients.fats}g / {nutrients.maxfats}g]
              </span>
            </p>
          </div>
          <FatsLinearProgress
            variant="determinate"
            value={
              nutrients.fats > nutrients.maxfats
                ? 100
                : (nutrients.fats / nutrients.maxfats) * 100
            }
          />
        </Box>
        <div className="todaysFood">
          <h2 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>
            Thức ăn hôm nay
          </h2>
          {todayFoodItems.length === 0 && (
            <Alert severity="info">
              Không có món ăn nào được tiêu thụ hôm nay. Hãy bấm vào biểu tượng
              máy ảnh để ghi lại món ăn.
            </Alert>
          )}
          <Grid columnSpacing={"1rem"} container>
            {todayFoodItems.map((item, idx) => {
              return (
                <Grid key={idx} item sm={6} xs={12}>
                  <FoodCard
                    key={item.ID}
                    calories={item.CALORIE.toFixed(2)}
                    carbohydrates={item.CARBOHYDRATES.toFixed(2)}
                    fats={item.FAT.toFixed(2)}
                    image_url={item.IMAGE}
                    proteins={item.PROTEINS.toFixed(2)}
                    time={formatAMPM(new Date(item.CONSUMED_ON))}
                    calcium={item.CALCIUM.toFixed(2)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </div>
      </Container>
      <Container>
      {/* Phân tích thói quen ăn uống */}
      <Box>
        <Box
              sx={{
                border: "2px solidrgb(130, 194, 244)", // Màu xanh dương cây nhạt
                borderRadius: "5px",         // Bo góc
                padding: "16px",             // Khoảng cách bên trong
                margin: "16px 0",            // Khoảng cách bên ngoài
                backgroundColor: "#FFE4E1",  // Màu nền nhẹ

              }}
            >
              <Typography variant="h6" align="center" gutterBottom style={{ fontWeight: "bold", fontSize: "25px" }} >
                                    Phân tích hàm lượng dinh dưỡng, thói quen ăn uống <br />
                          </Typography>

    </Box >
          <table style={{ border: '1px solid #ccc', width: '100%', textAlign: 'center' }}>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ccc' }}>{protienSuggestion.message}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc' }}>{calciumSuggestion.message}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc' }}>{carbsSuggestion.message}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc' }}>{fatsSuggestion.message}</td>
          </tr>
        </tbody>
      </table>
      </Box>

      {/* Gợi ý món ăn */}
      <Box>
        <h2> </h2>
        <div style={{ textAlign: 'center', fontSize: "18px" }}>
          {/* Content for the center-aligned div */}
        </div>
        {protienSuggestion.status === "Thiếu" && (
          <div style={{ textAlign: 'center', fontSize: "19px" }}>
            <h3>
              <br />
              Gợi ý món ăn thêm vào bữa ăn của bạn tốt cho sức khỏe, đủ hàm lượng dinh dưỡng  :<br />
            </h3>
            <table style={{ margin: '10px auto', border: '1px solid black', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Tên món</th>
                  <th>Calo</th>
                  <th>Đạm (g)</th>
                  <th>Tinh bột (g)</th>
                  <th>Chất béo (g)</th>
                  <th>Canxi (mg)</th>
                </tr>
              </thead>
              <tbody>
                {randomFoods.map((food, idx) => (
                  <tr key={idx}>
                    <td>{food.name}</td>
                    <td>{food.calories}</td>
                    <td>{food.protien}</td>
                    <td>{food.carbs}</td>
                    <td>{food.fats}</td>
                    <td>{food.calcium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Box>
    </Container>

    </motion.div>
  );
};

export default Dashboard;
