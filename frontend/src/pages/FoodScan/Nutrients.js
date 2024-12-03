import React, { Fragment, useContext } from "react";
import Divider from "@mui/material/Divider";
import NoMealsIcon from "@mui/icons-material/NoMeals";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Alert from "@mui/material/Alert";
import { Box, Container } from "@mui/material";
import { API } from "../../services/apis";
import { useSnackbar } from "notistack";
import { AppContext } from "../../Context/AppContext";
import {
  foodSuggestions,
  getRandomSuggestions,
  workoutSuggestions,
} from "../../constants/hints";

const Nutrients = ({
  setisLoading,
  image_url,
  setscreen,
  imageBlob,
  nutrientsList,
  consumedFoodId,
}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { fetchTodaysConsumption, fetchWeekData } = useContext(AppContext);
  const calories =
    nutrientsList.find((nutri) => nutri.title === "Calorie")?.value || 0;

  const handleInTake = async () => {
    setisLoading(true);
    try {
      await API.intakeFood({
        consumed_food_id: consumedFoodId,
      });
      setisLoading(false);
      navigate("/dashboard");
      fetchTodaysConsumption();
      fetchWeekData();
    } catch (err) {
      setisLoading(false);
      if (err?.response?.data?.msg) {
        enqueueSnackbar(err.response.data.msg, { variant: "error" });
      } else {
        enqueueSnackbar("Đã có lỗi xảy ra", { variant: "error" });
      }
    }
  };
  const handleCancelIntake = () => {
    navigate("/dashboard");
  };
  const getNutrientTitle = (title) => {
    switch (title) {
      case "Calorie":
        return "Năng lượng";
      case "Carbohydrates":
        return "Tinh bột";
      case "Proteins":
        return "Đạm";
      case "Iron":
        return "Sắt";
      case "Cholesterol":
        return "Cholesterol";
      case "Fiber":
        return "Chất xơ";
      case "Calcium":
        return "Canxi";
      case "Fat":
        return "Chất béo";
      default:
        return title;
    }
  };

  const foodLevel =
    calories < 400
      ? "low"
      : calories >= 400 && calories <= 600
      ? "medium"
      : "high";
  const workoutLevel =
    calories < 400
      ? "low"
      : calories >= 400 && calories <= 600
      ? "medium"
      : "high";

  const foodSuggestionsList = getRandomSuggestions(foodSuggestions, foodLevel);
  const workoutSuggestionsList = getRandomSuggestions(
    workoutSuggestions,
    workoutLevel
  );

  return (
    <Container maxWidth="md">
      <div style={{ paddingBottom: "5rem", paddingTop: "1rem" }}>
        <button
          style={{
            display: "inline-block",
            background: "var(--backgroundColor)",
            border: "0",
            margin: "10px 0 0 10px",
          }}
          onClick={(e) => {
            setscreen(false);
          }}
        >
          {" "}
          <KeyboardBackspaceIcon sx={{ fontSize: "35px" }} />
        </button>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            style={{
              objectFit: "cover",
              display: "block",
              margin: "0 0.5rem",
              borderRadius: "5px",
              width: "90%",
              height: "20rem",
            }}
            src={imageBlob}
            alt=""
          ></img>
        </Box>
        <div
          style={{
            width: "9rem",
            height: "9rem",
            background: "#F1A661",
            borderRadius: "100%",
            boxShadow:
              "0 4px 4px 0 rgba(0, 0, 0, 0.1), 0 6px 10px 0 rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: "2.2rem",
                color: "var(--onOrange)",
              }}
            >
              {Number(calories).toFixed(2)}
            </div>
            <span
              style={{
                fontSize: "18px",
                color: "var(--onOrange)",
              }}
            >
              năng lượng
            </span>
          </div>
        </div>

        <div style={{ width: "85%", margin: "10px auto" }}>
          {calories < 400 ? (
            <Alert variant="outlined" severity="warning">
              Thiếu calo. Cần ăn thêm (Bỏ qua nếu không phải bữa ăn)
            </Alert>
          ) : calories >= 400 && calories <= 600 ? (
            <Alert variant="outlined" severity="success">
              Đủ calo. Chúc bạn ngon miệng
            </Alert>
          ) : (
            <Alert variant="outlined" severity="error">
              Quá nhiều calo. Tránh ăn thêm
            </Alert>
          )}
        </div>

        <div style={{ width: "85%", margin: "10px auto" }}>
          <h4>Gợi ý đồ ăn:</h4>
          <ul>
            {foodSuggestionsList.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>

        <div style={{ width: "85%", margin: "10px auto" }}>
          <h4>Chế độ tập luyện:</h4>
          <ul>
            {workoutSuggestionsList.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>

        <div style={{}}>
          {nutrientsList
            .filter((nutri) => nutri.title !== "Calorie")
            .map((nutrient, idx, arr) => {
              return (
                <Fragment key={nutrient.attri_id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "0 1.5rem",
                    }}
                  >
                    <h4>{getNutrientTitle(nutrient.title)}</h4>
                    <span>
                      {Number(nutrient.value).toFixed(2)} {nutrient.units}
                    </span>
                  </div>
                  {idx !== arr.length - 1 && <Divider />}
                </Fragment>
              );
            })}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              position: "fixed",
              bottom: 0,
              background: "#fff",
              width: "100%",
            }}
          >
            <button
              onClick={handleCancelIntake}
              style={{
                borderRadius: "6px",
                fontSize: "20px",
                padding: "10px 24px",
                background: "var(--onOrange)",
                border: "1px solid var(--themecolor)",
                margin: "20px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <NoMealsIcon />
              <span style={{ marginLeft: "8px" }}>Hủy</span>
            </button>
            <button
              onClick={handleInTake}
              style={{
                borderRadius: "6px",
                fontSize: "20px",
                padding: "10px 24px",
                background: "var(--themecolor)",
                border: "1px solid var(--themecolor)",
                color: "#fff",
                margin: "20px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <RestaurantIcon /> <span style={{ marginLeft: "8px" }}>Ăn</span>
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Nutrients;
