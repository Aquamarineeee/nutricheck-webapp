const WeeklyReport = ({ weeklyFoodItems }) => {
    // Kiểm tra nếu không có dữ liệu
    if (!Array.isArray(weeklyFoodItems) || weeklyFoodItems.length === 0) {
      return <div>No data available for this week.</div>;
    }
  
    // Tính tổng calo trong tuần
    const totalWeeklyCalories = weeklyFoodItems.reduce((total, day) => {
      const dailyCalories = Array.isArray(day.foodItems)
        ? day.foodItems.reduce((prev, curr) => prev + curr.CALORIE, 0)
        : 0;
      return total + dailyCalories;
    }, 0);
  
    return (
      <div style={{ marginTop: "20px" }}>
        <Divider />
        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            fontWeight: 700,
            fontSize: "1.5rem",
          }}
        >
          Weekly Report
        </div>
        <div
          style={{
            marginTop: "2rem",
            width: "12rem",
            height: "12rem",
            background: "#F1A661",
            borderRadius: "100%",
            boxShadow:
              "0 4px 4px 0 rgba(0, 0, 0, 0.1), 0 6px 10px 0 rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px auto",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: "2.5rem",
              color: "var(--onOrange)",
            }}
          >
            {totalWeeklyCalories.toFixed(1)}
          </div>
          <span style={{ fontSize: "18px", color: "var(--onOrange)" }}>
            Weekly Calories
          </span>
        </div>
  
        {weeklyFoodItems.map((day) => (
          <div key={day.date} style={{ marginBottom: "3rem" }}>
            <div
              style={{
                textAlign: "center",
                margin: "1rem 0",
                fontWeight: 600,
                fontSize: "1.2rem",
              }}
            >
              {new Date(day.date).toLocaleDateString()}
            </div>
            <Grid container spacing={"2rem"}>
              {Array.isArray(day.foodItems) &&
                day.foodItems.map((item) => (
                  <Grid item key={item.ID} xs={12} sm={6}>
                    <FoodCard
                      calories={item.CALORIE.toFixed(2)}
                      carbohydrates={item.CARBOHYDRATES.toFixed(2)}
                      fats={item.FAT.toFixed(2)}
                      image_url={item.IMAGE}
                      proteins={item.PROTEINS.toFixed(2)}
                      time={formatAMPM(new Date(item.CONSUMED_ON))}
                      calcium={item.CALCIUM.toFixed(2)}
                    />
                  </Grid>
                ))}
            </Grid>
          </div>
        ))}
      </div>
    );
  };
  