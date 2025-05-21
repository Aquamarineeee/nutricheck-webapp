import React, { useEffect, useState, useContext, useRef } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Paper, Alert, Box, Grid, Card, CardContent,
    Button, Select, MenuItem, InputLabel, FormControl, Divider, TextField
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import gainMealsData from "./gainMeals.json";
import maintainMealsData from "./maintainMeals.json"; 
import loseMealsData from "./loseMeals.json";       


// Dữ liệu thực đơn chuyển vào JSON riêng
const mealData = {
    gain: gainMealsData,
    lose: loseMealsData,       
    maintain: maintainMealsData 
};

// Component cho từng bữa ăn trong thực đơn
const MealCard = ({ meal }) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // Only trigger once when it comes into view
        threshold: 0.1, // Trigger when 10% of the item is visible
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{ height: '100%' }} // Đảm bảo Card có chiều cao linh hoạt
        >
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {meal.mealTime}: {meal.name}
                    </Typography>
                    {meal.image && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                            <img src={meal.image} alt={meal.name} style={{ maxWidth: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                        </Box>
                    )}
                    <Typography variant="body2" color="text.secondary">
                        Calo: {meal.actualCalories ? meal.actualCalories.toFixed(0) : meal.calories.toFixed(0)} kcal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Protein: {meal.protein.toFixed(1)} g
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Chất béo: {meal.fat.toFixed(1)} g
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Carbs: {meal.carbs.toFixed(1)} g
                    </Typography>
                    {meal.recipe_link && (
                        <Typography variant="body2" color="primary" component="a" href={meal.recipe_link} target="_blank" rel="noopener noreferrer" sx={{ mt: 1, display: 'block' }}>
                            Xem công thức
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
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
    const [feedback, setFeedback] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("");
    const [goal, setGoal] = useState("maintain");
    const [targetWeightChange, setTargetWeightChange] = useState(0);
    const [goalCalories, setGoalCalories] = useState(0);
    const [showWelcome, setShowWelcome] = useState(true);
    const [mealsPlan, setMealsPlan] = useState([]); // Đổi tên để tránh nhầm lẫn với biến 'meals' cục bộ
    const [totalDailyCalories, setTotalDailyCalories] = useState(0);
    const [weightChangeError, setWeightChangeError] = useState("");

    const snackbarShownRef = useRef(false); // Ref để kiểm soát snackbar trong useEffect

    // Hàm chọn món ăn dựa trên calo mục tiêu (thuật toán tham lam)
    const selectMealGreedy = (availableMeals, targetCalorie, mealCounts) => {
        let bestMeal = null;
        let minDiff = Infinity;

        // Ưu tiên các bữa ăn chưa được sử dụng quá 2 lần, sau đó tìm gần nhất
        const eligibleMeals = availableMeals.filter(meal => (mealCounts[meal.name] || 0) < 2);

        // Sort eligible meals by calories to help with greedy selection
        const sortedMeals = [...eligibleMeals].sort((a, b) => a.calories - b.calories);

        for (const meal of sortedMeals) {
            const diff = Math.abs(meal.calories - targetCalorie);

            // Prioritize meals that are closer to the target and avoid overshooting significantly
            if (diff < minDiff) {
                minDiff = diff;
                bestMeal = meal;
            }
        }
        
        // Fallback: if no eligible meal found (all used twice), pick from all available meals
        if (!bestMeal && availableMeals.length > 0) {
            minDiff = Infinity;
            for (const meal of availableMeals) {
                const diff = Math.abs(meal.calories - targetCalorie);
                if (diff < minDiff) {
                    minDiff = diff;
                    bestMeal = meal;
                }
            }
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

    // Hook để tính toán calo tối thiểu và hiển thị snackbar
    useEffect(() => {
        if (!userInfo || !userInfo.WEIGHT || !userInfo.HEIGHT || !userInfo.AGE || !userInfo.GENDER || !userInfo.ACTIVITY) {
            if (!snackbarShownRef.current) {
                enqueueSnackbar("Thông tin người dùng không đầy đủ để tính toán calo tối thiểu. Vui lòng cập nhật thông tin cá nhân của bạn.", {
                    variant: "warning",
                    persist: true,
                });
                snackbarShownRef.current = true; // Đặt cờ là đã hiển thị
            }
            // Reset giá trị nếu thông tin không đầy đủ
            setMinCaloriesDay(0);
            setMinCaloriesWeek(0);
            setMinCaloriesMonth(0);
            setGoalCalories(0);
            setTotalDailyCalories(0);
            return;
        }

        // Nếu thông tin đầy đủ, ẩn snackbar và reset cờ
        if (snackbarShownRef.current) {
            // Không có cách trực tiếp để đóng snackbar "persist" bằng code nếu không có key
            // Tốt hơn là không dùng persist nếu muốn đóng tự động khi điều kiện thay đổi
            // Hoặc lưu trữ key của snackbar để đóng nó.
            // Ví dụ: const key = enqueueSnackbar(...); closeSnackbar(key);
            snackbarShownRef.current = false;
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
        const monthlyCalories = dailyCalories * 30; // Approx

        setMinCaloriesDay(dailyCalories);
        setMinCaloriesWeek(weeklyCalories);
        setMinCaloriesMonth(monthlyCalories);
        setGoalCalories(dailyCalories); // Default to maintenance calories
        setTotalDailyCalories(dailyCalories); // Set initial daily calories for meal plan
    }, [userInfo, enqueueSnackbar]); // Depend on userInfo and enqueueSnackbar

    // Hook để fetch dữ liệu tuần và tính tổng calo
    useEffect(() => {
        fetchWeekData(); // Fetch the latest week data

        if (weekData && weekData.length > 0) {
            const totalWeek = weekData.reduce((sum, item) => sum + item.CALORIES, 0);
            setTotalCalories(totalWeek);

            const today = new Date();
            const todayLocaleString = today.toLocaleDateString("en-US", { weekday: "long" });
            const todayData = weekData.find((item) => item.DAY === todayLocaleString);
            setDailyCaloriesConsumed(todayData ? todayData.CALORIES : 0);

            const totalMonth = totalWeek * 4; // Simple approximation for monthly calories
            setTotalMonthlyCalories(totalMonth);
        } else {
            setTotalCalories(0);
            setDailyCaloriesConsumed(0);
            setTotalMonthlyCalories(0);
        }
    }, [weekData, fetchWeekData]);

    const calculateGoalCalories = () => {
        if (!userInfo || !userInfo.WEIGHT || !userInfo.HEIGHT || !userInfo.AGE || !userInfo.GENDER || !userInfo.ACTIVITY) {
            enqueueSnackbar("Vui lòng cập nhật đầy đủ thông tin cá nhân trước khi tính toán calo mục tiêu.", { variant: "error" });
            return;
        }

        let adjustedCalories = minCaloriesDay;
        const absoluteWeightChange = parseFloat(targetWeightChange);

        if (isNaN(absoluteWeightChange) || absoluteWeightChange < 0 || absoluteWeightChange > 1) {
            setWeightChangeError("Thay đổi cân nặng mục tiêu phải từ 0 đến 1 kg/tuần.");
            return;
        } else {
            setWeightChangeError("");
        }

        if (goal === "lose") {
            // Deficit: 1kg ~ 7700 kcal. For 1kg/week = 1100 kcal/day. For 0.5kg/week = 550 kcal/day.
            adjustedCalories = minCaloriesDay - (absoluteWeightChange * 1100);
        } else if (goal === "gain") {
            // Surplus: 1kg ~ 7700 kcal. For 1kg/week = 1100 kcal/day. For 0.5kg/week = 550 kcal/day.
            adjustedCalories = minCaloriesDay + (absoluteWeightChange * 1100);
        }

        // Ensure calories don't go too low for health reasons
        const minRecommended = userInfo.GENDER === "male" ? 1500 : 1200;
        if (adjustedCalories < minRecommended) {
            adjustedCalories = minRecommended;
            enqueueSnackbar(`Calo mục tiêu điều chỉnh thành ${minRecommended} để đảm bảo sức khỏe tối thiểu.`, { variant: "info" });
        }

        setGoalCalories(adjustedCalories);
        setTotalDailyCalories(adjustedCalories); // Trigger meal plan generation
    };

    const getHealthWarnings = () => {
        if (minCaloriesWeek === 0) return "Chưa có đủ thông tin để đưa ra cảnh báo sức khỏe.";

        if (totalCalories < minCaloriesWeek * 0.9) {
            return "Bạn tiêu thụ quá ít calo trong tuần, điều này có thể dẫn đến suy dinh dưỡng. Lượng calo quá thấp sẽ không đủ để cơ thể tạo năng lượng cần thiết cho các hoạt động cơ bản như hô hấp, tuần hoàn, và vận động. Hãy kiểm tra lại chế độ ăn của mình, bổ sung các thực phẩm giàu dinh dưỡng như rau, protein, và ngũ cốc nguyên hạt để cải thiện năng lượng hàng ngày. Người bệnh thừa cân, béo phì phải đối mặt với nhiều nguy cơ sức khỏe như: bệnh tim, cao huyết áp, đột quỵ, viêm khớp, giảm khả năng sinh sản, gan nhiễm mỡ không do rượu, đái tháo đường type 2, hội chứng ngưng thở khi ngủ… Đặc biệt, béo phì được cho là có liên quan đến 13 loại ung thư, gồm: ung thư buồng trứng, ung thư gan, ung thư não, ung thư tuyến tụy…";
        } else if (totalCalories > minCaloriesWeek * 1.1) {
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

    // Hàm tạo thực đơn mới (đã cải tiến và thống nhất)
    const generateMealPlan = () => {
        if (totalDailyCalories === 0) {
            enqueueSnackbar("Vui lòng tính toán lượng calo mục tiêu hàng ngày trước khi tạo thực đơn.", { variant: "warning" });
            return;
        }

        const meals = mealData[goal] || mealData.maintain; // Lấy danh sách bữa ăn theo mục tiêu
        const mealPlan = [];
        const mealCounts = {}; // Theo dõi số lần mỗi món ăn được sử dụng

        // Phân bổ calo cho các bữa ăn (có thể điều chỉnh)
        const calorieDistribution = {
            morning: totalDailyCalories * 0.20, // 20%
            lunch: totalDailyCalories * 0.40,   // 40%
            afternoon: totalDailyCalories * 0.10, // 10%
            dinner: totalDailyCalories * 0.30   // 30%
        };

        const mealTimes = [
            { key: "breakfast", display: "Sáng" },
            { key: "lunch", display: "Trưa" },
            { key: "afternoon", display: "Chiều" },
            { key: "dinner", display: "Tối" }
        ];

        let remainingCaloriesToAssign = totalDailyCalories;

        for (let i = 0; i < mealTimes.length; i++) {
            const { key: mealKey, display: mealTimeDisplay } = mealTimes[i];
            let targetCalForMeal = calorieDistribution[mealKey];

            // Adjust target calories for the current meal based on remaining overall calories
            // to ensure distribution is balanced and we try to hit the total
            const numRemainingMeals = mealTimes.length - (i + 1);
            if (numRemainingMeals > 0) {
                // Ensure there's enough left for future meals (e.g., minimum 100 kcal per meal)
                targetCalForMeal = Math.min(targetCalForMeal, remainingCaloriesToAssign - (numRemainingMeals * 100));
            } else {
                // For the last meal, try to use up all remaining calories
                targetCalForMeal = remainingCaloriesToAssign;
            }
            targetCalForMeal = Math.max(targetCalForMeal, 100); // Ensure a minimum for any meal

            const selectedMeal = selectMealGreedy(meals, targetCalForMeal, mealCounts);

            if (selectedMeal) {
                // Tăng số lần sử dụng món ăn này
                mealCounts[selectedMeal.name] = (mealCounts[selectedMeal.name] || 0) + 1;

                const originalMealCalories = selectedMeal.calories;
                let actualCaloriesForThisMeal = targetCalForMeal; // We aim for the target

                // Scale macros based on the ratio of actual desired calories to original meal calories
                // This assumes linear scaling of macros with calories, which is a common simplification.
                const scale = originalMealCalories > 0 ? actualCaloriesForThisMeal / originalMealCalories : 1;

                mealPlan.push({
                    ...selectedMeal,
                    mealTime: mealTimeDisplay,
                    actualCalories: actualCaloriesForThisMeal,
                    protein: selectedMeal.protein * scale,
                    fat: selectedMeal.fat * scale,
                    carbs: selectedMeal.carbs * scale,
                    weight: selectedMeal.weight * scale // Adjust weight too if it represents a portion
                });
                remainingCaloriesToAssign -= actualCaloriesForThisMeal; // Subtract actual calories used
            } else {
                // Fallback nếu không tìm thấy món ăn phù hợp
                mealPlan.push({
                    name: `Món ăn chưa xác định cho bữa ${mealTimeDisplay}`,
                    mealTime: mealTimeDisplay,
                    actualCalories: targetCalForMeal, // Assign the target calories for this "unknown" meal
                    protein: 0, fat: 0, carbs: 0, weight: 0,
                    image: 'https://via.placeholder.com/100?text=No+Meal', // Placeholder image
                    recipe_link: '#'
                });
                remainingCaloriesToAssign -= targetCalForMeal;
            }
        }

        // Adjust the last meal's calories to account for any remaining deficit/surplus
        if (mealPlan.length > 0 && remainingCaloriesToAssign !== 0) {
            const lastMeal = mealPlan[mealPlan.length - 1];
            lastMeal.actualCalories += remainingCaloriesToAssign;
            // Re-scale macros of the last meal based on its new actualCalories relative to its original.
            // This is a simplification; a more complex system might re-select or distribute.
            if (lastMeal.calories > 0 && lastMeal.name.indexOf("Món ăn chưa xác định") === -1) {
                const scale = lastMeal.actualCalories / lastMeal.calories;
                lastMeal.protein = lastMeal.protein * scale;
                lastMeal.fat = lastMeal.fat * scale;
                lastMeal.carbs = lastMeal.carbs * scale;
                lastMeal.weight = lastMeal.weight * scale;
            }
            // Ensure calories don't go negative or too low for the last meal
            lastMeal.actualCalories = Math.max(100, lastMeal.actualCalories);
        }

        setMealsPlan(mealPlan);
    };

    // UseEffect để tự động tạo thực đơn khi totalDailyCalories thay đổi
    useEffect(() => {
        if (totalDailyCalories > 0 && userInfo && userInfo.WEIGHT) { // Only generate if user info is available and calories set
            generateMealPlan();
        }
    }, [totalDailyCalories, goal, userInfo]); // Depend on goal and userInfo as well


    // Framer Motion variants for fade-in effect
    const fadeInVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    // Ref and inView for various sections
    const [userInfoRef, userInfoInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [calorieGoalsRef, calorieGoalsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [healthWarningsRef, healthWarningsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [dailyCaloriesRef, dailyCaloriesInView] = useInView({ triggerOnce: true, threshold: 0.1 }); // Used for disease suggestions
    const [weeklyChartRef, weeklyChartInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [monthlyInfoRef, monthlyInfoInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [mealPlanRef, mealPlanInView] = useInView({ triggerOnce: true, threshold: 0.1 });


    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
            {showWelcome && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#f0f2f5",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                        flexDirection: "column",
                        textAlign: "center",
                    }}
                >
                    <motion.img
                        src="https://cdn.dribbble.com/users/1258673/screenshots/3629471/media/e14115e3470724810f63a0273a81744b.gif" // Placeholder GIF
                        alt="Welcome Animation"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ maxWidth: "200px", marginBottom: "20px" }}
                    />
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        style={{ color: "#333", fontSize: "2.5em" }}
                    >
                        Chào mừng đến với Nền tảng Theo dõi Dinh dưỡng!
                    </motion.h2>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        style={{ color: "#555", fontSize: "1.2em" }}
                    >
                        Chúng tôi giúp bạn đạt được mục tiêu sức khỏe của mình.
                    </motion.p>
                </motion.div>
            )}

            <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", textAlign: "center", marginBottom: "30px" }}>
                Thông tin người dùng và Dinh dưỡng
            </Typography>

            {/* Thông tin người dùng */}
            <motion.div
                ref={userInfoRef}
                initial="hidden"
                animate={userInfoInView ? "visible" : "hidden"}
                variants={fadeInVariants}
            >
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
                        Thông tin cá nhân
                    </Typography>
                    <TableContainer component={Paper} style={{ margin: "20px auto", maxWidth: "800px" }}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}>Tên:</TableCell>
                                    <TableCell align="left" style={{ fontSize: "19px" }}>{userInfo?.USERNAME || "N/A"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}>Chiều cao:</TableCell>
                                    <TableCell align="left" style={{ fontSize: "19px" }}>{userInfo?.HEIGHT ? `${userInfo.HEIGHT} cm` : "N/A"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}>Cân nặng:</TableCell>
                                    <TableCell align="left" style={{ fontSize: "19px" }}>{userInfo?.WEIGHT ? `${userInfo.WEIGHT} kg` : "N/A"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}>Tuổi:</TableCell>
                                    <TableCell align="left" style={{ fontSize: "19px" }}>{userInfo?.AGE || "N/A"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}>Giới tính:</TableCell>
                                    <TableCell align="left" style={{ fontSize: "19px" }}>{userInfo?.GENDER === "male" ? "Nam" : userInfo?.GENDER === "female" ? "Nữ" : "N/A"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}>Mức độ vận động:</TableCell>
                                    <TableCell align="left" style={{ fontSize: "19px" }}>{userInfo?.ACTIVITY || "N/A"}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/update-profile')}
                            sx={{
                                padding: '10px 30px',
                                fontSize: '1rem',
                                borderRadius: '25px',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.05)' }
                            }}
                        >
                            Cập nhật thông tin
                        </Button>
                    </Box>
                </Box>
            </motion.div>

            <Divider sx={{ my: 4 }} />

            {/* Mục tiêu calo */}
            <motion.div
                ref={calorieGoalsRef}
                initial="hidden"
                animate={calorieGoalsInView ? "visible" : "hidden"}
                variants={fadeInVariants}
            >
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
                        Thiết lập mục tiêu Calo
                    </Typography>
                    <TableContainer component={Paper} style={{ margin: "20px auto", maxWidth: "800px" }}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}>Calo tối thiểu hàng ngày:</TableCell>
                                    <TableCell align="left" style={{ fontSize: "19px" }}>{minCaloriesDay.toFixed(1)} calo</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}>Mục tiêu hiện tại:</TableCell>
                                    <TableCell align="left" style={{ fontSize: "19px" }}>{goalCalories.toFixed(1)} calo</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}>Thiết lập mục tiêu:</TableCell>
                                    <TableCell align="left">
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Mục tiêu</InputLabel>
                                            <Select value={goal} label="Mục tiêu" onChange={(e) => setGoal(e.target.value)}>
                                                <MenuItem value="gain">Tăng cân</MenuItem>
                                                <MenuItem value="maintain">Duy trì</MenuItem>
                                                <MenuItem value="lose">Giảm cân</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                                {goal !== "maintain" && (
                                    <TableRow>
                                        <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}>Thay đổi cân nặng mục tiêu (kg/tuần):</TableCell>
                                        <TableCell align="left">
                                            <TextField
                                                type="number"
                                                value={targetWeightChange}
                                                onChange={(e) => setTargetWeightChange(e.target.value)}
                                                inputProps={{ min: 0, max: 1, step: 0.1 }}
                                                error={!!weightChangeError}
                                                helperText={weightChangeError}
                                                size="small"
                                                fullWidth
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableCell colSpan={2} align="center">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={calculateGoalCalories}
                                            sx={{
                                                padding: '10px 30px',
                                                fontSize: '1rem',
                                                borderRadius: '25px',
                                                mt: 2,
                                                transition: 'transform 0.2s',
                                                '&:hover': { transform: 'scale(1.05)' }
                                            }}
                                        >
                                            Tính toán Calo mục tiêu
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </motion.div>

            <Divider sx={{ my: 4 }} />

            {/* Gợi ý thực đơn hàng ngày */}
            <motion.div
                ref={mealPlanRef}
                initial="hidden"
                animate={mealPlanInView ? "visible" : "hidden"}
                variants={fadeInVariants}
            >
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
                        Gợi ý thực đơn hàng ngày ({goalCalories.toFixed(1)} calo)
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={generateMealPlan}
                            sx={{
                                padding: '10px 30px',
                                fontSize: '1rem',
                                borderRadius: '25px',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.05)' }
                            }}
                        >
                            Tạo thực đơn mới
                        </Button>
                    </Box>
                    {mealsPlan.length > 0 ? (
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <AnimatePresence>
                                {mealsPlan.map((meal, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                        <MealCard meal={meal} />
                                    </Grid>
                                ))}
                            </AnimatePresence>
                        </Grid>
                    ) : (
                        <Alert severity="info" sx={{ mt: 2 }}>Vui lòng tạo thực đơn hàng ngày.</Alert>
                    )}
                </Box>
            </motion.div>

            <Divider sx={{ my: 4 }} />

            {/* Cảnh báo sức khỏe */}
            <motion.div
                ref={healthWarningsRef}
                initial="hidden"
                animate={healthWarningsInView ? "visible" : "hidden"}
                variants={fadeInVariants}
            >
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
                        Cảnh báo sức khỏe dựa trên Calo tiêu thụ
                    </Typography>
                    <Alert severity="info" sx={{ mt: 2 }}>
                        {getHealthWarnings()}
                    </Alert>
                </Box>
            </motion.div>

            <Divider sx={{ my: 4 }} />

            {/* Gợi ý thực đơn theo bệnh lý */}
            <motion.div
                ref={dailyCaloriesRef} // Reusing dailyCaloriesRef for this section's animation
                initial="hidden"
                animate={dailyCaloriesInView ? "visible" : "hidden"}
                variants={fadeInVariants}
            >
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
                        Gợi ý thực đơn theo bệnh lý
                    </Typography>
                    <TableContainer component={Paper} style={{ margin: "20px auto", maxWidth: "800px" }}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}>Calo tiêu thụ ngày hôm nay:</TableCell>
                                    <TableCell align="left" style={{ fontSize: "19px" }}>{dailyCaloriesConsumed.toFixed(1)} calo</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}>Chọn tình trạng sức khỏe:</TableCell>
                                    <TableCell align="left">
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Tình trạng sức khỏe</InputLabel>
                                           <Select
                                                value={selectedCondition}
                                                label="Tình trạng sức khỏe"
                                                onChange={(e) => setSelectedCondition(e.target.value)}
                                            >
                                                <MenuItem value=""><em>Chọn một tình trạng</em></MenuItem>
                                                {/* Thay thế ListSubheader bằng MenuItem disabled và style */}
                                                <MenuItem disabled style={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.87)', opacity: 1, borderBottom: '1px solid #eee', marginTop: '8px' }}>
                                                    Thiếu Calo
                                                </MenuItem>
                                                {conditions.calorie_deficit.map((cond) => (
                                                    <MenuItem key={cond} value={cond}>{cond}</MenuItem>
                                                ))}
                                                {/* Thay thế ListSubheader bằng MenuItem disabled và style */}
                                                <MenuItem disabled style={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.87)', opacity: 1, borderBottom: '1px solid #eee', marginTop: '8px' }}>
                                                    Thừa Calo
                                                </MenuItem>
                                                {conditions.calorie_surplus.map((cond) => (
                                                    <MenuItem key={cond} value={cond}>{cond}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={2} align="center">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleSubmit}
                                            disabled={!selectedCondition}
                                            sx={{
                                                padding: '10px 30px',
                                                fontSize: '1rem',
                                                borderRadius: '25px',
                                                mt: 2,
                                                transition: 'transform 0.2s',
                                                '&:hover': { transform: 'scale(1.05)' }
                                            }}
                                        >
                                            Gợi ý thực đơn
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {feedback && (
                        <Alert severity="info" sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
                            {feedback}
                        </Alert>
                    )}
                </Box>
            </motion.div>

            <Divider sx={{ my: 4 }} />

            {/* Biểu đồ calo tuần */}
            <motion.div
                ref={weeklyChartRef}
                initial="hidden"
                animate={weeklyChartInView ? "visible" : "hidden"}
                variants={fadeInVariants}
            >
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
                        Tổng quan Calo tiêu thụ trong tuần
                    </Typography>
                    {weekData && weekData.length > 0 ? (
                        <Chart
                            options={{
                                chart: { id: "basic-bar" },
                                xaxis: { categories: weekData.map(item => item.DAY) },
                                stroke: { curve: 'smooth' },
                                markers: { size: 5 },
                                yaxis: { title: { text: "Calo" } },
                                title: { text: "Tổng Calo tiêu thụ hàng ngày", align: 'left' }
                            }}
                            series={[{ name: "Calo", data: weekData.map(item => item.CALORIES) }]}
                            type="line"
                            height={350}
                        />
                    ) : (
                        <Alert severity="info">Chưa có dữ liệu calo trong tuần để hiển thị biểu đồ.</Alert>
                    )}
                </Box>
            </motion.div>

            <Divider sx={{ my: 4 }} />

            {/* Thông tin calo hàng tháng */}
            <motion.div
                ref={monthlyInfoRef}
                initial="hidden"
                animate={monthlyInfoInView ? "visible" : "hidden"}
                variants={fadeInVariants}
            >
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
                        Dự kiến lượng calo tiêu thụ trung bình hàng tháng
                    </Typography>
                    <TableContainer component={Paper} style={{ margin: "20px auto", maxWidth: "800px" }}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}><strong>Tổng calo trung bình hàng tháng:</strong></TableCell>
                                    <TableCell align="left" style={{ fontSize: "19px" }}>{totalMonthlyCalories.toFixed(1)} calo</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" style={{ fontWeight: "bold", fontSize: "19px" }}><strong>Lượng calo tối thiểu cần thiết trong tháng:</strong></TableCell>
                                    <TableCell align="left" style={{ fontSize: "19px" }}>{minCaloriesMonth.toFixed(1)} calo</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </motion.div>
        </div>
    );
};

export default UserInfo;
