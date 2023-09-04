const month_olympic = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const month_normal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const getNowDate = () => {
  let time = new Date();
  time =
    time.getFullYear() +
    "/" +
    (parseInt(time.getMonth()) + 1) +
    "/" +
    time.getDate();
  return time;
};

const day_Start_intheMonth = (month, year) => {
  const tmpDate = new Date(year, month, 1);
  return tmpDate.getDay();
};

export const days_in_Month = (month, year) => {
  const days = [];
  const totalDay =
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
      ? month_olympic[month]
      : month_normal[month];
  const firstDay = day_Start_intheMonth(month, year);
  let n = -1;
  for (n; n >= -firstDay; n--) days.push(n);
  for (let i = 1; i <= totalDay; i++) days.push(i);
  const back = Math.ceil((totalDay + firstDay) / 7) * 7 - days.length;
  for (let i = 1; i <= back; i++) {
    days.push(n);
    n--;
  }
  return days;
};
