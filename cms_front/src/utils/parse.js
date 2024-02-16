const monthsInString = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const monthsInStringShort = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const mongoDateToString = (date) => {
  const tmp = date.split("T");

  const tmp1 = tmp[1].slice(0, -1);

  const dateArray = tmp[0].split("-");
  const clockArray = tmp1.split(":");

  const year = parseInt(dateArray[0]);
  const month = parseInt(dateArray[1]);
  const day = parseInt(dateArray[2]);

  const hour = parseInt(clockArray[0]);
  const min = parseInt(clockArray[1]);
  const sec = parseInt(clockArray[2]);

  return {
    year: year,
    month: month,
    monthInString: monthsInString[month - 1],
    monthInStringShort: monthsInStringShort[month - 1],
    day: day,
    dayInString: `${day}${
      day > 3 ? "th" : day == 1 ? "st" : day == 2 ? "nd" : "rd"
    }`,
    hour: hour,
    min: min,
    sec: sec,
    date: tmp[0],
    clock: tmp1,
  };
};

const dateForm = ({ year = 0, monthInString = 0, day = 0 }) => {
  return `${day} ${monthInString}, ${year}`;
};

const isCapital = (char) => {
  return char >= "A" && char <= "Z";
};

const camelToNormal = (text) => {
  let toRet = "";
  for (let i = 0; i < text.length; i++) {
    if (isCapital(text[i])) {
      toRet += " " + text[i];
    } else {
      toRet += text[i];
    }
  }
  return toRet;
};

const snakeToNormal = (text) => {
  let toRet = "";
  for (let i = 0; i < text.length; i++) {
    if (text[i] == "-" || text[i] == "_") {
      toRet += " ";
    } else {
      toRet += text[i];
    }
  }
  return toRet;
};

module.exports.mongoDateToString = mongoDateToString;
module.exports.dateForm = dateForm;
module.exports.camelToNormal = camelToNormal;
module.exports.snakeToNormal = snakeToNormal;
