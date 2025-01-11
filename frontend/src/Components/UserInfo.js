import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Button, Alert } from "@mui/material";
import { AppContext } from "../Context/AppContext";

// Công thức tính BMR
const calculateBMR = (weight, height, age, gender) => {
    if (gender === "male") {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === "female") {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
    return 0;
};

// Tính lượng calo tiêu thụ tối thiểu trong 1 tuần
const calculateWeeklyCalories = (weight, height, age, gender, activityLevel) => {
    const bmr = calculateBMR(weight, height, age, gender);
    const activityFactors = {
        sedentary: 1.2,    // Ít vận động
        light: 1.375,      // Vận động nhẹ
        moderate: 1.55,    // Vận động vừa
        active: 1.725,     // Vận động nặng
        veryActive: 1.9,   // Vận động rất nặng
    };

    const dailyCalories = bmr * (activityFactors[activityLevel] || 1.2);
    const weeklyCalories = dailyCalories * 7;

    return {
        dailyCalories: dailyCalories.toFixed(2),
        weeklyCalories: weeklyCalories.toFixed(2),
        bmr: bmr.toFixed(2),
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
            <Container maxWidth="sm" sx={{ pb: 3, mt: 10 }}>
                <Box
                    sx={{
                        bgcolor: "white",
                        p: 4,
                        borderRadius: "16px",
                        boxShadow: 10,
                    }}
                >
                    <h1 style={{ textAlign: "center" }}>Tính Lượng Calo</h1>

                    {caloriesInfo ? (
                        <>
                            {/* Tổng lượng calo */}
                            <Alert severity="info" style={{ marginTop: "20px" }}>
                                <p>
                                    <b>Tổng lượng calo tiêu thụ trong tuần:</b>{" "}
                                    {caloriesInfo.weeklyCalories} calo
                                </p>
                                <p>
                                    <b>Lượng calo tối thiểu cần thiết trong tuần:</b>{" "}
                                    {(caloriesInfo.bmr * 7).toFixed(2)} calo
                                </p>
                                <p>
                                    Tỷ lệ:{" "}
                                    {(
                                        (caloriesInfo.weeklyCalories /
                                            (caloriesInfo.bmr * 7)) *
                                        100
                                    ).toFixed(2)}
                                    %
                                </p>
                            </Alert>

                            {/* Ví dụ minh họa */}
                            <Alert severity="success" style={{ marginTop: "20px" }}>
                                <b>Ví dụ:</b>
                                <p>
                                    Một phụ nữ cao 160cm, nặng 50kg, tuổi 25 có thể tính lượng calo tối thiểu như sau:
                                </p>
                                <ul>
                                    <li>BMR (công thức Mifflin-St Jeor):</li>
                                    <p>
                                        10 x 50 (kg) + 6.25 x 160 (cm) - 5 x 25 (tuổi) - 161 ={" "}
                                        {10 * 50 + 6.25 * 160 - 5 * 25 - 161} calo/ngày.
                                    </p>
                                    <li>
                                        Lượng calo tối thiểu trong tuần = BMR x 7 ={" "}
                                        {(10 * 50 + 6.25 * 160 - 5 * 25 - 161) * 7} calo.
                                    </li>
                                </ul>
                            </Alert>
                        </>
                    ) : (
                        <Alert severity="error" style={{ marginTop: "20px" }}>
                            Không thể tính toán lượng calo do thiếu thông tin người dùng!
                        </Alert>
                    )}

                    {/* Nút đăng xuất */}
                    <div
                        style={{
                            paddingTop: "2rem",
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
