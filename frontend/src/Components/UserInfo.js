import React, { useEffect, useState, useCallback, useContext } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Paper, Alert, Box, Grid, Card, CardContent,
    Button, Select, MenuItem, InputLabel, FormControl, Divider, TextField,
    Checkbox, ListItemText, Switch, FormControlLabel, Autocomplete, Chip, IconButton, List, ListItem // <-- Đảm bảo có Autocomplete và Chip
} from "@mui/material";
import { keyframes, styled } from "@mui/system";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import helo from "../../src/images/helo.gif"
import gainMealsData from "./gainMeals.json";
import maintainMealsData from "./maintainMeals.json"; 
import loseMealsData from "./loseMeals.json";     
import OutlinedInput from '@mui/material/OutlinedInput'; 
import exerciseData from './exerciseData.json'; 
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SleepAidCard from './SleepAidCard';
import sleepAidData from './sleepAidData.json'
import { calculateBMR, calculateTDEE } from "./helthCal";



const floatAnimation = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
`;

// Dữ liệu thực đơn chuyển vào JSON riêng
const mealData = {
    gain: gainMealsData,
    lose: loseMealsData,
    maintain:maintainMealsData
};
const activityFactor = {
    sedentary: 1.2, // Không vận động
    light: 1.375, // Vận động nhẹ
    moderate: 1.55, // Vận động trung bình
    active: 1.725, // Vận động cao
    very_active: 1.9, // Vận động rất cao
};



const UserInfo = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { userInfo, weekData, fetchWeekData, setUserInfo} = useContext(AppContext);
    const [totalCalories, setTotalCalories] = useState(0);
    const [dailyCaloriesConsumed, setDailyCaloriesConsumed] = useState(0);
    const [minCaloriesDay, setMinCaloriesDay] = useState(0);
    const [minCaloriesWeek, setMinCaloriesWeek] = useState(0);
    const [minCaloriesMonth, setMinCaloriesMonth] = useState(0);
    const [totalMonthlyCalories, setTotalMonthlyCalories] = useState(0);
    const [suggestedMeals, setSuggestedMeals] = useState({ gain: [], lose: [], maintain: [] });
    const [feedback, setFeedback] = useState("");
    const [goal, setGoal] = useState("maintain");
    const [targetWeightChange, setTargetWeightChange] = useState(0);
    const [goalCalories, setGoalCalories] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [meals, setMeals] = useState([]);
    const [totalDailyCalories, setTotalDailyCalories] = useState(0);
    const [weightChangeError, setWeightChangeError] = useState("");
    const [mealGlobalCounts, setMealGlobalCounts] = useState({});
    const [preferredContinent, setPreferredContinent] = useState("");
    const [minPrice, setMinPrice] = useState(15000);
    const [maxPrice, setMaxPrice] = useState(100000);
    const [minPricePerMeal, setMinPricePerMeal] = useState(0); // Chi phí tối thiểu mỗi bữa
    const [maxPricePerMeal, setMaxPricePerMeal] = useState(1000000); // Chi phí tối đa mỗi bữa (1,000,000 VND)
    const [priceError, setPriceError] = useState(""); // Để hiển thị lỗi nếu có
    const [preferredContinents, setPreferredContinents] = useState([]); // Ví dụ: ["Châu Á", "Châu Âu"]
    const [selectedConditions, setSelectedConditions] = useState([]); // Đổi tên và kiểu dữ liệu
    const [planGenerationCount, setPlanGenerationCount] = useState(0); // Đếm số lần tạo thực đơn
    const [averageSleepHours, setAverageSleepHours] = useState("");
    const [dailyWaterIntake, setDailyWaterIntake] = useState("");
    const [exerciseSuggestions, setExerciseSuggestions] =useState("");
    // State mới cho gợi ý giấc ngủ
    const [selectedSleepConditions, setSelectedSleepConditions] = useState([]);
    const [selectedSleepHerbs, setSelectedSleepHerbs] = useState([]);
    const [suggestionsList, setSuggestionsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [showSleepAid, setShowSleepAid] = useState(false);
    const [showBMI, setShowBMI] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editedUserInfo, setEditedUserInfo] = useState({});
    const [totalMealPrice, setTotalMealPrice] = useState(0);
    const [bmr, setBmr] = useState(0);
    const [tdee, setTdee] = useState(0);
    

    // Hàm chọn món ăn dựa trên calo mục tiêu (thuật toán tham lam)
    const floatAnimation = keyframes`
        0% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px); /* Nhấp nhô lên 10px */
        }
        100% {
            transform: translateY(0px);
        }
        `;
    const handleEditToggle = () => {
        setEditing(!editing);
        if (editing) {
            // Khi tắt chế độ chỉnh sửa, reset lại editedUserInfo về userInfo hiện tại
            setEditedUserInfo({ ...userInfo });
        }
    };
    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setEditedUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const sett = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4, // Mặc định hiển thị 4 slide trên màn hình lớn
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        vertical: false,
        verticalSwiping: false,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1, } },
            { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 1, } },
            { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
    };

    useEffect(() => {
        const calculatedTotalPrice = meals.reduce((sum, meal) => sum + (meal?.price || 0), 0);
        setTotalMealPrice(calculatedTotalPrice);
    }, [meals]);

    useEffect(() => {
        const { WEIGHT, HEIGHT, AGE, GENDER, ACTIVITY_LEVEL } = editedUserInfo;

        // Kiểm tra xem tất cả các thông tin cần thiết có hợp lệ không
        if (
            WEIGHT && !isNaN(parseFloat(WEIGHT)) && parseFloat(WEIGHT) > 0 &&
            HEIGHT && !isNaN(parseFloat(HEIGHT)) && parseFloat(HEIGHT) > 0 &&
            AGE && !isNaN(parseInt(AGE)) && parseInt(AGE) > 0 &&
            GENDER && ACTIVITY_LEVEL
        ) {
            const calculatedBMR = calculateBMR(WEIGHT, HEIGHT, AGE, GENDER);
            const calculatedTDEE = calculateTDEE(calculatedBMR, ACTIVITY_LEVEL);

            setBmr(calculatedBMR);
            setTdee(calculatedTDEE);
        } else {
            setBmr(0);
            setTdee(0);
        }
    }, [editedUserInfo]);
    

    
    const selectMealGreedy = (
        availableMeals,
        targetCalorie,
        mealCounts,
        usedMealsSet,
        vnIncluded,
        minPrice,
        maxPrice,
        preferredContinents,     // ⬅️ Array: các châu lục được ưu tiên
        mealIndex,
        selectedContinentsSet,
        vietnamDishCount    // ⬅️ Set: theo dõi đã chọn châu nào rồi
    ) => {
        // B1: Lọc theo giá hợp lệ
        const priceFiltered = availableMeals.filter(m =>
            m.price &&
            m.price >= minPrice &&
            m.price <= maxPrice
        );

        // B2: Lọc món chưa dùng
        const usableMeals = priceFiltered.filter(meal => !usedMealsSet.has(meal.name));

        // B3: Phân nhóm
        const vnMeals = usableMeals.filter(m => m.origin?.country === "Việt Nam");

        // Các món thuộc châu ưu tiên và chưa bị trùng
        const preferredUnselectedContinentMeals = usableMeals.filter(m =>
            preferredContinents.includes(m.origin?.continent) &&
            !selectedContinentsSet.has(m.origin?.continent)
        );

        let prioritized;

        if (vietnamDishCount < 1 && vnMeals.length > 0 && mealIndex < 3) {
            // Chưa có món Việt và chưa đến bữa cuối → ưu tiên món Việt
            prioritized = vnMeals;
        } else {
            // Loại các món Việt nếu đã có đủ
            const nonVietnamMeals = usableMeals.filter(m => m.origin?.country !== "Việt Nam");

            const preferredUnselectedContinentMeals = nonVietnamMeals.filter(m =>
                preferredContinents.includes(m.origin?.continent) &&
                !selectedContinentsSet.has(m.origin?.continent)
            );

            if (preferredUnselectedContinentMeals.length > 0) {
                prioritized = preferredUnselectedContinentMeals;
            } else {
                const anyPreferred = nonVietnamMeals.filter(m =>
                    preferredContinents.includes(m.origin?.continent)
                );
                prioritized = anyPreferred.length > 0 ? anyPreferred : nonVietnamMeals;
            }
        }


        // B4: Lọc theo calo gần target
        let pool = prioritized.filter(m => Math.abs(m.calories - targetCalorie) <= 150);
        if (pool.length === 0) {
            pool = prioritized.filter(m => Math.abs(m.calories - targetCalorie) <= 200);
        }
        if (pool.length === 0) {
            pool = prioritized;
        }

        // B5: Heuristic – ít dùng hơn + gần calo hơn
        pool.sort((a, b) => {
            const usedA = mealCounts[a.name] || 0;
            const usedB = mealCounts[b.name] || 0;
            const diffA = Math.abs(a.calories - targetCalorie);
            const diffB = Math.abs(b.calories - targetCalorie);
            return usedA - usedB || diffA - diffB;
        });

        // B6: Duyệt để lấy món chưa dùng
        for (const candidate of pool) {
            if (!usedMealsSet.has(candidate.name)) {
                return candidate;
            }
        }

        // fallback: chọn random
        return pool[Math.floor(Math.random() * pool.length)] || null;
    };

        // Hiệu ứng màn hình chào
        useEffect(() => {
            const timer = setTimeout(() => {
                setShowWelcome(false);
            }, 3000); // 3 giây

            return () => clearTimeout(timer);
        }, []);

        // Animation effect
        useEffect(() => {
            const handleScroll = () => {
                const elements = document.querySelectorAll('.fade-in');
                elements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    if (elementTop < window.innerHeight - 100) {
                        element.classList.add('visible');
                        setIsVisible(true);
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

    const calculateGoalCalories = useCallback(() => {
            if (!userInfo || !userInfo.WEIGHT || !userInfo.HEIGHT || !userInfo.AGE || !userInfo.GENDER || !userInfo.ACTIVITY || !targetWeightChange) {
                enqueueSnackbar("Vui lòng cập nhật đầy đủ thông tin cá nhân và mục tiêu thay đổi cân nặng để tính toán calo mục tiêu.", { variant: "warning" });
                return;
            }

            const weight = parseFloat(userInfo.WEIGHT);
            const height = parseFloat(userInfo.HEIGHT);
            const age = parseFloat(userInfo.AGE);
            const gender = userInfo.GENDER;
            const activityLevel = parseFloat(userInfo.ACTIVITY);
            // targetWeightChange cần được đảm bảo là số và đại diện cho lượng kg bạn muốn thay đổi trong 1 tuần
            const targetChange = parseFloat(targetWeightChange); 

            let bmr;
            if (gender === "male") {
                // Công thức Mifflin-St Jeor cho nam
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            } else {
                // Công thức Mifflin-St Jeor cho nữ
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            }

            let tdee = bmr * activityLevel;
            let adjustedTdee = tdee;

            const caloriesPerKg = 7700; // Khoảng 7700 calo mỗi kg

            if (goal === "gain") {
                // Cộng thêm calo để tăng cân (ví dụ: mục tiêu tăng X kg/tuần)
                adjustedTdee += (targetChange * caloriesPerKg) / 7;
            } else if (goal === "lose") {
                // Trừ đi calo để giảm cân (ví dụ: mục tiêu giảm X kg/tuần)
                adjustedTdee -= (targetChange * caloriesPerKg) / 7;
            }

            // Đảm bảo calo mục tiêu không quá thấp (ví dụ: ngưỡng an toàn 1200 cho nữ, 1500 cho nam)
            if (gender === "male" && adjustedTdee < 1500) {
                adjustedTdee = 1500;
                enqueueSnackbar("Lượng calo mục tiêu đã được điều chỉnh lên mức tối thiểu an toàn cho nam giới (1500 calo).", { variant: "info" });
            } else if (gender === "female" && adjustedTdee < 1200) {
                adjustedTdee = 1200;
                enqueueSnackbar("Lượng calo mục tiêu đã được điều chỉnh lên mức tối thiểu an toàn cho nữ giới (1200 calo).", { variant: "info" });
            }


            setGoalCalories(adjustedTdee);
            setTotalDailyCalories(adjustedTdee); // Dòng này là đúng để cập nhật tổng calo hàng ngày

            enqueueSnackbar(`Calo mục tiêu hàng ngày của bạn đã được tính toán: ${adjustedTdee.toFixed(1)} calo`, { variant: "success" });
        }, [userInfo, goal, targetWeightChange, enqueueSnackbar, setGoalCalories, setTotalDailyCalories]); // Thêm setGoalCalories và setTotalDailyCalories vào dependencies


        const getMealSuggestions = (goal) => {
            return mealData[goal] ? [...mealData[goal]].sort(() => Math.random() - 0.5).slice(0, 5) : [];
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
                        return (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Cảnh báo: Lượng Calo Tiêu Thụ Quá Thấp!
                            </Typography>
                            <Typography variant="body1" paragraph>
                            Bạn tiêu thụ quá ít calo trong tuần, điều này có thể dẫn đến <strong>suy dinh dưỡng nghiêm trọng</strong>. Lượng calo quá thấp sẽ không đủ để cơ thể tạo năng lượng cần thiết cho các hoạt động cơ bản như hô hấp, tuần hoàn, và vận động.
                            </Typography>
                            <Typography variant="body1" paragraph>
                            Hãy kiểm tra lại chế độ ăn của mình, bổ sung các thực phẩm giàu dinh dưỡng như <strong>rau xanh, protein nạc, và ngũ cốc nguyên hạt</strong> để cải thiện năng lượng hàng ngày và đảm bảo sức khỏe.
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Nguy Cơ Sức Khỏe Khi Thừa Cân, Béo Phì
                            </Typography>
                            <Typography variant="body1" paragraph>
                            Người bệnh thừa cân, béo phì phải đối mặt với nhiều nguy cơ sức khỏe nghiêm trọng như:
                            </Typography>
                            <List dense sx={{ ml: 2, listStyleType: 'disc', pl: 2 }}>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Bệnh tim</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Cao huyết áp</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Đột quỵ</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Viêm khớp</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Giảm khả năng sinh sản</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Gan nhiễm mỡ không do rượu</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Đái tháo đường type 2</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Hội chứng ngưng thở khi ngủ</ListItem>
                            </List>

                            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                            Đặc biệt, béo phì được cho là có liên quan đến <strong>13 loại ung thư</strong>, gồm:
                            </Typography>
                            <List dense sx={{ ml: 2, listStyleType: 'disc', pl: 2 }}>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Ung thư buồng trứng</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Ung thư gan</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Ung thư não</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Ung thư tuyến tụy</ListItem>
                            </List>
                            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                            Hãy tham khảo ý kiến chuyên gia dinh dưỡng hoặc bác sĩ để có kế hoạch ăn uống và vận động phù hợp nhất cho sức khỏe của bạn.
                            </Typography>
                        </Alert>
                        );
                    } else if (totalCalories > minCaloriesWeek * 1.2) {
                        return (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Cảnh báo: Lượng Calo Tiêu Thụ Quá Nhiều!
                            </Typography>
                            <Typography variant="body1" paragraph>
                            Bạn tiêu thụ quá nhiều calo trong tuần, điều này có thể dẫn đến <strong>tăng cân và các bệnh mãn tính</strong>. Khi lượng calo nạp vào vượt quá mức cơ thể cần, năng lượng dư thừa sẽ chuyển hóa thành mỡ, tích tụ lâu ngày gây béo phì.
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Nguy Cơ Sức Khỏe Khi Thừa Cân, Béo Phì
                            </Typography>
                            <Typography variant="body1" paragraph>
                            Người bệnh thừa cân, béo phì phải đối mặt với nhiều nguy cơ sức khỏe nghiêm trọng như:
                            </Typography>
                            <List dense sx={{ ml: 2, listStyleType: 'disc', pl: 2 }}>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Bệnh tim</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Cao huyết áp</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Đột quỵ</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Viêm khớp</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Giảm khả năng sinh sản</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Gan nhiễm mỡ không do rượu</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Đái tháo đường type 2</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Hội chứng ngưng thở khi ngủ</ListItem>
                            </List>

                            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                            Đặc biệt, béo phì được cho là có liên quan đến <strong>13 loại ung thư</strong>, gồm:
                            </Typography>
                            <List dense sx={{ ml: 2, listStyleType: 'disc', pl: 2 }}>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Ung thư buồng trứng</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Ung thư gan</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Ung thư não</ListItem>
                            <ListItem sx={{ display: 'list-item', py: 0.5 }}>Ung thư tuyến tụy</ListItem>
                            </List>
                            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                            Hãy điều chỉnh chế độ ăn uống và tăng cường vận động để duy trì cân nặng khỏe mạnh và giảm thiểu các nguy cơ này.
                            </Typography>
                        </Alert>
                        );
                    } else {
                        return (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Chúc mừng: Lượng Calo Tiêu Thụ Hợp Lý!
                            </Typography>
                            <Typography variant="body1" paragraph>
                            Lượng calo tiêu thụ trong tuần của bạn nằm trong mức hợp lý, cho thấy bạn đang duy trì một <strong>chế độ ăn uống cân bằng</strong>. Điều này giúp cơ thể bạn có đủ năng lượng để hoạt động mà không tích tụ mỡ thừa.
                            </Typography>
                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                            Hãy tiếp tục duy trì chế độ ăn uống này, kết hợp với luyện tập thể dục đều đặn để tăng cường sức khỏe tổng thể.
                            </Typography>
                        </Alert>
                        );
                    };
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
        const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        arrows: true,
        };
        const calculateBMI = useCallback(() => {
                if (!userInfo || !userInfo.WEIGHT || !userInfo.HEIGHT) {
                    return null;
                }
                const heightInMeters = userInfo.HEIGHT / 100;
                return (userInfo.WEIGHT / (heightInMeters * heightInMeters)).toFixed(2);
            }, [userInfo]);

            const getBMICategory = useCallback((bmi) => {
                if (bmi < 18.5) return "Thiếu cân";
                if (bmi >= 18.5 && bmi <= 24.9) return "Bình thường";
                if (bmi >= 25 && bmi <= 29.9) return "Thừa cân";
                if (bmi >= 30) return "Béo phì";
                return "";
        }, []);
        useEffect(() => {
        const { WEIGHT, HEIGHT, AGE, GENDER, ACTIVITY_LEVEL } = editedUserInfo;

        // Kiểm tra xem tất cả các thông tin cần thiết có hợp lệ không
        if (
            WEIGHT && !isNaN(parseFloat(WEIGHT)) && parseFloat(WEIGHT) > 0 &&
            HEIGHT && !isNaN(parseFloat(HEIGHT)) && parseFloat(HEIGHT) > 0 &&
            AGE && !isNaN(parseInt(AGE)) && parseInt(AGE) > 0 &&
            GENDER && ACTIVITY_LEVEL
        ) {
            const calculatedBMR = calculateBMR(WEIGHT, HEIGHT, AGE, GENDER);
            const calculatedTDEE = calculateTDEE(calculatedBMR, ACTIVITY_LEVEL);

            setBmr(calculatedBMR);
            setTdee(calculatedTDEE);
        } else {
            setBmr(0);
            setTdee(0);
        }
    }, [editedUserInfo]);


    // Hàm xử lý khi người dùng SUBMIT thông tin cá nhân 
        const outp = async () => { 
            const { WEIGHT, HEIGHT, AGE, GENDER, ACTIVITY_LEVEL } = editedUserInfo;
            let finalBMR = 0;
            let finalTDEE = 0;

            if (
                WEIGHT && !isNaN(parseFloat(WEIGHT)) && parseFloat(WEIGHT) > 0 &&
                HEIGHT && !isNaN(parseFloat(HEIGHT)) && parseFloat(HEIGHT) > 0 &&
                AGE && !isNaN(parseInt(AGE)) && parseInt(AGE) > 0 &&
                GENDER && ACTIVITY_LEVEL
            ) {
                finalBMR = calculateBMR(WEIGHT, HEIGHT, AGE, GENDER);
                finalTDEE = calculateTDEE(finalBMR, ACTIVITY_LEVEL);
            }

            const updatedUserInfoToSave = {
                ...userInfo,
                ...editedUserInfo,
                DAILY_WATER_INTAKE: dailyWaterIntake,
                BMR: finalBMR, // Lưu BMR vào đối tượng
                TDEE: finalTDEE // Lưu TDEE vào đối tượng
            };

            setUserInfo(updatedUserInfoToSave);
            setEditing(false);

        };

        const handleSubmit = () => {
            let fullFeedback = "";
            selectedConditions.forEach(condition => {
                let result = `Nếu bạn đang bị ${condition}, với mức calo tiêu thụ như trên thì, dưới đây là gợi ý thực đơn phù hợp cho bạn:\n`;
                result += suggestMenu(condition); // Hàm suggestMenu vẫn hoạt động với từng bệnh riêng lẻ
                fullFeedback += result + "\n\n---\n\n"; // Thêm dấu phân cách giữa các bệnh
            });

            setFeedback(fullFeedback);
        };
        

        const generateExerciseSuggestions = useCallback((isRandom = false) => {
            if (!userInfo || !userInfo.ACTIVITY || !goal) {
                enqueueSnackbar("Vui lòng cập nhật đầy đủ thông tin cá nhân và mục tiêu để nhận gợi ý bài tập.", { variant: "warning" });
                return;
            }

            const { ACTIVITY: activityLevel } = userInfo;
            const currentGoal = goal;

            const relevantExercises = exerciseData.filter(
                (item) => item.activityLevel === activityLevel || item.activityLevel === "any"
            );

            let suggestionsToDisplay = [];
            const selectedIds = new Set();

            const addUniqueSuggestion = (item) => {
                if (!selectedIds.has(item.id)) {
                    selectedIds.add(item.id);
                    suggestionsToDisplay.push(item);
                }
            };

            if (isRandom) {
                const numberOfRandomSuggestions = 3;
                const shuffled = [...relevantExercises].sort(() => 0.5 - Math.random());
                suggestionsToDisplay = shuffled.slice(0, numberOfRandomSuggestions);
                enqueueSnackbar("Đã tạo gợi ý bài tập ngẫu nhiên mới!", { variant: "info" });
            } else {
                // Ưu tiên 1: Khớp hoàn toàn activityLevel và goal
                relevantExercises.filter(
                    (item) => item.activityLevel === activityLevel && item.goal === currentGoal
                ).forEach(addUniqueSuggestion);

                // Ưu tiên 2: Khớp activityLevel, mục tiêu "any"
                if (suggestionsToDisplay.length < 3) {
                    relevantExercises.filter(
                        (item) => item.activityLevel === activityLevel && item.goal === "any"
                    ).forEach(addUniqueSuggestion);
                }

                // Ưu tiên 3: Khớp goal, activityLevel "any"
                if (suggestionsToDisplay.length < 3) {
                    relevantExercises.filter(
                        (item) => item.activityLevel === "any" && item.goal === currentGoal
                    ).forEach(addUniqueSuggestion);
                }

                // Ưu tiên 4: Các bài tập chung (activityLevel "any", goal "any")
                if (suggestionsToDisplay.length < 3) {
                    relevantExercises.filter(
                        (item) => item.activityLevel === "any" && item.goal === "any"
                    ).forEach(addUniqueSuggestion);
                }

                // Đảm bảo đủ số lượng bằng cách thêm ngẫu nhiên từ phần còn lại nếu cần
                const minSuggestions = 3;
                if (suggestionsToDisplay.length < minSuggestions) {
                    const remainingExercises = relevantExercises.filter(item => !selectedIds.has(item.id));
                    const shuffledRemaining = [...remainingExercises].sort(() => 0.5 - Math.random());
                    for (let i = 0; i < shuffledRemaining.length && suggestionsToDisplay.length < minSuggestions; i++) {
                        addUniqueSuggestion(shuffledRemaining[i]);
                    }
                }

                enqueueSnackbar("Đã tạo gợi ý bài tập cá nhân hóa!", { variant: "success" });
            }
            setExerciseSuggestions(suggestionsToDisplay);
    }, [userInfo, goal, enqueueSnackbar]);

        useEffect(() => {
            if (userInfo && userInfo.ACTIVITY && goal) {
                generateExerciseSuggestions(false); // Tạo gợi ý ban đầu (không random)
            }
        }, [userInfo, goal, generateExerciseSuggestions]);


    // Hàm tạo thực đơn mới
        const generateBalancedMealPlan = (totalDailyCalories, goal, minPrice,maxPrice, preferredContinents) => {
            const mealTimes = ["Sáng", "Trưa", "Chiều", "Tối"];
            const allMeals = mealData[goal] || mealData.maintain;
            const selectedMeals = [];
            const usedMealsInPlan = new Set(); // Theo dõi các món đã được chọn trong kế hoạch hiện tại
            const mealCounts = { ...mealGlobalCounts };
            const selectedContinents = new Set();
            let vietnamDishCount = 0;



            // Phân bổ calo theo tỷ lệ
            const calorieDistribution = {
                "Sáng": totalDailyCalories * 0.25,
                "Trưa": totalDailyCalories * 0.35,
                "Chiều": totalDailyCalories * 0.15,
                "Tối": totalDailyCalories * 0.25
            };

            let remainingCalories = totalDailyCalories;

            for (let i = 0; i < mealTimes.length; i++) {
                const mealTime = mealTimes[i];
                let targetCalories = calorieDistribution[mealTime];

                // Điều chỉnh cho bữa cuối để đảm bảo tổng calo
                if (i === mealTimes.length - 1) {
                    targetCalories = remainingCalories;
                } else {
                    targetCalories = Math.min(targetCalories, remainingCalories - (mealTimes.length - i - 1) * 100);
                }

                const availableMeals = allMeals.filter(meal => !usedMealsInPlan.has(meal.name));

                // Kiểm tra đã có món Việt chưa trong thực đơn này
                const vnIncluded = [...usedMealsInPlan].some(name => {
                    const meal = allMeals.find(m => m.name === name);
                    return meal?.origin?.country === "Việt Nam";
                });

                // Gọi greedy đã merge
                const selectedMeal = selectMealGreedy(
                    availableMeals,
                    targetCalories,
                    mealCounts,
                    usedMealsInPlan,
                    vnIncluded,
                    minPrice,
                    maxPrice,
                    preferredContinents,
                    i, // i là index bữa ăn (0-3)
                    selectedContinents,
                    vietnamDishCount
                    );
                

                if (selectedMeal) {
                    usedMealsInPlan.add(selectedMeal.name);
                    mealCounts[selectedMeal.name] = (mealCounts[selectedMeal.name] || 0) + 1;
                    setMealGlobalCounts(prev => ({
                        ...prev,
                        [selectedMeal.name]: (prev[selectedMeal.name] || 0) + 1
                }));
                if (selectedMeal.origin?.country === "Việt Nam") {
                    vietnamDishCount++;
                } else if (selectedMeal.origin?.continent) {
                    selectedContinents.add(selectedMeal.origin.continent);
                }

                

                const scale = targetCalories / selectedMeal.calories;

                const adjustedMeal = {
                        ...selectedMeal,
                        mealTime: mealTime,
                        actualCalories: targetCalories,
                        protein: selectedMeal.protein * scale,
                        fat: selectedMeal.fat * scale,
                        carbs: selectedMeal.carbs * scale,
                        weight: selectedMeal.weight * scale
                };

                    selectedMeals.push(adjustedMeal);
                    remainingCalories -= targetCalories;
                } else {
                    selectedMeals.push({
                        name: `Món ăn chưa xác định cho bữa ${mealTime}`,
                        mealTime: mealTime,
                        actualCalories: targetCalories,
                        protein: 0,
                        fat: 0,
                        carbs: 0,
                        weight: 0,
                        image: "https://i.pinimg.com/originals/f4/ff/55/f4ff55ade0c4dd49b0cc474395e420e5.gif",
                        description: "Đang cập nhật thông tin dinh dưỡng"
                    });
                    remainingCalories -= targetCalories;
                }
            }

            return selectedMeals;
        };
        

        // Sử dụng trong component
        const generateMealPlan = () => {
            if (totalDailyCalories === 0) {
                enqueueSnackbar("Vui lòng tính toán lượng calo mục tiêu trước", { variant: "warning" });
                return;
            }

            // Đặt lại danh sách bữa ăn thành rỗng trước khi tạo mới
            setMeals([]); 
            
            // Tạo thực đơn mới ngay lập tức
            const newMealPlan = generateBalancedMealPlan(
                totalDailyCalories,
                goal,
                minPrice,
                maxPrice,
                preferredContinents
                );
            setMeals(newMealPlan);
            
            // Tính toán chênh lệch calo
            const totalCalories = newMealPlan.reduce((sum, meal) => sum + (meal?.actualCalories || 0), 0); // Sử dụng actualCalories
            const difference = totalCalories - totalDailyCalories;
            
            if (Math.abs(difference) > 100) {
                enqueueSnackbar(`Thực đơn chênh lệch ${difference.toFixed(0)} calo so với mục tiêu`, { 
                    variant: "info",
                    autoHideDuration: 3000 
                });
            }
        };


        // Cập nhật useEffect
        useEffect(() => {
            if (totalDailyCalories > 0 && userInfo?.WEIGHT) {
                generateMealPlan();
            }
        }, [totalDailyCalories, goal, userInfo]);


        const MealCardDetail = ({ meal }) => {
            const safeMeal = meal || {
                name: "Đang tạo thực đơn...",
                calories: 0,
                protein: 0,
                fat: 0,
                carbs: 0,
                weight: 0,
                mealTime: "N/A",
                description: "Không có mô tả",
                ingredients_breakdown: [],
                image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            };

            return (
                <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                    {safeMeal.mealTime}: {safeMeal.name}
                    </Typography>
                    
                    {safeMeal.image && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <img 
                        src={safeMeal.image} 
                        alt={safeMeal.name} 
                        style={{ 
                            maxWidth: '100%', 
                            height: '200px', 
                            objectFit: 'cover', 
                            borderRadius: '8px' 
                        }} 
                        />
                    </Box>
                    )}
                    
                    <Typography variant="body1" paragraph>
                    <strong>Mô tả:</strong> {safeMeal.description}
                    </Typography>
                    
                    <Typography variant="body1">
                    <strong>Thông tin dinh dưỡng:</strong>
                    </Typography>
                    <Box sx={{ pl: 2, mb: 2 }}>
                    <Typography>Calo: {safeMeal.calories.toFixed(0)} calo</Typography>
                    <Typography>Protein: {safeMeal.protein.toFixed(1)}g</Typography>
                    <Typography>Chất béo: {safeMeal.fat.toFixed(1)}g</Typography>
                    <Typography>Carbs: {safeMeal.carbs.toFixed(1)}g</Typography>
                    {safeMeal.weight && <Typography>Khối lượng: {safeMeal.weight.toFixed(1)}g</Typography>}
                    </Box>
                    
                    <Typography variant="body1" gutterBottom>
                    <strong>Thành phần chính:</strong>
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                    {safeMeal.ingredients_breakdown?.map((ingredient, index) => (
                        <Typography key={index} variant="body2">
                        - {ingredient.item}: {ingredient.weight_g || ingredient.weight_ml}g/ml
                        {ingredient.note && ` (${ingredient.note})`}
                        </Typography>
                    ))}
                    </Box>
                    
                    <Typography variant="body1" gutterBottom>
                        {safeMeal.price !== undefined && <Typography> <strong>Giá: {safeMeal.price.toLocaleString('vi-VN')} VND </strong></Typography>}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {safeMeal.origin && safeMeal.origin.country && <Typography> <strong> Quốc gia: {safeMeal.origin.country}</strong></Typography>}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {safeMeal.origin && safeMeal.origin.continent && <Typography><strong>Châu lục: {safeMeal.origin.continent}</strong></Typography>}
                    </Typography>

                    {safeMeal.recipe_link && (
                        <Button
                            variant="outlined"
                            href={safeMeal.recipe_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ mt: 2 }}
                        >
                            Xem công thức chi tiết
                        </Button>
                                        )}
                </CardContent>
                </Card>
            );
        };
        
        const renderMealPlan = () => {
            const totalActualCalories = meals.reduce((sum, m) => sum + (m?.actualCalories || 0), 0);
            const calorieDifference = totalActualCalories - totalDailyCalories;

            return (
                <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                    Thực đơn mẫu cho mục tiêu {goal === "gain" ? "tăng cân" : goal === "lose" ? "giảm cân" : "giữ cân"}
                    &nbsp;({totalDailyCalories.toFixed(0)} calo/ngày)
                    {Math.abs(calorieDifference) > 0 && (
                    <Typography 
                        variant="caption" 
                        color={Math.abs(calorieDifference) > 100 ? "error" : "text.secondary"}
                        sx={{ ml: 1 }}
                    >
                        ({calorieDifference > 0 ? '+' : ''}{calorieDifference.toFixed(0)} calo)
                    </Typography>
                    )}
                    <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                        setMeals([]); // Reset meals trước khi tạo mới
                        setTimeout(() => generateMealPlan(), 0); // Đảm bảo render lại
                    }}
                    style={{ marginLeft: '10px' }}
                    >
                    Tạo thực đơn mới
                    </Button>
                </Typography>

                <Grid container spacing={2}>
                    {meals.length > 0 ? (
                    meals.map((meal, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                        <MealCardDetail meal={meal} />
                        </Grid>
                    ))
                    ) : (
                    ["Sáng", "Trưa", "Chiều", "Tối"].map((time) => (
                        <Grid item xs={12} sm={6} md={3} key={time}>
                        <MealCardDetail meal={{
                            name: "Đang tạo thực đơn...",
                            mealTime: time,
                            calories: 0,
                            protein: 0,
                            fat: 0,
                            carbs: 0,
                            weight: 0,
                            description: "Vui lòng nhấn nút 'Tạo thực đơn mới'",
                            image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                        }} />
                        </Grid>
                    ))
                    )}
                </Grid>

                {meals.length > 0 && (
                    <Box mt={2}>
                    <Typography variant="body1">
                        <strong>Tổng lượng dinh dưỡng trong ngày:</strong>
                    </Typography>
                    <Typography>
                        Calo: {totalActualCalories.toFixed(0)}
                        {Math.abs(calorieDifference) > 0 && (
                        <span style={{ color: Math.abs(calorieDifference) > 100 ? 'red' : 'inherit', marginLeft: '5px' }}>
                            ({calorieDifference > 0 ? '+' : ''}{calorieDifference.toFixed(0)})
                        </span>
                        )}
                    </Typography>
                    <Typography>Protein: {meals.reduce((sum, m) => sum + (m?.protein || 0), 0).toFixed(1)}g</Typography>
                    <Typography>Chất béo: {meals.reduce((sum, m) => sum + (m?.fat || 0), 0).toFixed(1)}g</Typography>
                    <Typography>Carbs: {meals.reduce((sum, m) => sum + (m?.carbs || 0), 0).toFixed(1)}g</Typography>
                    {meals.length > 0 && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Tổng tiền dự kiến cho thực đơn: <strong>{totalMealPrice.toLocaleString('vi-VN')} VNĐ</strong>
                        </Alert>    )}
                    </Box>
                )}
                </Box>
            );
        };
        
        <Divider style={ {margin: "40px 0"}} />
        {/*holistic health advice*/}
        <Box mt = {4} className="fade-in">
            <Typography variant="h5" gutterBottom style = {{fontWeight: "bold"}}> 
                Lời khuyên về sức khỏe tổng thể
            </Typography>
            {/*Giấc ngủ*/}
            <Card sx = {{mb:3}}>
                <CardContent>
                    <Typography variant="h6" gutterBottom> Giấc ngủ</Typography>
                    <Typography variant="body1"> Giấc ngủ đủ giấc là yếu tố then chốt cho sức khỏe tổng thể  </Typography>
                    <Typography variant = "body1" mt = {1}>
                        Để cải thiện giấc ngủ, hãy thử các biện pháp sau:
                        <ul>
                            <li>Đi ngủ và thức dậy vào cùng một thời điểm mỗi ngày, kể cả cuối tuần</li>
                            <li>Tạo ra môi trường ngủ tối, yên tĩnh và mát mẻ</li>
                            <li>Tránh caffein và rượu, chất kích thích, gây mất ngủ trước khi ngủ</li>
                            <li>Theo một nghiên cứu từ các nhà khoa học, cần hạn chế sử dụng thiết bị điện tử trước khi đi ngủ. (Ít nhất không sử dụng trước 1 tiếng)</li>
                            <li>Thực hiện các hoạt động thư giãn trước khi ngủ như đọc sách, thiền, hoặc tắm nước ấm </li>
                        </ul>
                    </Typography>
                    {/* Input số giờ ngủ */}
                    <FormControl fullWidth margin = "normal">
                        <TextField 
                        label = "Số giờ ngủ trung bình mỗi đêm"
                        type = "number"
                        value = {averageSleepHours}
                            onChange={(e) => setAverageSleepHours(e.target.value)}
                            inputProps={{min: "0",step : "0.1"}}
                            helperText= "Ví dụ 7.5 giờ"
                        />
                    </FormControl>
                    {/* Lời khuyên cá nhân hóa dựa trên input */}
                    {averageSleepHours && (
                        <Alert severity={averageSleepHours >= 7 && averageSleepHours <= 9 ? "success" : "warning"} sx={{ mt: 2 }}>
                            {averageSleepHours >= 7 && averageSleepHours <= 9
                                ? `Bạn đang ngủ đủ giấc (${averageSleepHours} giờ). Rất tốt cho sức khỏe!`
                                : `Với ${averageSleepHours} giờ ngủ, bạn có thể đang thiếu hoặc thừa giấc. Mục tiêu là 7-9 giờ/đêm. Hãy điều chỉnh để cải thiện sức khỏe nhé.`
                            }
                        </Alert>
                    )}
                    <Typography variant="body1" mt={2}>
                        {/* Lời khuyên dựa trên mức độ vận động (giữ nguyên) */}
                        {userInfo.ACTIVITY === "sedentary" ? "Với mức độ vận động thấp, bạn cần đảm bảo giấc ngủ chất lượng để cơ thể phục hồi tối ưu, tránh tình trạng mệt mỏi do thiếu vận động." : ""}
                        {userInfo.ACTIVITY === "active" || userInfo.ACTIVITY === "very_active" ? "Do mức độ vận động cao, giấc ngủ sâu và đủ rất quan trọng để cơ bắp phục hồi và tái tạo năng lượng." : ""}
                    </Typography>
                </CardContent>
            </Card>
            </Box>
            
                
        {/* Bài tập thể thao tốt cho sức khỏe (cá nhân hóa) */}
        {/* Phần này sẽ thay đổi thành động */}
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>Bài tập thể thao tốt cho sức khỏe</Typography>
                <Typography variant="body1">
                    Hoạt động thể chất thường xuyên mang lại vô số lợi ích cho sức khỏe, bao gồm kiểm soát cân nặng, giảm nguy cơ mắc bệnh tim mạch, tiểu đường type 2, và một số bệnh ung thư, cải thiện tâm trạng và tăng cường năng lượng.
                </Typography>
                {/* Nút để tạo gợi ý bài tập */}
                <Box mt={2} mb={2}>
                    <Button variant="contained" onClick={generateExerciseSuggestions}>
                        Tạo gợi ý bài tập cá nhân hóa
                    </Button>
                </Box>

                {/* Hiển thị gợi ý bài tập */}
                {exerciseSuggestions.length>0 ? (
                    <Box mt = {2}>
                        <Typography variant = "body1">
                            <strong>Dựa trên thông tin của bạn ({userInfo?.ACTIVITY} và mục tiêu {goal === "gain" ? "tăng cân" : goal === "lose" ? "giảm cân" : "giữ cân"}):</strong>
                        </Typography>
                        <ul>
                            {exerciseSuggestions.map((suggestion) => (
                                <li key={suggestion.id} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                    <Typography variant="h6" gutterBottom>
                                        <strong>{suggestion.title}</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {suggestion.description}
                                        {suggestion.note && ` (${suggestion.note})`}
                                    </Typography>

                                    {/* Thêm các thông tin mới */}
                                    {suggestion.benefitsForHealth && suggestion.benefitsForHealth.length > 0 && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            <strong>Lợi ích sức khỏe:</strong> {suggestion.benefitsForHealth.join(', ')}.
                                        </Typography>
                                    )}
                                    {suggestion.diseasePrevention && suggestion.diseasePrevention.length > 0 && (
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            <strong>Phòng chống bệnh:</strong> {suggestion.diseasePrevention.join(', ')}.
                                        </Typography>
                                    )}
                                    {suggestion.realLifeApplication && (
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            <strong>Ứng dụng thực tế:</strong> {suggestion.realLifeApplication}
                                        </Typography>
                                    )}
                                    {suggestion.suitableAgeGroup && suggestion.suitableAgeGroup.length > 0 && (
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            <strong>Phù hợp với:</strong> {suggestion.suitableAgeGroup.join(', ')}.
                                        </Typography>
                                    )}

                                    {suggestion.link && (
                                        <Box mt={1}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => window.open(suggestion.link, '_blank')}
                                            >
                                                Xem hướng dẫn
                                            </Button>
                                        </Box>
                                    )}
                                </li>
                            ))}
                        </ul>
                            </Box>
                        ) : (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Nhấn nút "Tạo gợi ý bài tập cá nhân hóa" để xem các bài tập phù hợp với bạn.
                            </Alert>
                        )}
                                    
            </CardContent>
        </Card>
        {/* Khuyến nghị tham khảo ý kiến chuyên gia */}
        <Alert severity="info" sx={{ mt: 4 }}>
            <Typography variant="body2">
                **Lưu ý quan trọng:** Mọi lời khuyên về dinh dưỡng, giấc ngủ, lượng nước và bài tập thể thao trên đây chỉ mang tính chất tham khảo chung. Để có được kế hoạch cá nhân hóa chính xác và an toàn nhất cho tình trạng sức khỏe của bạn, **chúng tôi đặc biệt khuyến nghị bạn nên tham khảo ý kiến của bác sĩ, chuyên gia dinh dưỡng hoặc huấn luyện viên thể hình chuyên nghiệp.** Họ có thể đưa ra lời khuyên dựa trên tiền sử bệnh lý, tình trạng sức khỏe hiện tại và mục tiêu cụ thể của bạn.
            </Typography>
        </Alert>

        const handleGenerateSuggestion = useCallback(() => {
            const uniqueSuggestions = SleepAidCard(
                selectedSleepConditions,
                selectedSleepHerbs
            );

            if (uniqueSuggestions.length > 0) {
                setSuggestionsList(uniqueSuggestions);
                setCurrentPage(0);
                enqueueSnackbar("Đã tạo gợi ý hỗ trợ giấc ngủ!", { variant: "success" });
            } else {
                setSuggestionsList([]);
                enqueueSnackbar("Không tìm thấy gợi ý hỗ trợ giấc ngủ phù hợp với lựa chọn của bạn.", { variant: "info" });
            }
        }, [selectedSleepConditions, selectedSleepHerbs, enqueueSnackbar]); // dependencies của useCallback

        const handleNextPage = () => {
            setCurrentPage((prevPage) => (prevPage + 1) % suggestionsList.length);
        };

        const handlePrevPage = () => {
            setCurrentPage((prevPage) => (prevPage - 1 + suggestionsList.length) % suggestionsList.length);
        };

        const currentSuggestion = suggestionsList[currentPage];
        

        return (
            <div style={{ padding: "20px" }}>
                {/* Welcome Screen */}
                {showWelcome && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                        transition: 'opacity 1s ease-out',
                        opacity: showWelcome ? 1 : 0
                    }}>
                        <img
                            src="https://i.pinimg.com/originals/65/7c/4e/657c4e74484fdac17d2f7b63e7476f83.gif"
                            alt="Welcome"
                            style={{
                                maxWidth: '80%',
                                maxHeight: '60%',
                                borderRadius: '10px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '10%',
                            width: '100%',
                            textAlign: 'center',
                            animation: 'ribbonFall 2s ease-in-out'
                        }}>
                            <img
                                src={helo}
                                alt="Ribbon"
                                style={{
                                    maxWidth: '80%',
                                    transform: 'rotate(0deg)'
                                }}
                            />
                        </div>
                        <style jsx>{`
                            @keyframes ribbonFall {
                                0% { transform: translateY(-100px); opacity: 0; }
                                100% { transform: translateY(0); opacity: 1; }
                            }
                        `}</style>
                    </div>
                )}

                {/* Header */}
                <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
                <Box mb={4}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Thông tin cá nhân
                    </Typography>

                    <Box mb={3} sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 3,
                        p: 2,
                        borderRadius: '8px',
                        boxShadow: 3
                    }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Tên"
                                        name="NAME"
                                        value={editedUserInfo.NAME || ''}
                                        onChange={handleFieldChange}
                                        disabled={!editing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Chiều cao (cm)"
                                        name="HEIGHT"
                                        type="number"
                                        value={editedUserInfo.HEIGHT || ''}
                                        onChange={handleFieldChange}
                                        disabled={!editing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Cân nặng (kg)"
                                        name="WEIGHT"
                                        type="number"
                                        value={editedUserInfo.WEIGHT || ''}
                                        onChange={handleFieldChange}
                                        disabled={!editing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Tuổi"
                                        name="AGE"
                                        type="number"
                                        value={editedUserInfo.AGE || ''}
                                        onChange={handleFieldChange}
                                        disabled={!editing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth disabled={!editing}>
                                        <InputLabel>Giới tính</InputLabel>
                                        <Select
                                            name="GENDER"
                                            value={editedUserInfo.GENDER || ''}
                                            label="Giới tính"
                                            onChange={handleFieldChange}
                                        >
                                            <MenuItem value="Nam">Nam</MenuItem>
                                            <MenuItem value="Nữ">Nữ</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth disabled={!editing}>
                                        <InputLabel>Mức độ vận động</InputLabel>
                                        <Select
                                            name="ACTIVITY_LEVEL"
                                            value={editedUserInfo.ACTIVITY_LEVEL || ''}
                                            label="Mức độ vận động"
                                            onChange={handleFieldChange}
                                        >
                                            <MenuItem value="Ít vận động">Ít vận động (ít hoặc không tập thể dục)</MenuItem>
                                            <MenuItem value="Vận động nhẹ">Vận động nhẹ (1-3 ngày/tuần)</MenuItem>
                                            <MenuItem value="Vận động vừa">Vận động vừa (3-5 ngày/tuần)</MenuItem>
                                            <MenuItem value="Vận động nhiều">Vận động nhiều (6-7 ngày/tuần)</MenuItem>
                                            <MenuItem value="Vận động rất nhiều">Vận động rất nhiều (2 lần/ngày)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth disabled={!editing}>
                                        <InputLabel>Mục tiêu</InputLabel>
                                        <Select
                                            name="GOAL"
                                            value={editedUserInfo.GOAL || ''}
                                            label="Mục tiêu"
                                            onChange={handleFieldChange}
                                        >
                                            <MenuItem value="Giảm cân">Giảm cân</MenuItem>
                                            <MenuItem value="Tăng cân">Tăng cân</MenuItem>
                                            <MenuItem value="Duy trì cân nặng">Duy trì cân nặng</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Box mt={3} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={editing ? handleSubmit : handleEditToggle} 
                                >
                                    {editing ? 'Lưu thay đổi' : 'Chỉnh sửa thông tin'}
                                </Button>
                                {editing && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleEditToggle}
                                    >
                                        Hủy
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </div>


                <Box mb={4}>
                    <FormControlLabel
                        control={<Switch checked={showBMI} onChange={() => setShowBMI(!showBMI)} />}
                        label="Xem chỉ số BMI"
                    />
                    {showBMI && (
                        <Card variant="outlined" sx={{ mt: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Chỉ số BMI
                                </Typography>
                                <Typography variant="body1">
                                    Chỉ số BMI của bạn: {calculateBMI() || 'N/A'}
                                </Typography>
                                <Typography variant="body1">
                                    Tình trạng: {getBMICategory(calculateBMI())}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Box>

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
                                    <TextField
                                        type="number"
                                        label={goal === "gain" ? "Mong muốn tăng (kg/tuần)" : "Mong muốn giảm (kg/tuần)"}
                                        value={targetWeightChange}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setTargetWeightChange(value);
                                            if (value < 0 || value > 1) {
                                                setWeightChangeError("Mức thay đổi cân nặng hợp lý là từ 0 đến 1 kg/tuần.");
                                            } else {
                                                setWeightChangeError("");
                                            }
                                        }}
                                        error={!!weightChangeError}
                                        helperText={weightChangeError}
                                    />
                                </FormControl>

                            )}
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                    label="Giá tối thiểu (VND)"
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (val > 0 && val < 1000000) setMinPrice(val);
                                    }}
                                    helperText="Giá > 0 và < 1.000.000 VND"
                                    fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                    label="Giá tối đa (VND)"
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (val >= minPrice + 10000 && val <= 1000000) setMaxPrice(val);
                                    }}
                                    helperText="Lớn hơn min ít nhất 10.000 VND"
                                    fullWidth
                                    />
                                </Grid>
                            </Grid>
                            {/* Chọn châu lục ưu tiên */}
                            <FormControl fullWidth margin="normal">
                                        <InputLabel id="preferred-continents-label">Ưu tiên 3 châu lục</InputLabel>
                                        <Select
                                            labelId="preferred-continents-label"
                                            multiple // Cho phép chọn nhiều mục
                                            value={preferredContinents}
                                            onChange={(e) => {
                                                const {
                                                    target: { value },
                                                } = e;
                                                // Xử lý giá trị: nếu là chuỗi (do người dùng gõ tay), chuyển thành mảng
                                                // Nếu là mảng (do chọn từ dropdown), giữ nguyên
                                                const selectedValues = typeof value === 'string' ? value.split(',') : value;

                                                // Giới hạn chỉ chọn tối đa 3 châu lục
                                                if (selectedValues.length <= 3) {
                                                    setPreferredContinents(selectedValues);
                                                } else {
                                                    // Hiển thị thông báo nếu người dùng cố gắng chọn quá 3
                                                    // Bạn cần có hàm enqueueSnackbar từ thư viện notistack nếu dùng
                                                    enqueueSnackbar("Chỉ có thể chọn tối đa 3 châu lục ưu tiên.", { variant: "warning" });
                                                }
                                            }}
                                            input={<OutlinedInput label="Ưu tiên 3 châu lục" />} // Thêm input để hiển thị label đúng
                                            renderValue={(selected) => selected.join(', ')} // Cách hiển thị các mục đã chọn
                                        >
                                            {["Châu Á", "Châu Âu", "Châu Phi", "Châu Mỹ", "Châu Úc"].map((continent) => (
                                                <MenuItem key={continent} value={continent}>
                                                    <Checkbox checked={preferredContinents.indexOf(continent) > -1} /> {/* Đánh dấu check */}
                                                    <ListItemText primary={continent} /> {/* Hiển thị tên châu lục */}
                                                </MenuItem>
                                            ))}
                                        </Select>
                            </FormControl>

                            <Box mt={2} textAlign="center">
                                    <Typography variant="body2" color="textSecondary">
                                        Bạn có thể tham khảo tỷ giá quy đổi tiền tệ tại: <a href="https://www.vietcombank.com.vn/ExchangeRates/ForeignCurrencies/" target="_blank" rel="noopener noreferrer">Vietcombank</a> hoặc <a href="https://www.xe.com/" target="_blank" rel="noopener noreferrer">XE.com</a>
                                    </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={calculateGoalCalories}
                                disabled={!!weightChangeError}
                            >
                                Tính toán Calo mục tiêu
                            </Button>

                            {goalCalories > 0 && (
                                <Box mt={2}>
                                    <Typography variant="body1">
                                        <strong>Calo mục tiêu hàng ngày:</strong> {goalCalories.toFixed(1)} calo
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                    </Grid>
                </Grid>

                {/* Meal Plan Section */}
                {totalDailyCalories > 0 && renderMealPlan()}
                
                            <Divider style={{ margin: "40px 0" }} />
                
                            {/* Health Feedback Section */}
                            <Box mt={4} className="fade-in">
                                <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
                                    Cảnh báo sức khỏe và gợi ý dinh dưỡng
                                </Typography>
                                <Alert severity="info" style={{ marginBottom: "20px" }}>
                                    {getHealthWarnings()}
                                </Alert>
                
                                <FormControl fullWidth margin="normal">
                                <Autocomplete
                                    multiple // Cho phép chọn nhiều mục
                                    freeSolo // Cho phép người dùng nhập các giá trị không có trong danh sách
                                    options={Object.values(conditions).flat().sort()} // Danh sách các điều kiện có sẵn
                                    value={selectedConditions} // Giá trị đang được chọn (là một mảng)
                                    onChange={(event, newValue) => {
                                        // newValue là một mảng chứa cả các lựa chọn và các giá trị tự nhập
                                        setSelectedConditions(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Chọn hoặc nhập tình trạng sức khỏe bạn đang gặp phải"
                                            placeholder="Ví dụ: Tiểu đường, Mệt mỏi mãn tính, ..."
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                key={index} // Sử dụng index làm key tạm thời, hoặc generate ID duy nhất nếu cần
                                                label={option}
                                                {...getTagProps({ index })}
                                            />
                                        ))
                                    }
                                />
                            </FormControl>
                            <Box sx={{ mt: 3, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={selectedConditions.length === 0}
                                    sx={{
                                        padding: '12px 30px', // Tăng kích thước nút
                                        fontSize: '1.1rem',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                                        },
                                    }}
                                >
                                    Nhận gợi ý thực đơn bệnh lý
                                </Button>
                
                                {feedback && (
                                    <Paper
                                        elevation={3} // Thêm độ nổi cho thông báo
                                        sx={{
                                            mt: 4, // Khoảng cách trên
                                            p: 3, // Padding bên trong
                                            width: '100%',
                                            maxWidth: '800px', // Giới hạn chiều rộng
                                            bgcolor: 'background.paper', // Màu nền theo theme
                                            borderRadius: '10px',
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                                            Gợi ý sức khỏe và Thực đơn
                                        </Typography>
                                        <Alert severity="success" sx={{ width: '100%', whiteSpace: 'pre-line', p: 2 }}>
                                            {feedback}
                                        </Alert>
                                    </Paper>
                        )}
                </Box>
                </Box>

                <Divider style={{ margin: "40px 0" }} />

                {/* Weekly Calorie Chart */}
                <Box mt={4} className="fade-in">
                    <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
                        Biểu đồ calo tiêu thụ trong tuần
                    </Typography>
                    {weekData.length > 0 ? (
                        <Chart
                            options={{
                                chart: {
                                    id: "weekly-calorie-chart",
                                },
                                xaxis: {
                                    categories: weekData.map((item) => item.DAY),
                                },
                                yaxis: {
                                    title: {
                                        text: "Calories",
                                    },
                                },
                                stroke: {
                                    curve: 'smooth',
                                },
                                markers: {
                                    size: 4,
                                },
                                dataLabels: {
                                    enabled: false,
                                },
                                tooltip: {
                                    y: {
                                        formatter: function (val) {
                                            return val + " calo";
                                        },
                                    },
                                },
                                colors: ['#00E396'], // Green color for consumed calories
                            }}
                            series={[
                                {
                                    name: "Calo tiêu thụ",
                                    data: weekData.map((item) => item.CALORIES),
                                },
                            ]}
                            type="area"
                            height={350}
                        />
                    ) : (
                        <Alert severity="info">Chưa có dữ liệu calo trong tuần để hiển thị biểu đồ.</Alert>
                    )}
                </Box>
                <Box mt={4} className="fade-in">
                    <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
                        Dự kiến lượng calo tiêu thụ trung bình hàng tháng
                    </Typography>
                    <TableContainer component={Paper} style={{ margin: "20px auto", maxWidth: "800px" }}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}><strong>Tổng calo trung bình hàng tháng:</strong></TableCell>
                                    <TableCell align="left" style={{fontSize: "19px"}}>{totalMonthlyCalories.toFixed(1)} calo</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}><strong>Lượng calo tối thiểu cần thiết trong tháng:</strong></TableCell>
                                    <TableCell align="left" style={{fontSize: "19px"}}>{minCaloriesMonth.toFixed(1)} calo</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                

                <Box mt={4} className="fade-in">
                    <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
                        Gợi ý bài tập
                    </Typography>

                    {exerciseSuggestions.length > 0 ? ( // LỖI ĐÃ SỬA TẠI ĐÂY
                        <Slider {...settings}>
                            {exerciseSuggestions.map((exercise) => ( // LỖI ĐÃ SỬA TẠI ĐÂY
                                <Box key={exercise.id} p={2}>
                                    <Card sx={{ maxWidth: 800, mx: "auto" }}>
                                        {exercise.image && (
                                            <Box
                                                component="img"
                                                src={exercise.image}
                                                alt={exercise.title}
                                                sx={{
                                                    width: "100%",
                                                    height: 300,
                                                    objectFit: "cover",
                                                    borderTopLeftRadius: 8,
                                                    borderTopRightRadius: 8,
                                                }}
                                            />
                                        )}
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {exercise.title}
                                            </Typography>
                                            <Typography variant="body1" paragraph>
                                                {exercise.description}
                                            </Typography>

                                            {exercise.note && (
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Lưu ý:</strong> {exercise.note}
                                                </Typography>
                                            )}

                                            {exercise.benefitsForHealth?.length > 0 && (
                                                <Box mb={1}>
                                                <Typography variant="body2" fontWeight="bold">Lợi ích:</Typography>
                                                {exercise.benefitsForHealth.map((item, idx) => (
                                                    <Chip key={idx} label={item} sx={{ m: 0.5 }} />
                                                ))}
                                                </Box>
                                            )}

                                            {exercise.diseasePrevention?.length > 0 && (
                                                <Box mb={1}>
                                                <Typography variant="body2" fontWeight="bold">Phòng ngừa bệnh:</Typography>
                                                {exercise.diseasePrevention.map((item, idx) => (
                                                    <Chip key={idx} label={item} sx={{ m: 0.5 }} />
                                                ))}
                                                </Box>
                                            )}

                                            {exercise.suitableAgeGroup?.length > 0 && (
                                                <Box mb={1}>
                                                <Typography variant="body2" fontWeight="bold">Phù hợp với:</Typography>
                                                {exercise.suitableAgeGroup.map((item, idx) => (
                                                    <Chip key={idx} label={item} sx={{ m: 0.5 }} />
                                                ))}
                                                </Box>
                                            )}

                                            {exercise.realLifeApplication && (
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                <strong>Ứng dụng thực tế:</strong> {exercise.realLifeApplication}
                                                </Typography>
                                            )}

                                            {exercise.link && (
                                                <Button
                                                variant="outlined"
                                                href={exercise.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ mt: 2 }}
                                                >
                                                Xem video hướng dẫn
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Slider>
                    ) : (
                        <Typography textAlign="center" variant="body1" mt={2}>
                        Không có gợi ý bài tập nào.
                        </Typography>
                    )}

                    <Box textAlign="center" mt={3}>
                        <Button variant="contained" color="primary" onClick={() => generateExerciseSuggestions(true)}>
                        Đổi gợi ý bài tập khác
                        </Button>
                    </Box>
                </Box>

                <Box mt={4} className="fade-in">
                    <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
                        Gợi ý sức khỏe cá nhân hóa
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    {/* Giấc ngủ */}
                    <Box>
                        <Typography variant="h6" gutterBottom fontWeight="medium">
                        Giấc ngủ mỗi đêm
                        </Typography>
                        <FormControl fullWidth margin="normal">
                        <TextField
                            label="Số giờ ngủ trung bình mỗi đêm"
                            type="number"
                            value={averageSleepHours}
                            onChange={(e) => setAverageSleepHours(e.target.value)}
                            inputProps={{ min: "0", step: "0.1" }}
                            helperText="Ví dụ: 7.5 giờ"
                        />
                        </FormControl>

                        {averageSleepHours && (
                            <Alert severity={averageSleepHours >= 7 && averageSleepHours <= 9 ? "success" : "warning"} sx={{ mt: 2 }}>
                                {averageSleepHours > 0 && averageSleepHours <=12   ? (
                                averageSleepHours >= 7 && averageSleepHours <= 9
                                    ? `Bạn đang ngủ đủ giấc (${averageSleepHours} giờ). Rất tốt cho sức khỏe!`
                                    : `Với ${averageSleepHours} giờ ngủ, bạn có thể đang thiếu hoặc thừa giấc. Mục tiêu là 7-9 giờ/đêm. Hãy điều chỉnh để cải thiện sức khỏe nhé.`
                                ): ('Số giờ ngủ trung bình trong một ngày chưa hợp lệ. Vui lòng cung cấp lại..' )}
                            </Alert>
                    )}
                        <Typography variant="body1" mt={2}>
                            {/* Lời khuyên dựa trên mức độ vận động (giữ nguyên) */}
                            {userInfo.ACTIVITY === "sedentary" ? "Với mức độ vận động thấp, bạn cần đảm bảo giấc ngủ chất lượng để cơ thể phục hồi tối ưu, tránh tình trạng mệt mỏi do thiếu vận động." : ""}
                            {userInfo.ACTIVITY === "active" || userInfo.ACTIVITY === "very_active" ? "Do mức độ vận động cao, giấc ngủ sâu và đủ rất quan trọng để cơ bắp phục hồi và tái tạo năng lượng." : ""}
                        </Typography>
                    </Box>
                    
                    <Divider sx = {{my:3}}/>

                    <Box mt = {4} className = "fade-in">
                        {/* Gọi hàm mới tại đây */}
                        <Box mb={4}>
                                <FormControlLabel
                                    control={<Switch checked={showSleepAid} onChange={() => setShowSleepAid(!showSleepAid)} />}
                                    label="Gợi ý hỗ trợ giấc ngủ"
                                />
                                {showSleepAid && (
                                    <Card variant="outlined" sx={{ mt: 2 }}>
                                        <CardContent>
                                            {/* Đảm bảo component SleepAidCard được render ở đây */}
                                            <SleepAidCard /> {/* <--- Dòng này rất quan trọng */}
                                        </CardContent>
                                    </Card>
                                )}
                        </Box>
                    </Box>
                </Box>

                    

                {/* Lượng nước tiêu thụ mỗi ngày */}
                <Divider sx={{ my: 3 }} />
                <Card sx={{ mb: 3 }}>
                        <CardContent>
                        <Typography variant="h6" gutterBottom>Lượng nước tiêu thụ mỗi ngày</Typography>
                        <Typography variant="body1">
                            Uống đủ nước là rất quan trọng để duy trì các chức năng cơ thể. Lượng nước khuyến nghị có thể khác nhau tùy vào cân nặng, mức độ hoạt động và khí hậu. Một quy tắc chung là nam giới trưởng thành nên uống khoảng 3.7 lít/ngày và nữ giới khoảng 2.7 lít/ngày từ tổng lượng thực phẩm và đồ uống.
                        </Typography>
                        <Typography variant="body1" mt={1}>
                            Nước giúp:
                            <ul>
                                <li>Vận chuyển chất dinh dưỡng và oxy đến các tế bào.</li>
                                <li>Điều hòa nhiệt độ cơ thể.</li>
                                <li>Bôi trơn khớp.</li>
                                <li>Bảo vệ các cơ quan và mô.</li>
                                <li>Loại bỏ chất thải qua nước tiểu và phân.</li>
                            </ul>
                        </Typography>
                        {/* Input cho lượng nước */}
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Lượng nước uống hàng ngày (ml)"
                                type="number"
                                value={dailyWaterIntake}
                                onChange={(e) => setDailyWaterIntake(e.target.value)}
                                inputProps={{ min: "0" }}
                                helperText="Ví dụ: 2500 ml"
                            />
                        </FormControl>
                        {/* Lời khuyên cá nhân hóa dựa trên input và cân nặng */}
                    {dailyWaterIntake && userInfo.WEIGHT && (
                        <Alert severity={
                            (dailyWaterIntake / 1000 >= (userInfo.WEIGHT * 30 / 1000) && dailyWaterIntake / 1000 <= (userInfo.WEIGHT * 40 / 1000))
                            ? "success"
                            : "warning"
                        } sx={{ mt: 2 }}>
                            {dailyWaterIntake / 1000 >= (userInfo.WEIGHT * 30 / 1000) && dailyWaterIntake / 1000 <= (userInfo.WEIGHT * 40 / 1000)
                                ? `Bạn đang uống đủ lượng nước khuyến nghị (${(dailyWaterIntake / 1000).toFixed(1)} lít). Rất tốt!`
                                : `Với ${(dailyWaterIntake / 1000).toFixed(1)} lít nước mỗi ngày, bạn có thể cần điều chỉnh. Mục tiêu cho bạn là khoảng ${(userInfo.WEIGHT * 30 / 1000).toFixed(1)} - ${(userInfo.WEIGHT * 40 / 1000).toFixed(1)} lít.`
                            }
                            {userInfo.ACTIVITY === "active" || userInfo.ACTIVITY === "very_active" ? " Do bạn có mức độ vận động cao, bạn cần uống thêm nước để bù đắp lượng mồ hôi mất đi." : ""}
                            {userInfo.ACTIVITY === "sedentary" ? " Ngay cả khi ít vận động, việc uống đủ nước vẫn rất quan trọng để duy trì trao đổi chất." : ""}
                        </Alert>
                    )}
                    </CardContent>
                </Card>

                    <Divider sx={{ my: 3 }} />

                    {/* Nước uống */}
                    <Box>
                    <Typography variant="h6" gutterBottom fontWeight="medium">
                        Lượng nước uống mỗi ngày
                    </Typography>
                    <FormControl fullWidth margin="normal">
                        {dailyWaterIntake !== '' && dailyWaterIntake !== null && userInfo.WEIGHT ? (
                            <Alert
                                severity={
                                    // Logic cho severity của Alert
                                    dailyWaterIntake > 0 && dailyWaterIntake <= 7000 ? // Nếu giá trị hợp lệ trong khoảng 1-7000ml
                                        (dailyWaterIntake / 1000 >= userInfo.WEIGHT * 0.03 && dailyWaterIntake / 1000 <= userInfo.WEIGHT * 0.04
                                            ? "success" // Đủ nước
                                            : "warning") // Thiếu/thừa nước nhưng vẫn trong khoảng hợp lý
                                        : "error" // Giá trị không hợp lệ (<=0 hoặc >7000)
                                }
                                sx={{ mt: 2 }}
                            >
                                {/* Logic cho nội dung của Alert */}
                                {dailyWaterIntake > 0 && dailyWaterIntake <= 7000 ? (
                                    dailyWaterIntake / 1000 >= userInfo.WEIGHT * 0.03 &&
                                    dailyWaterIntake / 1000 <= userInfo.WEIGHT * 0.04
                                        ? `Bạn đang uống đủ nước (${(dailyWaterIntake / 1000).toFixed(1)} lít/ngày).`
                                        : `Với ${(dailyWaterIntake / 1000).toFixed(1)} lít/ngày, bạn nên điều chỉnh. Mức lý tưởng là khoảng ${(userInfo.WEIGHT * 30 / 1000).toFixed(1)}–${(userInfo.WEIGHT * 40 / 1000).toFixed(1)} lít.`
                                ) : (
                                    'Lượng nước không hợp lệ, vui lòng nhập lại một số từ 1 đến 7000 ml.' // Thông báo lỗi rõ ràng hơn
                                )}
                            </Alert>
                        ) : null /* Không hiển thị Alert nếu dailyWaterIntake là rỗng hoặc null, hoặc userInfo.WEIGHT chưa có */ }
                    </FormControl>
                </Box>
            </div>
        );
    };

export default UserInfo;
