const UserInfo = () => {
  const [calories, setCalories] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]); // Lưu dữ liệu tuần
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCalories = async () => {
      try {
        const response = await axios.get(
          "/api/food/total-calories-since-registration",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCalories(response.data.total_calories || 0);
      } catch (error) {
        console.error("Error fetching total calories:", error);
      }
    };

    const fetchWeeklyData = async () => {
      try {
        const response = await axios.get(
          "/api/food/last-week-nutrition-details",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setWeeklyData(response.data.weekData || []); // Lưu dữ liệu tuần
      } catch (error) {
        console.error("Error fetching weekly calories:", error);
      }
    };

    fetchCalories();
    fetchWeeklyData();
  }, []);

  return (
    <div>
      <h2>Thông tin người dùng</h2>
      <p>Tổng tiêu thụ: {calories} calo từ khi đăng ký</p>
      <p>
        Người dùng có thể đọc thêm các khuyến nghị về lượng calo tiêu thụ đối
        với từng thể trạng khác nhau ở:{" "}
      </p>
      <button
        onClick={() => navigate("/blog/suggest")}
        className="switch-to-signup"
      >
        Đánh giá mức độ tiêu thụ khuyến cáo
      </button>

      {weeklyData && weeklyData.length > 0 ? (
        <WeeklyReport weeklyFoodItems={weeklyData} />
      ) : (
        <p>Không có dữ liệu calo cho tuần này.</p>
      )}
    </div>
  );
};
export default UserInfo;