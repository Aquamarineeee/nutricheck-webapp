import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import Chart from "react-apexcharts";

const UserInfo = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [weekData, setWeekData] = useState([]); // Dữ liệu tuần
  const [totalCalories, setTotalCalories] = useState(0); // Tổng calo tiêu thụ trong tuần

  useEffect(() => {
    const fetchWeekData = async () => {
      try {
        const response = await axios.get("/api/food/last-week-nutrition-details", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = response.data.weekData || [];
        setWeekData(data);

        // Tính tổng calo trong tuần
        const total = data.reduce((sum, day) => sum + day.CALORIES, 0);
        setTotalCalories(total);
      } catch (error) {
        enqueueSnackbar("Không thể tải dữ liệu tuần.", { variant: "error" });
      }
    };

    fetchWeekData();
  }, [enqueueSnackbar]);

  // Dữ liệu cho biểu đồ
  const categories = weekData.map((item) => item.DAY); // Tên các ngày
  const weekCalories = weekData.map((item) => item.CALORIES); // Lượng calo từng ngày

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Báo cáo Calo hàng tuần
      </Typography>

      <Typography variant="subtitle1">
        <strong>Tổng calo tiêu thụ:</strong> {totalCalories.toFixed(1)} calo
      </Typography>

      {weekData.length > 0 ? (
        <Chart
          type="bar"
          series={[
            {
              name: "Calo",
              data: weekCalories,
            },
          ]}
          height={300}
          options={{
            xaxis: {
              categories: categories,
            },
            yaxis: {
              title: {
                text: "Calo",
              },
            },
            plotOptions: {
              bar: {
                columnWidth: "50%",
              },
            },
            dataLabels: {
              enabled: false,
            },
          }}
        />
      ) : (
        <Alert severity="info">Không có dữ liệu tuần này.</Alert>
      )}
    </div>
  );
};

export default UserInfo;
