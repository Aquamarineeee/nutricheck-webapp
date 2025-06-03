import React, { useEffect, useState, useCallback, useContext } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Paper, Alert, Box, Grid, Card, CardContent,
    Button, Select, MenuItem, InputLabel, FormControl, Divider , TextField
} from "@mui/material";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import helo from "../../src/images/helo.gif"
import gainMealsData from "./gainMeals.json";
import maintainMealsData from "./maintainMeals.json"; 
import loseMealsData from "./loseMeals.json";       
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
    const [selectedCondition, setSelectedCondition] = useState("");
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


    // Hàm chọn món ăn dựa trên calo mục tiêu (thuật toán tham lam)
const selectMealGreedy = (
    availableMeals,
    targetCalorie,
    mealCounts,
    usedMealsSet,
    vnIncluded,
    minPrice,
    maxPrice,
    preferredContinent,
    mealIndex
) => {
    const priceFiltered = availableMeals.filter(m =>
        m.price &&
        m.price >= minPrice &&
        m.price <= maxPrice
    );

    const usableMeals = priceFiltered.filter(meal => !usedMealsSet.has(meal.name));

    const vnMeals = usableMeals.filter(m => m.origin?.country === "Việt Nam");
    const continentMeals = preferredContinent
        ? usableMeals.filter(m => m.origin?.continent === preferredContinent)
        : usableMeals;

    let prioritized;
    if (!vnIncluded && vnMeals.length > 0 && mealIndex < 3) {
        prioritized = vnMeals;
    } else {
        prioritized = continentMeals.length > 0 ? continentMeals : usableMeals;
    }

    let pool = prioritized.filter(m => Math.abs(m.calories - targetCalorie) <= 150);
    if (pool.length === 0) {
        pool = prioritized.filter(m => Math.abs(m.calories - targetCalorie) <= 200);
    }
    if (pool.length === 0) {
        pool = prioritized;
    }

    // 🧠 Heuristic: sort theo ít dùng hơn và gần target calo hơn
    pool.sort((a, b) => {
        const usedA = mealCounts[a.name] || 0;
        const usedB = mealCounts[b.name] || 0;
        const diffA = Math.abs(a.calories - targetCalorie);
        const diffB = Math.abs(b.calories - targetCalorie);
        return usedA - usedB || diffA - diffB;
    });

    // ✅ Duyệt toàn bộ, lấy món đầu tiên chưa dùng
    for (let i = 0; i < pool.length; i++) {
        const candidate = pool[i];
        if (!usedMealsSet.has(candidate.name)) {
            return candidate;
        }
    }

    // ❗Nếu tất cả đã dùng trong plan hiện tại → fallback random
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
        let result = `Nếu bạn đang bị ${selectedCondition}, với mức calo tiêu thụ như trên thì:\n`;

        if (conditions.calorie_deficit.includes(selectedCondition)) {
            result += "-> Bạn có thể cần tăng lượng calo nạp vào để cải thiện tình trạng sức khỏe.\n";
        } else if (conditions.calorie_surplus.includes(selectedCondition)) {
            result += "\n-> Bạn nên giảm lượng calo tiêu thụ để tránh các biến chứng nghiêm trọng.\n";
        }

        result += "Dưới đây là gợi ý thực đơn phù hợp cho bạn:\n";
        result += suggestMenu(selectedCondition);

        setFeedback(result);
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
    const generateBalancedMealPlan = (totalDailyCalories, goal, minPrice,maxPrice, preferredContinent) => {
        const mealTimes = ["Sáng", "Trưa", "Chiều", "Tối"];
        const allMeals = mealData[goal] || mealData.maintain;
        const selectedMeals = [];
        const usedMealsInPlan = new Set(); // Theo dõi các món đã được chọn trong kế hoạch hiện tại
        const mealCounts = { ...mealGlobalCounts };

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

            // ✅ Kiểm tra đã có món Việt chưa trong thực đơn này
            const vnIncluded = [...usedMealsInPlan].some(name => {
                const meal = allMeals.find(m => m.name === name);
                return meal?.origin?.country === "Việt Nam";
            });

            // ✅ Gọi greedy đã merge
            const selectedMeal = selectMealGreedy(
                availableMeals,
                targetCalories,
                mealCounts,
                usedMealsInPlan,
                vnIncluded,
                minPrice,
                maxPrice,
                preferredContinent,
                i // i là index bữa ăn (0-3)
                );

            if (selectedMeal) {
                usedMealsInPlan.add(selectedMeal.name);
                mealCounts[selectedMeal.name] = (mealCounts[selectedMeal.name] || 0) + 1;
                setMealGlobalCounts(prev => ({
                    ...prev,
                    [selectedMeal.name]: (prev[selectedMeal.name] || 0) + 1
                }));

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
            preferredContinent
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
                <Typography>Calo: {safeMeal.calories.toFixed(0)} kcal</Typography>
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
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Ưu tiên châu lục</InputLabel>
                                <Select
                                    value={preferredContinent}
                                    onChange={(e) => setPreferredContinent(e.target.value)}
                                >
                                    <MenuItem value="">Không chọn</MenuItem>
                                    <MenuItem value="Châu Á">Châu Á</MenuItem>
                                    <MenuItem value="Châu Âu">Châu Âu</MenuItem>
                                    <MenuItem value="Châu Mỹ">Châu Mỹ</MenuItem>
                                    <MenuItem value="Châu Phi">Châu Phi</MenuItem>
                                    <MenuItem value="Châu Úc">Châu Úc</MenuItem>
                                </Select>
                            </FormControl>
                            


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
                    <InputLabel>Chọn tình trạng sức khỏe bạn đang gặp phải</InputLabel>
                    <Select
                        value={selectedCondition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                        label="Chọn tình trạng sức khỏe bạn đang gặp phải"
                    >
                        <MenuItem value="">-- Chọn --</MenuItem>
                        {Object.values(conditions).flat().sort().map((condition) => (
                            <MenuItem key={condition} value={condition}>
                                {condition}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!selectedCondition}>
                    Nhận gợi ý
                </Button>

                {feedback && (
                    <Alert severity="success" style={{ marginTop: "20px", whiteSpace: "pre-line" }}>
                        {feedback}
                    </Alert>
                )}
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
        </div>
    );
};

export default UserInfo;
