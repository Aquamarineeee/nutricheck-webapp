import React, { useEffect, useState } from "react";
import { Alert, Typography } from "@mui/material";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { API } from "../services/apis"; // Đường dẫn có thể cần điều chỉnh

const UserInfo = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [weekData, setWeekData] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const fetchWeekData = async () => {
      try {
        // Lấy dữ liệu calo hàng tuần từ API
        const response = await API.lastWeekCalorieDetails();
        const data = response.weekData || [];

        setWeekData(data);

        // Tính tổng lượng calo
        const total = data.reduce((sum, item) => sum + item.CALORIES, 0);
        setTotalCalories(total);
      } catch (error) {
        enqueueSnackbar("Không thể tải dữ liệu calo hàng tuần.", {
          variant: "error",
        });
      }
    };

    fetchWeekData();
  }, [enqueueSnackbar]);

  // Tạo dữ liệu biểu đồ
  const categories = weekData.map((item) => item.DAY); // Tên các ngày trong tuần
  const weekCalories = weekData.map((item) => item.CALORIES); // Calo từng ngày

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Báo cáo calo tuần này
      </Typography>

      <Typography variant="body1" gutterBottom>
        <strong>Tổng lượng calo tiêu thụ:</strong> {totalCalories.toFixed(1)} calo
      </Typography>

      {weekData.length > 0 ? (
        <Chart
          type="bar"
          series={[
            {
              name: "Calo",
              data: weekCalories,
              color: "#FFA726", // Màu thanh biểu đồ
            },
          ]}
          height={350}
          options={{
            xaxis: {
              categories: categories,
              title: { text: "Ngày" },
            },
            yaxis: {
              title: { text: "Calo" },
            },
            chart: {
              toolbar: { show: false },
            },
            plotOptions: {
              bar: {
                borderRadius: 6,
                columnWidth: "50%",
              },
            },
            dataLabels: {
              enabled: false,
            },
          }}
        />
      ) : (
        <Alert severity="info">Không có dữ liệu calo tuần này.</Alert>
      )}
    </div>
  );
};

export default UserInfo;