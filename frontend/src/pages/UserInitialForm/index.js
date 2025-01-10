import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import { Box } from "@mui/material";
import { Container } from "@mui/system";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.modules.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { API } from "../../services/apis";
import { useSnackbar } from "notistack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { AppContext } from "../../Context/AppContext";

const UserInitialForm = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setuserInfo, setmaxCalories, fetchTodaysConsumption, fetchWeekData } =
    useContext(AppContext);
  const [isLoading, setisLoading] = useState(false);
  const [state, setstate] = useState({
    age: "",
    gender: "female",
    weight: "",
    height: "",
    activity: "1.2",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSubmit = async () => {
    if (
      !state.age ||
      !state.gender ||
      !state.weight ||
      !state.height ||
      !state.activity
    ) {
      enqueueSnackbar("Vui lòng điền đầy đủ thông tin", { variant: "error" });
      return;
    }

    try {
      setisLoading(true);
      const res = await API.userAdditionInfo(state);
      localStorage.setItem("userInfo", JSON.stringify(res.userInfo));
      setuserInfo(res.userInfo);
      setmaxCalories(res.maxCalories);
      fetchTodaysConsumption();
      fetchWeekData();
      navigate("/dashboard");
    } catch (err) {
      setisLoading(false);
      enqueueSnackbar("Đã có lỗi xảy ra", { variant: "error" });
    }
  };

  return (
    <div className="auth-container">
      <button className="logout-button" onClick={handleLogout}>
        <span className="logout-text">Đăng xuất</span>
        <LogoutIcon />
      </button>
      <img className="logo" src="/static/img/logo.png" alt="Logo" />
      <Container maxWidth="sm" className="form-container">
        <Box className="form-box">
          <h1 className="form-title">Chỉ một bước cuối cùng</h1>
          <div className="form-content">
            <form>
              <label className="form-label">Tuổi</label>
              <input
                value={state.age}
                onChange={(e) => setstate({ ...state, age: e.target.value })}
                className="text-field"
                placeholder="vd. 25"
                type="number"
              />
              <FormControl>
                <label className="form-label">Giới tính</label>
                <RadioGroup
                  value={state.gender}
                  onChange={(e) =>
                    setstate({ ...state, gender: e.target.value })
                  }
                  row
                  name="gender-radio-group"
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Nữ"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Khác"
                  />
                </RadioGroup>
              </FormControl>
              <label className="form-label">Cân nặng</label>
              <input
                value={state.weight}
                onChange={(e) => setstate({ ...state, weight: e.target.value })}
                className="text-field"
                placeholder="vd. 80"
                type="number"
              />
              <label className="form-label">Chiều cao</label>
              <input
                value={state.height}
                onChange={(e) => setstate({ ...state, height: e.target.value })}
                className="text-field"
                placeholder="vd. 180"
                type="number"
              />
              <label className="form-label">Mức độ hoạt động</label>
              <select
                value={state.activity}
                onChange={(e) =>
                  setstate({ ...state, activity: e.target.value })
                }
                className="text-field"
              >
                <option value={1.2}>Ít hoặc không vận động</option>
                <option value={1.375}>
                  Nhẹ: Tập thể dục 1-3 ngày mỗi tuần
                </option>
                <option value={1.55}>
                  Vừa phải: Tập thể dục 4-5 lần mỗi tuần
                </option>
                <option value={1.725}>Tích cực: Tập thể dục hàng ngày</option>
                <option value={1.9}>
                  Rất tích cực: Tập thể dục mạnh mỗi ngày
                </option>
              </select>
              <button
                disabled={isLoading}
                className="submit-button"
                type="button"
                onClick={handleSubmit}
              >
                <span>Hoàn thành</span>
                <ArrowForwardIos />
              </button>
            </form>
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default UserInitialForm;
