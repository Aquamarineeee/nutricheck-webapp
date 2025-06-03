import React, { useEffect, useState, useCallback, useContext } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Paper, Alert, Box, Grid, Card, CardContent,
    Button, Select, MenuItem, InputLabel, FormControl, Divider , TextField, Checkbox, ListItemText,
    Switch, FormControlLabel, Autocomplete, Chip 
} from "@mui/material";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import helo from "../../src/images/helo.gif"
import gainMealsData from "./gainMeals.json";
import maintainMealsData from "./maintainMeals.json"; 
import loseMealsData from "./loseMeals.json";
import OutlinedInput from '@mui/material/OutlinedInput'; 


// Dữ liệu thực đơn chuyển vào JSON riêng
const mealData = {
    gain: gainMealsData,
    lose: loseMealsData,
    maintain:maintainMealsData
};

const UserInfo = () => {
    const navigate = useNavigate();
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
    const [goal, setGoal] = useState("maintain");
    const [targetWeightChange, setTargetWeightChange] = useState(0);
    const [goalCalories, setGoalCalories] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [meals, setMeals] = useState([]);
    const [totalDailyCalories, setTotalDailyCalories] = useState(0);
    const [weightChangeError, setWeightChangeError] = useState("");
    const [mealGlobalCounts, setMealGlobalCounts] = useState({});
    const [minPricePerMeal, setMinPricePerMeal] = useState(0); // Chi phí tối thiểu mỗi bữa
    const [maxPricePerMeal, setMaxPricePerMeal] = useState(1000000); // Chi phí tối đa mỗi bữa (1,000,000 VND)
    const [priceError, setPriceError] = useState(""); // Để hiển thị lỗi nếu có
    const [preferredContinents, setPreferredContinents] = useState([]); // Ví dụ: ["Châu Á", "Châu Âu"]
    const [selectedConditions, setSelectedConditions] = useState([]); // Đổi tên và kiểu dữ liệu
    const [planGenerationCount, setPlanGenerationCount] = useState(0); // Đếm số lần tạo thực đơn

    const selectMealGreedy = useCallback((
    availableMeals,      // Danh sách các món ăn có sẵn (đã lọc theo calo, giá, thời gian bữa ăn)
    targetCalorie,       // Calo mục tiêu cho bữa ăn hiện tại
    currentPlanMealCounts, // Đếm số lần món ăn đã được dùng trong *kế hoạch hiện tại* (không quá 2)
    preferredContinents, // Châu lục ưu tiên của người dùng
    mealsAlreadySelectedInDay, // Set<string> chứa tên các món đã chọn trong 4 bữa của ngày hôm nay (để đảm bảo không trùng lặp)
    forceVietnameseThisSlot // boolean: Cờ này là TRUE nếu cần đảm bảo món Việt cho bữa này (do chưa có món Việt trong ngày)
) => {
    // 1. Lọc các món có thể sử dụng:
    //    - Chưa được chọn trong các bữa trước của ngày (đảm bảo không trùng lặp 4 bữa)
    //    - Số lần sử dụng trong kế hoạch hiện tại < 2
    let usableMeals = availableMeals.filter(meal =>
        !mealsAlreadySelectedInDay.has(meal.name) &&
        (currentPlanMealCounts[meal.name] || 0) < 2
    );

    if (usableMeals.length === 0) {
        return null; // Không còn món nào để chọn
    }
    const withinRange = usableMeals.filter(meal => meal.calories <= targetCalorie && meal.calories >= targetCalorie - 100);
    const equalOrSlightlyOver = usableMeals.filter(meal => meal.calories > targetCalorie && meal.calories - targetCalorie <= 100);
    const slightlyUnder = usableMeals.filter(meal => meal.calories < targetCalorie - 100 && targetCalorie - meal.calories <= 150);
    const farOff = usableMeals.filter(meal =>
        !withinRange.includes(meal) &&
        !equalOrSlightlyOver.includes(meal) &&
        !slightlyUnder.includes(meal)
    );
    const prioritizedList = [...withinRange, ...equalOrSlightlyOver, ...slightlyUnder, ...farOff];

    if (prioritizedList.length === 0) {
        return null;
    }

    // 2. Phân loại món ăn theo độ gần với calo mục tiêu (như code hiện tại của bạn)
    //    ... (giữ nguyên logic phân loại withinRange, equalOrSlightlyOver, etc.)
    //    const prioritizedList = [...withinRange, ...equalOrSlightlyOver, ...slightlyUnder, ...farOff];

    // 3. Sắp xếp danh sách ưu tiên: (Đây là phần quan trọng nhất)
    //    Sử dụng hàm sort() với nhiều tiêu chí, theo thứ tự ưu tiên giảm dần:
    prioritizedList.sort((a, b) => {
        const isAVietnamese = a.origin && a.origin.country === "Việt Nam";
        const isBVietnamese = b.origin && b.origin.country === "Việt Nam";
        const isAPreferredContinent = a.origin && preferredContinents.includes(a.origin.continent);
        const isBPreferredContinent = b.origin && preferredContinents.includes(b.origin.continent);

        // TIÊU CHÍ 1: Bắt buộc chọn món Việt (ưu tiên cao nhất)
        // Nếu `forceVietnameseThisSlot` là true, và một món là món Việt,
        // thì nó sẽ được ưu tiên hơn hẳn món không phải món Việt.
        if (forceVietnameseThisSlot) {
            if (isAVietnamese && !isBVietnamese) return -1; // A là Việt Nam, B không -> A lên trước
            if (!isAVietnamese && isBVietnamese) return 1;  // B là Việt Nam, A không -> B lên trước
            // Nếu cả A và B đều là món Việt, hoặc cả 2 không phải, thì tiếp tục xét tiêu chí sau
        }

        // TIÊU CHÍ 2: Ưu tiên món Việt theo checkbox hoặc châu lục ưu tiên (Nếu tiêu chí 1 không phân loại được)
        let regionalScoreA = 0;
        if (isAPreferredContinent) regionalScoreA += 50;

        let regionalScoreB = 0;
        if (isBPreferredContinent) regionalScoreB += 50;

        if (regionalScoreA !== regionalScoreB) {
            return regionalScoreB - regionalScoreA; // Giảm dần (điểm cao hơn lên trước)
        }

        // TIÊU CHÍ 3: Ít được sử dụng nhất (để tăng sự đa dạng)
        const usedA = mealGlobalCounts[a.name] || 0;
        const usedB = mealGlobalCounts[b.name] || 0;

        const globalUsedA = mealGlobalCounts[a.name] || 0;
        const globalUsedB = mealGlobalCounts[b.name] || 0;

        if (globalUsedA !== globalUsedB) {
            return globalUsedA - globalUsedB; // Tăng dần (món ít dùng global hơn lên trước)
            }

        // Nếu global usage như nhau, xét đến usage trong kế hoạch hiện tại (max 2 lần/ngày)
        if (usedA !== usedB) {
            return usedA - usedB; // Tăng dần (món ít dùng trong kế hoạch hiện tại hơn lên trước)
        }

        // TIÊU CHÍ 4: Gần với calo mục tiêu nhất (tiêu chí phụ cuối cùng)
        return Math.abs(a.calories - targetCalorie) - Math.abs(b.calories - targetCalorie);
    });

    return prioritizedList[0] || null; // Trả về món được ưu tiên cao nhất
}, [mealGlobalCounts, preferredContinents, vietnameseFoodPriority]); // Đảm bảo dependencies đúng



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
            const bmr =
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
            const activityMultiplier = activityFactor[userInfo.ACTIVITY] || 1.2; // Default to sedentary if not found
            let tdee = bmr * activityMultiplier; // Use activityMultiplier here

            const dailyCalories = bmr * (activityFactor[activity] || 1.2);
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
            return "Bạn tiêu thụ quá ít calo trong tuần, điều này có thể dẫn đến suy dinh dưỡng. Lượng calo quá thấp sẽ không đủ để cơ thể tạo năng lượng cần thiết cho các hoạt động cơ bản như hô hấp, tuần hoàn, và vận động. Hãy kiểm tra lại chế độ ăn của mình, bổ sung các thực phẩm giàu dinh dưỡng như rau, protein, và ngũ cốc nguyên hạt để cải thiện năng lượng hàng ngày. Người bệnh thừa cân, béo phì phải đối mặt với nhiều nguy cơ sức khỏe như: bệnh tim, cao huyết áp, đột quỵ, viêm khớp, giảm khả năng sinh sản, gan nhiễm mỡ không do rượu, đái tháo đường type 2, hội chứng ngưng thở khi ngủ… Đặc biệt, béo phì được cho là có liên quan đến 13 loại ung thư, gồm: ung thư buồng trứng, ung thư gan, ung thư não, ung thư tuyến tụy…";
        } else if (totalCalories > minCaloriesWeek * 1.2) {
            return "Bạn tiêu thụ quá nhiều calo trong tuần, điều này có thể dẫn đến tăng cân và các bệnh mãn tính. Khi lượng calo nạp vào vượt quá mức cơ thể cần, năng lượng dư thừa sẽ chuyển hóa thành mỡ, tích tụ lâu ngày gây béo phì. Điều này làm tăng nguy cơ mắc các bệnh như tiểu đường, cao huyết áp, và tim mạch. Người bệnh thừa cân, béo phì phải đối mặt với nhiều nguy cơ sức khỏe như: bệnh tim, cao huyết áp, đột quỵ, viêm khớp, giảm khả năng sinh sản, gan nhiễm mỡ không do rượu, đái tháo đường type 2, hội chứng ngưng thở khi ngủ… Đặc biệt, béo phì được cho là có liên quan đến 13 loại ung thư, gồm: ung thư buồng trứng, ung thư gan, ung thư não, ung thư tuyến tụy…";
        } else {
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
       if (selectedConditions.length === 0) {
            enqueueSnackbar("Vui lòng chọn hoặc nhập ít nhất một tình trạng sức khỏe.", { variant: "warning" });
            setFeedback("");
            return;
    }

        let fullFeedback = "";
        selectedConditions.forEach(condition => {
            let result = `Nếu bạn đang bị ${condition}, với mức calo tiêu thụ như trên thì:\n`;

            if (conditions.calorie_deficit.includes(condition)) {
                result += "-> Bạn có thể cần tăng lượng calo nạp vào để cải thiện tình trạng sức khỏe.\n";
            } else if (conditions.calorie_surplus.includes(condition)) {
                result += "\n-> Bạn nên giảm lượng calo tiêu thụ để tránh các biến chứng nghiêm trọng.\n";
            } else {
                // Trường hợp bệnh do người dùng nhập vào, không có trong danh sách
                result += "\n-> Đây là tình trạng sức khỏe bạn đã nhập. Hãy tham khảo ý kiến chuyên gia dinh dưỡng để có lời khuyên phù hợp.\n";
            }

            result += "Dưới đây là gợi ý thực đơn phù hợp cho bạn:\n";
            result += suggestMenu(condition); // Hàm suggestMenu vẫn hoạt động với từng bệnh riêng lẻ
            fullFeedback += result + "\n\n---\n\n"; // Thêm dấu phân cách giữa các bệnh
        });

        setFeedback(fullFeedback);
    };
    // Hàm chọn món ăn cải tiến
const selectMealForTime = (availableMeals, targetCalories, usedMeals, mealTime) => {
  // Lọc món phù hợp với bữa ăn
  const timeMapping = {
    "Sáng": ["breakfast"],
    "Trưa": ["lunch"],
    "Chiều": ["afternoon"],
    "Tối": ["dinner"]
  };
  
  const validTimes = timeMapping[mealTime] || [];
  const timeSpecificMeals = availableMeals.filter(meal => 
    meal.meal_time?.some(time => validTimes.includes(time))
  );

  // Lọc món chưa dùng
  const eligibleMeals = timeSpecificMeals.filter(meal => !usedMeals.has(meal.name));

  // Tìm món có calo gần nhất với target
  let bestMeal = null;
  let minDiff = Infinity;

  for (const meal of eligibleMeals) {
    const diff = Math.abs(meal.calories - targetCalories);
    if (diff < minDiff) {
      minDiff = diff;
      bestMeal = meal;
    }
  }

  // Fallback: nếu không tìm thấy món phù hợp thời gian
  if (!bestMeal && availableMeals.length > 0) {
    minDiff = Infinity;
    for (const meal of availableMeals) {
      if (!usedMeals.has(meal.name)) {
        const diff = Math.abs(meal.calories - targetCalories);
        if (diff < minDiff) {
          minDiff = diff;
          bestMeal = meal;
        }
      }
    }
  }

  return bestMeal;
};

// Hàm tạo thực đơn mới
const generateBalancedMealPlan = useCallback((goal, minPricePerMeal, maxPricePerMeal, preferredContinents) => {
    const selectedMeals = [];
    const currentPlanMealCounts = {}; // Theo dõi số lần món ăn xuất hiện trong plan 4 bữa hiện tại
    const newMealGlobalCounts = { ...mealGlobalCounts }; // Sao chép global counts để cập nhật

    const mealsAlreadySelectedInDay = new Set(); // Theo dõi món đã được chọn trong ngày để đảm bảo duy nhất

    let isVietnameseMealAdded = false; // Theo dõi xem đã có món Việt nào được thêm vào chưa

    // Lấy dữ liệu món ăn dựa trên mục tiêu
    const allMeals = mealData[goal] || [];

    const mealTimes = ["Bữa sáng", "Bữa trưa", "Bữa chiều", "Bữa tối"];

    for (let i = 0; i < mealTimes.length; i++) {
        // Định nghĩa targetCalories và mealsToConsider BÊN TRONG VÒNG LẶP
        // Đảm bảo chúng được cập nhật cho mỗi bữa ăn
        const targetCalories = calculateTargetCaloriesForMealTime(userInfo.bmr, goal, i, dailyCaloriesConsumed, totalCalories);

        let mealsToConsider = allMeals.filter(meal => {
            const isWithinPriceRange = meal.price >= minPricePerMeal && meal.price <= maxPricePerMeal;
            const isWithinCalorieRange = meal.calories >= targetCalories * 0.7 && meal.calories <= targetCalories * 1.3;
            return isWithinPriceRange && isWithinCalorieRange;
        });

        let forceVietnameseForThisSlot = false;
        if (!isVietnameseMealAdded) {
            const isLastMealSlot = (i === mealTimes.length - 1);
            const availableVietnameseMealsInConsideration = mealsToConsider.filter(m =>
                m.origin?.country === "Việt Nam" && !mealsAlreadySelectedInDay.has(m.name)
            );

            if (availableVietnameseMealsInConsideration.length > 0) {
                forceVietnameseForThisSlot = true;
            } else if (isLastMealSlot) {
                const anyRemainingVietnameseInAllMeals = allMeals.some(m =>
                    m.origin?.country === "Việt Nam" && !mealsAlreadySelectedInDay.has(m.name)
                );
                if (anyRemainingVietnameseInAllMeals) {
                    forceVietnameseForThisSlot = true;
                }
            }
        }

        const selectedMeal = selectMealGreedy(
            mealsToConsider,
            targetCalories,
            currentPlanMealCounts,
            preferredContinents,
            mealsAlreadySelectedInDay,
            forceVietnameseForThisSlot
        );

        if (selectedMeal) {
            currentPlanMealCounts[selectedMeal.name] = (currentPlanMealCounts[selectedMeal.name] || 0) + 1;
            newMealGlobalCounts[selectedMeal.name] = (newMealGlobalCounts[selectedMeal.name] || 0) + 1;
            mealsAlreadySelectedInDay.add(selectedMeal.name);

            if (selectedMeal.origin && selectedMeal.origin.country === "Việt Nam") {
                isVietnameseMealAdded = true;
            }

            selectedMeals.push({
                ...selectedMeal,
                meal_time: mealTimes[i],
            });
        } else {
            // FALLBACK LOGIC - ĐẢM BẢO CÓ MÓN VIỆT BẮT BUỘC VÀ CÁC TRƯỜNG HỢP KHÁC
            let finalFallbackMeal = null;

            if (forceVietnameseForThisSlot) {
                // Nếu chúng ta đang cố gắng ép buộc một món Việt nhưng selectMealGreedy không tìm thấy
                // Tìm món Việt duy nhất từ TẤT CẢ các món ăn, không xét calo/giá ban đầu
                finalFallbackMeal = allMeals.find(meal =>
                    meal.origin?.country === "Việt Nam" &&
                    !mealsAlreadySelectedInDay.has(meal.name) &&
                    (currentPlanMealCounts[meal.name] || 0) < 2
                );
                if (!finalFallbackMeal) {
                    enqueueSnackbar("Không thể tìm được món ăn Việt Nam duy nhất cho thực đơn này trong danh sách hiện có.", { variant: "warning" });
                }
            }

            // Nếu không tìm được món Việt bắt buộc hoặc không cần món Việt bắt buộc,
            // thì tìm món ăn bất kỳ làm fallback (không trùng trong ngày, không quá 2 lần trong plan)
            if (!finalFallbackMeal) {
                finalFallbackMeal = allMeals.find(meal =>
                    !mealsAlreadySelectedInDay.has(meal.name) &&
                    (currentPlanMealCounts[meal.name] || 0) < 2
                );
            }

            if (finalFallbackMeal) {
                currentPlanMealCounts[finalFallbackMeal.name] = (currentPlanMealCounts[finalFallbackMeal.name] || 0) + 1;
                newMealGlobalCounts[finalFallbackMeal.name] = (newMealGlobalCounts[finalFallbackMeal.name] || 0) + 1;
                mealsAlreadySelectedInDay.add(finalFallbackMeal.name);

                if (finalFallbackMeal.origin && finalFallbackMeal.origin.country === "Việt Nam") {
                    isVietnameseMealAdded = true;
                }
                selectedMeals.push({
                    ...finalFallbackMeal,
                    meal_time: mealTimes[i],
                    notes: (forceVietnameseForThisSlot && finalFallbackMeal.origin?.country === "Việt Nam")
                        ? "Món ăn Việt Nam bắt buộc (được chọn để đảm bảo tính duy nhất và yêu cầu)."
                        : "Món ăn thay thế do không tìm được lựa chọn phù hợp."
                });
            } else {
                // Nếu không tìm được món nào, thêm một placeholder
                selectedMeals.push({
                    name: "Món ăn chưa xác định",
                    calories: 0,
                    price: 0,
                    origin: { country: "Không rõ", continent: "Không rõ" },
                    meal_time: mealTimes[i],
                    image: "", // Hoặc một placeholder image
                    notes: "Không tìm được món ăn phù hợp với yêu cầu."
                });
                enqueueSnackbar("Không tìm được món ăn phù hợp cho một bữa ăn. Vui lòng thử lại với các tiêu chí khác.", { variant: "error" });
            }
        }
    }

    // Cập nhật mealGlobalCounts và planGenerationCount sau khi tạo xong 4 bữa
    setMealGlobalCounts(newMealGlobalCounts);

    setPlanGenerationCount(prevCount => {
        const newCount = prevCount + 1;
        const RESET_THRESHOLD = 7;
        if (newCount % RESET_THRESHOLD === 0) {
            enqueueSnackbar("Làm mới danh sách ưu tiên món ăn để tăng sự đa dạng!", { variant: "info", autoHideDuration: 3000 });
            setMealGlobalCounts(prevCounts => {
                const resetCounts = {};
                for (const mealName in prevCounts) {
                    resetCounts[mealName] = Math.max(0, Math.floor(prevCounts[mealName] / 2));
                }
                return resetCounts;
            });
        }
        return newCount;
    });

    return selectedMeals;
}, [goal, mealGlobalCounts, minPricePerMeal, maxPricePerMeal, preferredContinents, selectMealGreedy, userInfo.bmr, dailyCaloriesConsumed, totalCalories, allMeals, enqueueSnackbar]); // BỎ vietnameseFoodPriority khỏi đây
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
        preferredContinents, // Truyền tham số này
        vietnameseFoodPriority, // Đã có từ trước
        minPricePerMeal, // Đã có từ trước
        maxPricePerMeal // Đã có từ trước
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
    // useEffect(() => {
    //     if (totalDailyCalories > 0 && userInfo?.WEIGHT) {
    //         generateMealPlan();
    //     }
    // }, [totalDailyCalories, goal, userInfo]);


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
        image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        price: 0, // Thêm giá trị mặc định ở đây
        origin: { // Thêm giá trị mặc định ở đây
            continent: "N/A",
            country: "N/A"
        }
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
                    {safeMeal.price !== undefined && <Typography>Giá: {safeMeal.price.toLocaleString('vi-VN')} VND</Typography>}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {safeMeal.origin && safeMeal.origin.country && <Typography>Quốc gia: {safeMeal.origin.country}</Typography>}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {safeMeal.origin && safeMeal.origin.continent && <Typography>Châu lục: {safeMeal.origin.continent}</Typography>}
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
        const totalActualCalories = meals.reduce((sum, m) => sum + (m?.calories || 0), 0);
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
                </Box>
            )}
            </Box>
        );
    };

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
            <Box textAlign="center" mb={4}>
                <Typography variant="h4" style={{ fontWeight: "bold" }}>Trang cá nhân</Typography>
            </Box>

            {/* User Info */}
            {userInfo && (
                <TableContainer component={Paper} style={{ margin: "20px auto", maxWidth: "800px" }} className="fade-in">
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
                                <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}><strong>Tên:</strong></TableCell>
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
                                <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}><strong>Cân nặng:</strong></TableCell>
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
                        <FormControl fullWidth margin="normal">
                                <TextField
                                    type="number"
                                    label="Chi phí tối thiểu mỗi bữa (VND)"
                                    value={minPricePerMeal}
                                    onChange={(e) => {
                                        const value = Math.max(0, parseInt(e.target.value) || 0); // Đảm bảo min >= 0
                                        setMinPricePerMeal(value);
                                        // Logic kiểm tra lỗi
                                        if (value < 0 || value > 1000000 || value >= maxPricePerMeal) {
                                            setPriceError("Chi phí tối thiểu phải từ 0 đến 1.000.000 VND và nhỏ hơn chi phí tối đa.");
                                        } else {
                                            setPriceError("");
                                        }
                                    }}
                                    error={!!priceError} // Bật trạng thái lỗi nếu có priceError
                                    helperText={priceError} // Hiển thị thông báo lỗi
                                    inputProps={{ min: 0, max: 1000000 }} // Giới hạn input
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    type="number"
                                    label="Chi phí tối đa mỗi bữa (VND)"
                                    value={maxPricePerMeal}
                                    onChange={(e) => {
                                        const value = Math.min(1000000, parseInt(e.target.value) || 0); // Đảm bảo max <= 1,000,000
                                        setMaxPricePerMeal(value);
                                        // Logic kiểm tra lỗi
                                        if (value < minPricePerMeal + 10000 || value > 1000000) {
                                            setPriceError("Chi phí tối đa phải lớn hơn chi phí tối thiểu ít nhất 10.000 VND và không quá 1.000.000 VND.");
                                        } else {
                                            setPriceError("");
                                        }
                                    }}
                                    error={!!priceError}
                                    helperText={priceError}
                                    inputProps={{ min: 0, max: 1000000 }} // Giới hạn input
                                />
                            </FormControl>
                         {/* Checkbox/Switch để ưu tiên món Việt */}
                                

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

                    </CardContent>
                </Card>
                </Grid>
            </Grid>

            <Divider style={{ margin: "40px 0" }} />

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
        </div>
    );
};

export default UserInfo;
