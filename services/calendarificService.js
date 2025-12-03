const axios = require("axios");

const isWeekend = (dateString) => {
  const date = new Date(dateString);
  const day = date.getUTCDay();
  return day === 0 || day === 6;
};

const isHoliday = async (dateString, country) => {
  const apiKey = process.env.CALENDARIFIC_API_KEY;
  if (!apiKey) return false;

  const year = dateString.split("-")[0];

  try {
    const res = await axios.get("https://calendarific.com/api/v2/holidays", {
      params: {
        api_key: apiKey,
        country,
        year,
      },
    });

    const holidays = res.data?.response?.holidays || [];
    const matches = holidays.filter((h) => h.date && h.date.iso === dateString);
    return matches.length > 0;
  } catch (error) {
    console.warn("Holiday API failed. Skipping holiday validation.");
    return false;
  }
};

module.exports = {isWeekend, isHoliday};
