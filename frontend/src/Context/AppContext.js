import { useSnackbar } from 'notistack';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FullPageLoading } from '../Components/LoadingSpinner';
import { API } from '../services/apis';

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
        maxcalcium: 2000,
        maxcarbs: 225,
        maxfats: 97,
    });

    const fetchWeekData = async () => {
        try {
            const res = await API.lastWeekCalorieDetails();
            setweekData(res.weekData);
        } catch (err) {
            if (err?.response?.data?.msg) {
                enqueueSnackbar(err?.response?.data?.msg, {
                    variant: 'error',
                });
            } else {
                enqueueSnackbar('Đã có lỗi xảy ra', {
                    variant: 'error',
                });
            }
        }
    };

    const fetchTodaysConsumption = async () => {
        setisLoading(true);
        try {
            const res = await API.todaysConsumption();
            const tot_nutris = res.total_nutrients;
            settodayFoodItems(res.food_items);

            setnutrients((prevState) => ({
                ...prevState,
                calorie: Number(tot_nutris.CALORIE.toFixed(2)),
                protiens: Number(tot_nutris.PROTEINS).toFixed(2),
                calcium: Number(tot_nutris.CALCIUM.toFixed(2)),
                carbs: Number(tot_nutris.CARBOHYDRATES.toFixed(2)),
                fats: Number(tot_nutris.FAT.toFixed(2)),
            }));
        } catch (err) {
            console.log(err);
            if (err?.response?.data?.msg)
                enqueueSnackbar(err?.response?.data?.msg, { variant: 'error' });
            else enqueueSnackbar('Đã có lỗi xãy ra', { variant: 'error' });
        }
        setisLoading(false);
    };

    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');

            if (token) {
                setisLoading(true);
                const { userInfo, maxCalories } = await API.userInfo();
                if (userInfo?.IS_LOGIN_PROCESS_COMPLETE) {
                    setuserInfo(userInfo);
                    setmaxCalories(maxCalories);
                    navigate('/dashboard');
                    setisLoading(false);
                    return true;
                } else {
                    navigate('/userInitialForm');
                }
            } else {
                navigate('/');
            }
        } catch (err) {
            navigate('/');
        }
        setisLoading(false);
        return false;
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        navigate('/');
        setuserInfo({});
    };

    useEffect(() => {
        async function exec() {
            if (await fetchUserInfo()) {
                fetchTodaysConsumption();
                fetchWeekData();
            }
        }
        exec();
    }, []);
    const [weeklyNutrition, setWeeklyNutrition] = useState({});
    const [monthlyNutrition, setMonthlyNutrition] = useState({});
    const [maxWeekly, setMaxWeekly] = useState({});
    const [maxMonthly, setMaxMonthly] = useState({});

    const calculateNutritionData = () => {
        if (!weekData || weekData.length === 0) return;
    
        // Tính tổng calo cho tuần
        const weeklyTotals = weekData.reduce(
            (totals, day) => {
                totals.fat += day.FAT * 9 || 0;
                totals.carbs += day.CARBS * 4 || 0;
                totals.protein += day.PROTEIN * 4 || 0;
                totals.calcium += day.CALCIUM || 0; // Không tính calo cho Canxi
                return totals;
            },
            { fat: 0, carbs: 0, protein: 0, calcium: 0 }
        );
    
        // Tính tổng calo cho tháng (giả định 4 tuần)
        const monthlyTotals = {
            fat: weeklyTotals.fat * 4,
            carbs: weeklyTotals.carbs * 4,
            protein: weeklyTotals.protein * 4,
            calcium: weeklyTotals.calcium * 4,
        };
    
        // Tìm hàm lượng cao nhất
        const maxWeekly = Object.entries(weeklyTotals).reduce((max, entry) =>
            entry[1] > max[1] ? entry : max
        );
        const maxMonthly = Object.entries(monthlyTotals).reduce((max, entry) =>
            entry[1] > max[1] ? entry : max
        );
    
        setWeeklyNutrition(weeklyTotals);
        setMonthlyNutrition(monthlyTotals);
        setMaxWeekly(maxWeekly);
        setMaxMonthly(maxMonthly);
    };
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
            }}
        >
            <FullPageLoading isLoading={isLoading} />
            {children}
        </AppContext.Provider>
    );

};
