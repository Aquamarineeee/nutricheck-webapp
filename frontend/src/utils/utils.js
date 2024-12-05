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
  const registrationDate = localStorage.getItem("registrationDate");
  if (!registrationDate) return 0;

  const today = new Date();
  const regDate = new Date(registrationDate);

  const totalDays = Math.floor((today - regDate) / (1000 * 60 * 60 * 24)) + 1;
  let totalCalories = 0;

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(regDate);
    date.setDate(date.getDate() + i);

    const dateKey = date.toISOString().split("T")[0];
    totalCalories += dailyCalories[dateKey] || 0;
  }

  return totalCalories;
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
