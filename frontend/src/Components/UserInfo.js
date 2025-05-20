import React, { useEffect, useState, useContext } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Paper, Alert, Box, Grid, Card, CardContent,
    Button, Select, MenuItem, InputLabel, FormControl, Divider , TextField
} from "@mui/material";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";

// Dữ liệu thực đơn chuyển vào JSON riêng
const mealData = {
    gain: [
        {
            name: "Sữa chua với trái cây",
            calories: 300,
            protein: 10,
            fat: 5,
            carbs: 45,
            weight: 200,
            image: "https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            name: "Cơm gà xào rau",
            calories: 500,
            protein: 30,
            fat: 15,
            carbs: 60,
            weight: 350,
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            name: "Bánh mì kẹp thịt",
            calories: 450,
            protein: 25,
            fat: 20,
            carbs: 45,
            weight: 250,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            name: "Nước ép bơ",
            calories: 200,
            protein: 2,
            fat: 15,
            carbs: 10,
            weight: 300,
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            name: "Mỳ Ý sốt kem",
            calories: 700,
            protein: 25,
            fat: 30,
            carbs: 80,
            weight: 400,
            image: "https://images.unsplash.com/photo-1608212589631-123704ae8da6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        }
    ],
    lose: [
        {
            name: "Salad rau xanh",
            calories: 150,
            protein: 5,
            fat: 5,
            carbs: 20,
            weight: 200,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            name: "Cá hồi nướng",
            calories: 200,
            protein: 25,
            fat: 10,
            carbs: 0,
            weight: 150,
            image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            name: "Gà luộc",
            calories: 180,
            protein: 30,
            fat: 5,
            carbs: 0,
            weight: 150,
            image: "https://images.unsplash.com/photo-1601050690117-64b6d2f7f5e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            name: "Trái cây tươi",
            calories: 100,
            protein: 1,
            fat: 0,
            carbs: 25,
            weight: 150,
            image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            name: "Soup bí đỏ",
            calories: 120,
            protein: 3,
            fat: 5,
            carbs: 15,
            weight: 250,
            image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        }
    ],
    maintain: [
        {
            name: "Cơm với thịt bò xào",
            calories: 350,
            protein: 25,
            fat: 15,
            carbs: 30,
            weight: 300,
            image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            name: "Mỳ Ý sốt cà chua",
            calories: 450,
            protein: 15,
            fat: 10,
            carbs: 70,
            weight: 350,
            image: "https://images.unsplash.com/photo-1608212589631-123704ae8da6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            name: "Cháo yến mạch",
            calories: 200,
            protein: 8,
            fat: 5,
            carbs: 30,
            weight: 250,
            image: "https://images.unsplash.com/photo-1606313564200-75b0d8a0a1c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            name: "Trái cây trộn",
            calories: 150,
            protein: 2,
            fat: 0,
            carbs: 35,
            weight: 200,
            image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            name: "Gà nướng",
            calories: 400,
            protein: 40,
            fat: 20,
            carbs: 5,
            weight: 250,
            image: "https://images.unsplash.com/photo-1601050690117-64b6d2f7f5e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        }
    ]
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

    // Hàm chọn món ăn dựa trên calo mục tiêu (thuật toán tham lam)
    const selectMealGreedy = (availableMeals, targetCalorie, mealCounts) => {
        let bestMeal = null;
        let minDiff = Infinity;
        let bestDiff = Infinity; // For prioritizing "nice" numbers

        // Sort available meals by calories to help with greedy selection (optional, but can make it slightly more deterministic)
        const sortedMeals = [...availableMeals].sort((a, b) => a.calories - b.calories);

        // First pass: find the best exact match or closest "nice" number within abs 100
        for (const meal of sortedMeals) {
            // Check if meal can be chosen (max 2 times)
            if ((mealCounts[meal.name] || 0) < 2) {
                const diff = Math.abs(meal.calories - targetCalorie);

                // Prioritize exact match
                if (diff === 0) {
                    return meal;
                }

                // Prioritize "nice" numbers (multiples of 50 or 100) within 100 diff
                if (diff <= 100) {
                    if (meal.calories % 100 === 0 || meal.calories % 50 === 0) {
                        if (diff < bestDiff) {
                            bestDiff = diff;
                            bestMeal = meal;
                        }
                    } else if (diff < minDiff && bestMeal === null) { // If no nice number found yet, take the closest
                        minDiff = diff;
                        bestMeal = meal;
                    }
                }
            }
        }

        // Second pass: if no "nice" number or exact match found within 100, find the closest within 100
        if (bestMeal === null) {
            minDiff = Infinity; // Reset for closest
            for (const meal of sortedMeals) {
                if ((mealCounts[meal.name] || 0) < 2) {
                    const diff = Math.abs(meal.calories - targetCalorie);
                    if (diff <= 100 && diff < minDiff) {
                        minDiff = diff;
                        bestMeal = meal;
                    }
                }
            }
        }
        
        // Fallback: if no suitable meal found within abs 100, pick the closest one (even if outside 100 range)
        if (bestMeal === null) {
            minDiff = Infinity;
            for (const meal of sortedMeals) {
                if ((mealCounts[meal.name] || 0) < 2) {
                    const diff = Math.abs(meal.calories - targetCalorie);
                    if (diff < minDiff) {
                        minDiff = diff;
                        bestMeal = meal;
                    }
                }
            }
        }

        // If still no meal, return a random one as a last resort (should not happen with a diverse meal list)
        if (bestMeal === null && availableMeals.length > 0) {
            return availableMeals[Math.floor(Math.random() * availableMeals.length)];
        }

        return bestMeal;
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

    const calculateGoalCalories = () => {
        let adjustedCalories = minCaloriesDay;

        if (goal === "lose") {
            adjustedCalories = minCaloriesDay - (targetWeightChange * 550);
        } else if (goal === "gain") {
            adjustedCalories = minCaloriesDay + (targetWeightChange * 550);
        }

        setGoalCalories(adjustedCalories);
        setTotalDailyCalories(adjustedCalories); // Thêm dòng này
    };

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

    const generateRandomMealPlan = (totalCalories) => {
        const mealTimes = ["Sáng", "Trưa", "Chiều", "Tối"];
        const meals = [];
        let remainingCalories = totalCalories;
        const goalMeals = mealData[goal] || mealData.maintain;
        const mealCounts = {}; // Theo dõi số lần mỗi món ăn được chọn

        // Calculate average calories per meal
        const avgCaloriesPerMeal = totalCalories / mealTimes.length;

        for (let i = 0; i < mealTimes.length; i++) {
            let targetCalorieForMeal = avgCaloriesPerMeal;
            
            // Adjust target calories for the last meal to use up remaining calories
            if (i === mealTimes.length - 1) {
                targetCalorieForMeal = remainingCalories;
            } else {
                // For other meals, try to get a value close to avg but allow some variance
                // To distribute remaining calories more evenly
                const maxAllowedForMeal = remainingCalories - (mealTimes.length - 1 - i) * 100; // Ensure remaining meals have at least 100 cal
                const minAllowedForMeal = 100;

                targetCalorieForMeal = Math.max(minAllowedForMeal, Math.min(maxAllowedForMeal, avgCaloriesPerMeal));
            }


            let selectedMeal = selectMealGreedy(goalMeals, targetCalorieForMeal, mealCounts);

            if (selectedMeal) {
                // Adjust meal macros based on the target calories for this meal
                const scale = targetCalorieForMeal / selectedMeal.calories;

                const adjustedMeal = {
                    ...selectedMeal,
                    calories: targetCalorieForMeal, // Use the target calorie as the actual for this meal
                    protein: Math.round(selectedMeal.protein * scale),
                    fat: Math.round(selectedMeal.fat * scale),
                    carbs: Math.round(selectedMeal.carbs * scale),
                    weight: Math.round(selectedMeal.weight * scale)
                };

                meals.push(adjustedMeal);
                remainingCalories -= targetCalorieForMeal;

                // Update meal count
                mealCounts[selectedMeal.name] = (mealCounts[selectedMeal.name] || 0) + 1;
            } else {
                // Fallback if no meal could be selected (should be rare with a good meal list)
                console.warn("Could not find a suitable meal for meal time:", mealTimes[i], "Target calories:", targetCalorieForMeal);
                meals.push({
                    name: "Món ăn chưa xác định",
                    calories: 0,
                    protein: 0,
                    fat: 0,
                    carbs: 0,
                    weight: 0,
                    image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                });
            }
        }
        
        // After generating all meals, re-distribute remaining calories if any
        // This handles cases where precise matches weren't found for each meal and there's a deficit/surplus
        let finalTotalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
        let calorieDifference = totalCalories - finalTotalCalories;

        if (Math.abs(calorieDifference) > 0.1) { // If there's a significant difference
            // Distribute the difference across meals.
            // For simplicity, we'll add/subtract from the meal with the largest calorie value,
            // or distribute proportionally. Here, we'll try to add to the first meal that can accommodate.
            for (let i = 0; i < meals.length && Math.abs(calorieDifference) > 0.1; i++) {
                const meal = meals[i];
                if (Math.abs(calorieDifference) <= 100) { // Only adjust if difference is within 100 abs
                    meal.calories += calorieDifference;
                    // Recalculate other macros based on new calorie
                    const originalMeal = (mealData[goal] || mealData.maintain).find(m => m.name === meal.name);
                    if (originalMeal && originalMeal.calories > 0) {
                        const scale = meal.calories / originalMeal.calories;
                        meal.protein = Math.round(originalMeal.protein * scale);
                        meal.fat = Math.round(originalMeal.fat * scale);
                        meal.carbs = Math.round(originalMeal.carbs * scale);
                        meal.weight = Math.round(originalMeal.weight * scale);
                    }
                    calorieDifference = 0; // Difference absorbed
                }
            }
        }

        return meals;
    };


    useEffect(() => {
        if (totalDailyCalories > 0) {
            setMeals(generateRandomMealPlan(totalDailyCalories));
        }
    }, [totalDailyCalories, goal]); // Add goal to dependency array to re-generate on goal change


    const renderMealPlan = () => {
        return (
            <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                    Thực đơn mẫu cho mục tiêu {goal === "gain" ? "tăng cân" : goal === "lose" ? "giảm cân" : "giữ cân"}
                    &nbsp;({totalDailyCalories.toFixed(0)} calo/ngày)
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setMeals(generateRandomMealPlan(totalDailyCalories))}
                        style={{ marginLeft: '10px' }}
                    >
                        Tạo thực đơn mới
                    </Button>
                </Typography>

                <Grid container spacing={2}>
                    {["Sáng", "Trưa", "Chiều", "Tối"].map((time, index) => {
                        const meal = meals[index] || {
                            name: "Đang tạo thực đơn...",
                            calories: 0,
                            protein: 0,
                            fat: 0,
                            carbs: 0,
                            weight: 0,
                            image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                        };
                        return (
                            <Grid item xs={12} sm={6} md={3} key={time}>
                                <Card className="fade-in">
                                    <CardContent>
                                        <Typography variant="subtitle1" color="primary">{time}</Typography>
                                        <Box
                                            style={{
                                                height: '150px',
                                                backgroundImage: `url(${meal.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderRadius: '8px',
                                                marginBottom: '10px'
                                            }}
                                        />
                                        <Typography variant="h6">{meal.name}</Typography>
                                        <Typography>Calo: {meal.calories.toFixed(0)}</Typography>
                                        <Typography>Protein: {meal.protein.toFixed(1)}g</Typography>
                                        <Typography>Chất béo: {meal.fat.toFixed(1)}g</Typography>
                                        <Typography>Carbs: {meal.carbs.toFixed(1)}g</Typography>
                                        <Typography>Khối lượng: {meal.weight.toFixed(1)}g</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                <Box mt={2}>
                    <Typography variant="body1">
                        <strong>Tổng lượng dinh dưỡng trong ngày:</strong>
                    </Typography>
                    <Typography>Calo: {meals.reduce((sum, m) => sum + m.calories, 0).toFixed(0)}</Typography>
                    <Typography>Protein: {meals.reduce((sum, m) => sum + m.protein, 0).toFixed(1)}g</Typography>
                    <Typography>Chất béo: {meals.reduce((sum, m) => sum + m.fat, 0).toFixed(1)}g</Typography>
                    <Typography>Carbs: {meals.reduce((sum, m) => sum + m.carbs, 0).toFixed(1)}g</Typography>
                </Box>
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
                            src="https://www.canva.com/design/DAGn9q-vDKM/gkX1Xj5RuqTR5ix7Omdb4g/view?utm_content=DAGn9q-vDKM&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hf21527cd1b"
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
