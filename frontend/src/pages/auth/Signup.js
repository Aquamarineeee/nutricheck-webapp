import { Box } from "@mui/material";
import { Container } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { API } from "../../services/apis";
import { googleOauthPopup } from "../../services/firebase";
import "../../styles/auth.modules.css";

const Signup = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { fetchTodaysConsumption, setmaxCalories, fetchWeekData, setuserInfo } =
    useContext(AppContext);
  const [state, setstate] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  
  const [isLoading, setisLoading] = useState(false);

  const handleGoogleOauth = async () => {
    setisLoading(true);
    try {
      const accessToken = await googleOauthPopup();
      const res = await API.signInWithGoogle({ accessToken });
      localStorage.setItem("token", res.token);
      localStorage.setItem("userInfo", JSON.stringify(res.user));
      if (res.user.IS_LOGIN_PROCESS_COMPLETE) {
        setmaxCalories(res.maxCalories);
        setuserInfo(res.user);
        navigate("/dashboard");
        fetchTodaysConsumption();
        fetchWeekData();
      } else {
        navigate("/userInitialForm");
      }
    } catch (err) {
      enqueueSnackbar("Đã có lỗi xảy ra", { variant: "error" });
    }
    setisLoading(false);
  };
  const handleSignup = async () => {
    const currentDate = new Date();
  
    // Kiểm tra thông tin nhập liệu
    if (!state.username || !state.email || !state.password) {
      enqueueSnackbar("Vui lòng điền đầy đủ thông tin chi tiết", { variant: "error" });
      return;
    }
  
    if (state.password !== state.confirmPassword) {
      enqueueSnackbar("Mật khẩu không khớp. Vui lòng kiểm tra lại.", { variant: "error" });
      return;
    }
  
    // Regex kiểm tra độ mạnh của mật khẩu
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
    if (!passwordRegex.test(state.password)) {
      enqueueSnackbar(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 chữ số và 1 ký tự đặc biệt (!@#$%^&*()).",
        { variant: "error" }
      );
      return;
    }
  
    setisLoading(true);
  
    try {
      // Gửi yêu cầu đăng ký
      const res = await API.signup({
        email: state.email,
        password: state.password,
        username: state.username,
      });
  
      // Lưu thông tin và chuyển hướng
      localStorage.setItem("token", res.token);
      localStorage.setItem("userInfo", JSON.stringify(res.user));
      localStorage.setItem("registrationDate", currentDate.toISOString().split("T")[0]);
      navigate("/userInitialForm");
    } catch (err) {
      // Xử lý lỗi từ API
      if (err.response && err.response.status === 400) {
        enqueueSnackbar("Tài khoản đã tồn tại. Vui lòng thử email khác.", { variant: "error" });
      } else {
        enqueueSnackbar("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.", { variant: "error" });
      }
    } finally {
      setisLoading(false); // Dừng trạng thái tải
    }
  };
  
  
  return (
    <div className="auth-container">
      <img className="logo" src="/static/img/logo.png" alt="" />
      <Container maxWidth="sm" className="form-container">
        <Box className="form-box">
          <h1>Đăng ký</h1>
          <div className="form-content">
            <form>
              <label className="form-label">Tên người dùng</label>
              <input
                value={state.username}
                onChange={(e) =>
                  setstate((prevState) => ({
                    ...prevState,
                    username: e.target.value,
                  }))
                }
                className="text-field"
                type="text"
              />
              <label className="form-label">Email</label>
              <input
                value={state.email}
                onChange={(e) =>
                  setstate((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
                className="text-field"
                type="email"
              />
              <label className="form-label">Mật khẩu</label>
                <input
                  value={state.password}
                  onChange={(e) =>
                    setstate((prevState) => ({
                      ...prevState,
                      password: e.target.value,
                    }))
                  }
                  className="text-field"
                  type="password"
                />
                {passwordError && <p className="error-text">{passwordError}</p>}
              <label className="form-label">Xác nhận mật khẩu</label>
              <input
                value={state.confirmPassword}
                onChange={(e) =>
                  setstate((prevState) => ({
                    ...prevState,
                    confirmPassword: e.target.value,
                  }))
                }
                className="text-field"
                type="password"
              />
            </form>
            <button
              disabled={isLoading}
              onClick={handleSignup}
              className="btn"
              type="submit"
            >
              Đăng ký
            </button>
            <button
              disabled={isLoading}
              onClick={() => navigate("/signin")}
              className="switch-to-signup"
            >
              Đã có tài khoản? Đăng nhập
            </button>
          </div>
          <hr style={{ marginTop: "15px" }} />
          {/* <button
            disabled={isLoading}
            onClick={handleGoogleOauth}
            className="btn-google"
          >
            <img src="/static/img/google_icon.png" alt="google icon" />
            <span>Đăng nhập với Google</span>
          </button> */}
        </Box>
      </Container>
    </div>
  );
};

export default Signup;
