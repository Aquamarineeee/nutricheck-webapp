import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeeklyReport = () => {
    const [weekData, setWeekData] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);

    useEffect(() => {
        const fetchWeekData = async () => {
            try {
                const response = await axios.get('/api/food/last-week-nutrition-details');
                const data = response.data.weekData;
                setWeekData(data);

                // Tính tổng lượng calo từ dữ liệu tuần
                const total = data.reduce((sum, day) => sum + day.CALORIES, 0);
                setTotalCalories(total);
            } catch (error) {
                console.error('Error fetching weekly calories:', error);
            }
        };

        fetchWeekData();
    }, []);

    return (
        <div>
            <h2>Weekly Calorie Report</h2>
            <p>Total Calories for the Week: {totalCalories} kcal</p>
            <ul>
                {weekData.map((day, index) => (
                    <li key={index}>
                        {day.CONSUMED_ON} ({day.DAY}): {day.CALORIES} kcal
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WeeklyReport;
