export function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

const WEEKS_VI = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

const WEEKS_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
// utils/utils.js
export const getDaysSinceRegistration = () => {
  const registrationDate = localStorage.getItem("registrationDate");
  if (!registrationDate) return 0;

  const today = new Date();
  const regDate = new Date(registrationDate);

  const diffTime = today - regDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateTotalCalories = (dailyCalories) => {
  // Lấy ngày đăng ký từ localStorage
  const registrationDate = localStorage.getItem("registrationDate");
  if (!registrationDate) {
    console.warn("Không tìm thấy ngày đăng ký trong localStorage");
    return 0; // Nếu không có ngày đăng ký, trả về 0
  }

  // Chuyển đổi ngày đăng ký và ngày hiện tại thành đối tượng Date
  const today = new Date();
  const regDate = new Date(registrationDate);

  // Tính số ngày từ ngày đăng ký đến hiện tại
  const totalDays = Math.floor((today - regDate) / (1000 * 60 * 60 * 24)) + 1; // +1 vì tính cả ngày đầu tiên
  let totalCalories = 0;

  // Lặp qua từng ngày từ ngày đăng ký đến hôm nay
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(regDate); // Khởi tạo ngày gốc
    date.setDate(regDate.getDate() + i); // Cộng thêm số ngày

    const dateKey = date.toISOString().split("T")[0]; // Định dạng ngày (YYYY-MM-DD)

    // Cộng lượng calo tiêu thụ trong ngày đó (nếu có)
    totalCalories += dailyCalories[dateKey] || 0; // Nếu không có dữ liệu thì cộng 0
  }

  return totalCalories; // Trả về tổng lượng calo
};
export const getChartData = (weekData) => {
  const categories = [];
  const values = [];

  if (weekData.length === 7) {
    weekData.forEach((week) => {
      categories.unshift(WEEKS_VI[WEEKS_EN.indexOf(week.DAY)]); // Dùng Tiếng Việt để hiển thị
      values.unshift(Number(week.CALORIES.toFixed(2)));
    });
  } else {
    const idx =
      weekData.length === 0
        ? 0
        : WEEKS_EN.findIndex(
            (week) => week === weekData[weekData.length - 1].DAY
          );

    let count = 0;
    for (let i = idx; ; ) {
      if (count === 7) {
        break;
      }

      const foundWeek = weekData.find((wd) => wd.DAY === WEEKS_EN[i]);
      if (!foundWeek) {
        categories.unshift(WEEKS_VI[i]);
        values.unshift(0);
      } else {
        categories.unshift(WEEKS_VI[i]);
        values.unshift(Number(foundWeek.CALORIES.toFixed(2)));
      }

      i = i - 1;
      if (i < 0) {
        i = 6;
      }
      count += 1;
    }
  }

  return [categories, values];
};
