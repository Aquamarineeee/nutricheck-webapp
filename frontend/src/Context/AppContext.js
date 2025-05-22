import { useSnackbar } from 'notistack';
import { createContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FullPageLoading } from '../Components/LoadingSpinner';
import { API } from '../services/apis'; // Giả định API service của bạn

export const AppContext = createContext({
    isTourTaken: Boolean(),
    setisTourTaken: () => {},
    weekData: [],
    fetchWeekData: () => {},
    fetchTodaysConsumption: () => {},
    nutrients: {},
    setnutrients: () => {},
    todayFoodItems: [],
    userInfo: {},
    isLoading: Boolean(),
    maxCalories: Number(),
    setmaxCalories: () => {},
    setuserInfo: () => {},
    handleLogout: () => {},
    setisLoading: () => {},
    weeklyNutrition: {},
    monthlyNutrition: {},
    maxWeekly: 0,
    maxMonthly: 0,
    fetchWeekAndMonthData: () => {},
    // THÊM CÁC THUỘC TÍNH NÀY VÀO CONTEXT
    userMealPreferences: {},
    updateUserMealPreference: () => {},
    mealGlobalCounts: {},
    updateMealGlobalCount: () => {},
});

export const AppContextProvider = ({ children }) => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(false);
    const [isTourTaken, setisTourTaken] = useState(false);

    const [userInfo, setuserInfo] = useState({});
    const [weekData, setweekData] = useState([]);
    const [todayFoodItems, settodayFoodItems] = useState([]);
    const [maxCalories, setmaxCalories] = useState(2000);
    const [nutrients, setnutrients] = useState({
        protiens: 0,
        calcium: 0,
        calorie: 0,
        carbs: 0,
        fats: 0,
        maxprotiens: 165,
        maxcalcium: 1000,
        maxcarbs: 300,
        maxfats: 70,
        week: {
            calories: 0,
            protiens: 0,
            carbs: 0,
            fats: 0,
            calcium: 0,
            highest: 0,
        },
        month: {
            calories: 0,
            protiens: 0,
            carbs: 0,
            fats: 0,
            calcium: 0,
            highest: 0,
        },
    });

    // LẤY DỮ LIỆU TỪ LOCALSTORAGE KHI KHỞI TẠO STATE
    const [userMealPreferences, setUserMealPreferences] = useState(() => {
        try {
            const storedPreferences = localStorage.getItem('userMealPreferences');
            return storedPreferences ? JSON.parse(storedPreferences) : {};
        } catch (error) {
            console.error("Lỗi khi đọc userMealPreferences từ localStorage:", error);
            return {};
        }
    });

    const [mealGlobalCounts, setMealGlobalCounts] = useState(() => {
        try {
            const storedCounts = localStorage.getItem('mealGlobalCounts');
            return storedCounts ? JSON.parse(storedCounts) : {};
        } catch (error) {
            console.error("Lỗi khi đọc mealGlobalCounts từ localStorage:", error);
            return {};
        }
    });

    // CÁC HÀM CẬP NHẬT DỮ LIỆU HUẤN LUYỆN
    const updateUserMealPreference = useCallback((mealName, preferenceValue) => {
        setUserMealPreferences(prevPreferences => {
            const newPreferences = {
                ...prevPreferences,
                [mealName]: (prevPreferences[mealName] || 0) + preferenceValue
            };
            try {
                localStorage.setItem('userMealPreferences', JSON.stringify(newPreferences));
            } catch (error) {
                console.error("Lỗi khi lưu userMealPreferences vào localStorage:", error);
            }
            return newPreferences;
        });
    }, []);

    const updateMealGlobalCount = useCallback((mealName) => {
        setMealGlobalCounts(prevCounts => {
            const newCounts = {
                ...prevCounts,
                [mealName]: (prevCounts[mealName] || 0) + 1
            };
            try {
                localStorage.setItem('mealGlobalCounts', JSON.stringify(newCounts));
            } catch (error) {
                console.error("Lỗi khi lưu mealGlobalCounts vào localStorage:", error);
            }
            return newCounts;
        });
    }, []);

    // CÁC HÀM FETCH DATA (đảm bảo được bọc trong useCallback và có dependencies nếu cần)
    const fetchWeekData = useCallback(async () => {
        try {
            // Thay thế bằng lời gọi API thực tế nếu có
            // const response = await API.getWeekData();
            // setweekData(response.data);
            setweekData({
                daily_avg_calories: 1800,
                min_calories_day: 1500,
                min_calories_week: 1600,
                min_calories_month: 1700,
                weekly_total_calories: 12600,
                monthly_total_calories: 54000,
                daily_calories: [
                    { date: 'T2', calories: 1850 },
                    { date: 'T3', calories: 1700 },
                    { date: 'T4', calories: 1900 },
                    { date: 'T5', calories: 1750 },
                    { date: 'T6', calories: 2000 },
                    { date: 'T7', calories: 1800 },
                    { date: 'CN', calories: 1950 },
                ]
            });
        } catch (error) {
            console.error("Lỗi khi fetchWeekData:", error);
            enqueueSnackbar("Không thể tải dữ liệu tuần.", { variant: "error" });
        }
    }, [enqueueSnackbar]);

    const fetchTodaysConsumption = useCallback(async () => {
        try {
            // Thay thế bằng lời gọi API thực tế nếu có
            // const response = await API.getTodaysConsumption();
            // settodayFoodItems(response.data.foodItems);
            settodayFoodItems([]); // Dữ liệu mock
        } catch (error) {
            console.error("Lỗi khi fetchTodaysConsumption:", error);
            enqueueSnackbar("Không thể tải dữ liệu tiêu thụ hôm nay.", { variant: "error" });
        }
    }, [enqueueSnackbar]);

    const [weeklyNutrition, setWeeklyNutrition] = useState({});
    const [monthlyNutrition, setMonthlyNutrition] = useState({});
    const [maxWeekly, setMaxWeekly] = useState(0);
    const [maxMonthly, setMaxMonthly] = useState(0);

    const fetchWeekAndMonthData = useCallback(async () => {
        try {
            // Thay thế bằng lời gọi API thực tế nếu có
            // const weekRes = await API.getWeeklyNutritionDetails();
            // const monthRes = await API.getMonthlyNutritionDetails();
            // setWeeklyNutrition(weekRes.data.nutrition);
            // setMaxWeekly(weekRes.data.max);
            // setMonthlyNutrition(monthRes.data.nutrition);
            // setMaxMonthly(monthRes.data.max);
            setWeeklyNutrition({ calories: 12000, protiens: 500, carbs: 1800, fats: 400, calcium: 7000 }); // Dữ liệu mock
            setMaxWeekly(2000); // Dữ liệu mock
            setMonthlyNutrition({ calories: 48000, protiens: 2000, carbs: 7200, fats: 1600, calcium: 28000 }); // Dữ liệu mock
            setMaxMonthly(2200); // Dữ liệu mock

        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu tuần và tháng:', error);
            enqueueSnackbar("Không thể tải dữ liệu dinh dưỡng tuần/tháng.", { variant: "error" });
        }
    }, [enqueueSnackbar]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        // Quyết định xem có nên xóa dữ liệu huấn luyện khi logout không
        // localStorage.removeItem('userMealPreferences');
        // localStorage.removeItem('mealGlobalCounts');
        setuserInfo({});
        navigate('/login');
    }, [navigate]);

    // Gộp tất cả các lời gọi fetch vào một useEffect duy nhất phụ thuộc vào userInfo
    // VÀ CŨNG TẠO MOCK USERINFO NẾU CHƯA CÓ ĐỂ PHÁT TRIỂN
    useEffect(() => {
        if (!userInfo || !userInfo.uid) {
            // Tạo mock userInfo nếu không có để tiện phát triển
            setuserInfo({
                uid: 'mockUserId123',
                name: 'Người dùng thử',
                email: 'test@example.com',
                age: 30,
                gender: 'Nam',
                height: 175,
                weight: 70,
                bmr: 1600, // Ví dụ BMR
                activityLevel: 1.375, // Ví dụ mức độ hoạt động (moderate)
                activityLevelName: 'Vừa phải'
            });
        }

        if (userInfo && userInfo.uid) {
            fetchWeekData();
            fetchTodaysConsumption();
            fetchWeekAndMonthData();
        }
    }, [userInfo, fetchWeekData, fetchTodaysConsumption, fetchWeekAndMonthData]);

    return (
        <AppContext.Provider
            value={{
                isTourTaken,
                setisTourTaken,
                isLoading,
                weekData,
                fetchWeekData,
                nutrients,
                fetchTodaysConsumption,
                setnutrients,
                todayFoodItems,
                userInfo,
                setuserInfo,
                setmaxCalories,
                maxCalories,
                handleLogout,
                setisLoading,
                weeklyNutrition,
                monthlyNutrition,
                maxWeekly,
                maxMonthly,
                fetchWeekAndMonthData,
                userMealPreferences,    // ĐẢM BẢO ĐƯỢC TRUYỀN ĐI
                updateUserMealPreference, // ĐẢM BẢO ĐƯỢC TRUYỀN ĐI
                mealGlobalCounts,       // ĐẢM BẢO ĐƯỢC TRUYỀN ĐI
                updateMealGlobalCount,  // ĐẢM BẢO ĐƯỢC TRUYỀN ĐI
            }}
        >
            <FullPageLoading isLoading={isLoading} />
            {children}
        </AppContext.Provider>
    );
};
