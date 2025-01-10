import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import { useSnackbar } from "notistack";
import { AppContext } from "../../Context/AppContext";
import "../../styles/auth.modules.css";
import { API } from "../../services/apis";

const UserSignup = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo, setuserInfo, setmaxCalories, fetchTodaysConsumption, fetchWeekData } =
    useContext(AppContext);

  const [isLoading, setisLoading] = useState(false);

  // Khởi tạo state với dữ liệu từ userInfo (hoặc giá trị mặc định nếu không có)
  const [state, setstate] = useState({
    age: userInfo.AGE || "",  // Dữ liệu từ userInfo hoặc chuỗi rỗng nếu không có
    gender: userInfo.GENDER || "female",  // Dữ liệu từ userInfo hoặc giá trị mặc định
    weight: userInfo.WEIGHT || "",  // Dữ liệu từ userInfo hoặc chuỗi rỗng
    height: userInfo.HEIGHT || "",  // Dữ liệu từ userInfo hoặc chuỗi rỗng
    activity: userInfo.ACTIVITY || "1.2",  // Dữ liệu từ userInfo hoặc giá trị mặc định
  });

  // Cập nhật state khi userInfo thay đổi
  useEffect(() => {
      setstate({
        age: userInfo.AGE || "",
        gender: userInfo.GENDER || "female",
        weight: userInfo.WEIGHT || "",
        height: userInfo.HEIGHT || "",
        activity: userInfo.ACTIVITY || "1.2",
      });
  }, [userInfo]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // Xử lý submit thông tin
  const handleSubmit = async () => {
      setisLoading(true);
      const res = await API.userAdditionInfo(state);
      localStorage.setItem("userInfo", JSON.stringify(res.userInfo));
      setuserInfo(res.userInfo);
      setmaxCalories(res.maxCalories);
      fetchTodaysConsumption();
      fetchWeekData();
      navigate("/dashboard");
   
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
          <h1 className="form-title"> Nhập lại thông tin</h1>
          <div className="form-content">
            <form>
              <label className="form-label">Tuổi</label>
              <input
                value={state.age}  // Tự động điền giá trị từ state
                onChange={(e) => setstate({ ...state, age: e.target.value })}
                className="text-field"
                placeholder="vd. 25"
                type="number"
              />
              <label className="form-label">Cân nặng</label>
              <input
                value={state.weight}  // Tự động điền giá trị từ state
                onChange={(e) => setstate({ ...state, weight: e.target.value })}
                className="text-field"
                placeholder="vd. 80"
                type="number"
              />
              <label className="form-label">Chiều cao</label>
              <input
                value={state.height}  // Tự động điền giá trị từ state
                onChange={(e) => setstate({ ...state, height: e.target.value })}
                className="text-field"
                placeholder="vd. 180"
                type="number"
              />
              <label className="form-label">Mức độ hoạt động</label>
              <select
                value={state.activity}  // Tự động điền giá trị từ state
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

export default UserSignup;
