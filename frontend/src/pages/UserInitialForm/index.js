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
  const [selectedActivity, setSelectedActivity] = useState("1.2");
  const activityLevels = {
  "1.2": {
    name: "Ít hoặc không vận động",
    description: "Ngồi nhiều, không đi lại trong ngày",
    examples: [
      "Lập trình viên / IT",
      "Kế toán",
      "Nhân viên văn phòng",
      "Sinh viên/học sinh ngồi học cả ngày",
      "Nhân viên tư vấn qua điện thoại",
      "Biên dịch viên",
      "Luật sư (làm tại văn phòng)"
    ],
    color: "#4CAF50" // Màu xanh lá
  },
  "1.375": {
    name: "Hoạt động nhẹ",
    description: "Đi lại trong nội bộ, làm việc đứng nhiều",
    examples: [
      "Giáo viên",
      "Bác sĩ/y tá trong bệnh viện",
      "Nhân viên phục vụ nhà hàng",
      "Nhân viên bán hàng siêu thị",
      "Nhân viên thư viện", 
      "Nhân viên lễ tân"
    ],
    color: "#FFC107" // Màu vàng
  },
  "1.55": {
    name: "Vừa phải",
    description: "Lao động có vận động tay chân, đi lại ngoài trời",
    examples: [
      "Nhân viên giao hàng (xe máy)",
      "Bưu tá",
      "Thợ điện, sửa xe",
      "Nhân viên làm vườn",
      "Nhân viên vệ sinh tòa nhà",
      "Công nhân dây chuyền lắp ráp nhẹ"

    ],
    color: "#FF9800" // Màu cam
  },
  "1.725": {
    name: "Hoạt động cao",
    description: "Công việc thể lực nặng, dùng tay chân liên tục",
    examples: [
      "Nông dân làm ruộng, vườn",
      "Công nhân xây dựng",
      "Phụ hồ",
      "Nhân viên giao hàng bằng xe đạp",
      "Nhân viên chặt cây, khai thác rừng",
      "Hướng dẫn viên du lịch trekking"
    ],
    color: "#F44336" // Màu đỏ
  },
  "1.9": {
    name: "Rất cao",
    description: "Thể lực cực cao, tập luyện/di chuyển liên tục",
    examples: [
      "Vận động viên chuyên nghiệp",
      "Lính cứu hỏa",
      "Người leo núi chuyên nghiệp",
      "Huấn luyện viên thể hình",
      "Lính đặc nhiệm",
      "Lính biên phòng tuần tra rừng"
    ],
    color: "#9C27B0" // Màu tím
  }
};
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
                  onChange={(e) => {
                    setstate({ ...state, activity: e.target.value });
                    setSelectedActivity(e.target.value);
                  }}
                  className="text-field"
                >
                  {Object.entries(activityLevels).map(([value, level]) => (
                    <option key={value} value={value}>
                      {level.name} (x{value})
                    </option>
                  ))}
                </select>

                {selectedActivity && (
                  <div className="activity-details" style={{ 
                    marginTop: "10px",
                    padding: "15px",
                    borderRadius: "8px",
                    backgroundColor: "#f5f5f5",
                    borderLeft: `4px solid ${activityLevels[selectedActivity].color}`
                  }}>
                    <div style={{ 
                      fontWeight: "bold",
                      color: activityLevels[selectedActivity].color,
                      marginBottom: "5px"
                    }}>
                      {activityLevels[selectedActivity].name} (Hệ số: {selectedActivity})
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      {activityLevels[selectedActivity].description}
                    </div>
                    <div>
                      <strong>Ví dụ:</strong>
                      <ul style={{ 
                        marginTop: "5px",
                        paddingLeft: "20px",
                        marginBottom: "0"
                      }}>
                        {activityLevels[selectedActivity].examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                </form>
                </div>
                </Box>
                </Container>
                </div>
  )};


export default UserInitialForm;
