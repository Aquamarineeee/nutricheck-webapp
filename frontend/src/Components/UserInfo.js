import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Button, Alert } from "@mui/material";
import { AppContext } from "../../Context/AppContext";
import styles from "../../styles/blog.module.css";

// Hàm tính lượng calo hàng ngày và hàng tuần
const calculateWeeklyCalories = (weight, height, age, gender, activityLevel) => {
    let BMR = 0;

    // Tính BMR theo Mifflin-St Jeor Equation
    if (gender === "male") {
        BMR = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === "female") {
        BMR = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Hệ số hoạt động
    const activityFactors = {
        sedentary: 1.2,    // Ít vận động
        light: 1.375,      // Vận động nhẹ
        moderate: 1.55,    // Vận động vừa
        active: 1.725,     // Vận động nặng
        veryActive: 1.9,   // Vận động rất nặng
    };

    const dailyCalories = BMR * (activityFactors[activityLevel] || 1.2);
    const weeklyCalories = dailyCalories * 7;

    return {
        dailyCalories: dailyCalories.toFixed(2),
        weeklyCalories: weeklyCalories.toFixed(2),
    };
};

const UserInfo = () => {
    const { userInfo, handleLogout } = useContext(AppContext);

    // Lấy thông tin người dùng
    const { weight, height, age, gender, activity } = userInfo || {};

    // Tính toán lượng calo
    const caloriesInfo = weight && height && age && gender && activity
        ? calculateWeeklyCalories(weight, height, age, gender, activity)
        : null;

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "var(--backgroundColor)",
                paddingBottom: "5rem",
            }}
        >
            <div
                style={{
                    backgroundColor: "var(--backgroundColor)",
                    boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px 0px",
                    display: "flex",
                    justifyContent: "start",
                }}
            >
                <h1
                    style={{
                        display: "inline-block",
                        margin: "0 auto",
                        padding: "0.8rem",
                    }}
                >
                    Hồ sơ
                </h1>
            </div>
            <Container maxWidth="sm" sx={{ pb: 3, mt: 10 }}>
                <Box
                    sx={{
                        bgcolor: "white",
                        p: 4,
                        borderRadius: "16px",
                        boxShadow: 10,
                    }}
                >
                    {/* Thông tin cá nhân */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "start",
                            alignItems: "start",
                        }}
                    >
                        <div>
                            <img
                                src="https://avatar.iran.liara.run/public/boy"
                                alt="avatar"
                                style={{ borderRadius: "50%", objectFit: "contain" }}
                                className={styles.Img}
                            />
                        </div>
                        <div>
                            <h3>{userInfo?.USERNAME || "Tên người dùng"}</h3>
                            <p>{userInfo?.EMAIL || "Email không xác định"}</p>
                        </div>
                    </div>

                    {/* Thông tin thêm */}
                    <div className={styles.detailsCon}>
                        <h3>Tuổi</h3>
                        <p>{userInfo?.AGE || "Không rõ"} Tuổi</p>
                    </div>
                    <div className={styles.detailsCon}>
                        <h3>Giới tính</h3>
                        <p>{userInfo?.GENDER === "female" ? "Nữ" : userInfo?.GENDER === "male" ? "Nam" : "Không rõ"}</p>
                    </div>
                    <div className={styles.detailsCon}>
                        <h3>Chiều cao</h3>
                        <p>{userInfo?.HEIGHT || "Không rõ"} cm</p>
                    </div>
                    <div className={styles.detailsCon}>
                        <h3>Cân nặng</h3>
                        <p>{userInfo?.WEIGHT || "Không rõ"} kg</p>
                    </div>

                    {/* Lượng calo tính toán */}
                    {caloriesInfo ? (
                        <Alert severity="info" style={{ marginTop: "20px" }}>
                            <p>
                                <b>Lượng calo cần thiết hàng ngày:</b> {caloriesInfo.dailyCalories} calo
                            </p>
                            <p>
                                <b>Lượng calo cần thiết hàng tuần:</b> {caloriesInfo.weeklyCalories} calo
                            </p>
                        </Alert>
                    ) : (
                        <Alert severity="error" style={{ marginTop: "20px" }}>
                            Không thể tính lượng calo do thiếu thông tin!
                        </Alert>
                    )}

                    {/* Nút đăng xuất */}
                    <div
                        style={{
                            paddingTop: "5rem",
                            paddingLeft: "5rem",
                            paddingRight: "5rem",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Button onClick={handleLogout} variant="contained" color="info">
                            Đăng xuất
                        </Button>
                    </div>
                </Box>
            </Container>
        </div>
    );
};

export default UserInfo;
