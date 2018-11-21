const daysInAMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * @param {Date} date
 * @returns {number}
 */
function getYear(date = null) {
  return (date || new Date()).getFullYear();
}

/**
 * @param {Date} date
 * @returns {number}
 */
function getMonth(date = null) {
  date = date || new Date();
  return date.getMonth() + 1;
}

/**
 * @param {Date} date
 * @returns {number}
 */
function getDayOfMonth(date = null) {
  return (date || new Date()).getDate();
}

/**
 * @param {Date} date
 * @returns {{year: number, month: number, day: number}}
 */
function getCalendarDate(date = null) {
  date = date || new Date();
  return {
    year:  getYear(date),
    month: getMonth(date),
    day:   getDayOfMonth(date)
  };
}

/**
 * @param {number} year
 * @param {number} month
 * @param {boolean} recurse
 * @returns {{weeks: Array}}
 */
function getCalendar(year = 0, month = 0, recurse = true) {
  year = year || (new Date()).getFullYear();
  if (month) {
    month -= 1;
  } else {
    month = (new Date().getMonth());
  }
  const currDate = new Date(
    year,
    month
  );

  const NUM_WEEKS   = 6;
  const currMonth   = currDate.getMonth();
  const currYear    = currDate.getFullYear();
  const prevDate    = new Date(currDate.setMonth(currDate.getMonth() - 1));
  const prevMonth   = prevDate.getMonth();
  const prevYear    = prevDate.getFullYear();
  const nextDate    = new Date(currDate.setMonth(currDate.getMonth() + 2));
  const nextMonth   = nextDate.getMonth();
  const nextYear    = nextDate.getFullYear();
  const firstDay    = new Date(currYear, currMonth, 1);
  const startingDay = firstDay.getDay();

  let monthLength = daysInAMonth[currMonth];
  if (currMonth === 1) {
    if ((currYear % 4 === 0 && currYear % 100 !== 0) || currYear % 400 === 0) {
      monthLength = 29;
    }
  }

  let day = 1;
  const weeks = [];
  for (let week = 0; week < NUM_WEEKS; week++) {
    let row = [];

    // Fill in leading days from previous month.
    if (recurse && day === 1 && startingDay !== 0) {
      const prevDays = getCalendar(prevYear, prevMonth + 1, false).weeks.pop().reverse();
      for (let g = 0; g < startingDay; g++) {
        row.push({
          year:  prevYear,
          month: (prevMonth + 1),
          day:   prevDays[g].day
        });
      }
    }

    // Add the days from this month.
    for (let weekDay = 1; weekDay <= 7; weekDay++) {
      if ((week > 0 || weekDay > startingDay) && day <= monthLength) {
        row.push({
          year:  currYear,
          month: (currMonth + 1),
          day
        });
        day += 1;
      }
    }
    weeks.push(row);

    // Fill in remaining weeks from the next month.
    if (day > monthLength) {
      const weeksRemaining = NUM_WEEKS - week;

      if (recurse && weeksRemaining > 0) {
        const lastWeek      = weeks[weeks.length - 1];
        let daysRemaining   = 7 - lastWeek.length;
        const extraCalendar = getCalendar(nextYear, nextMonth + 1, false).weeks.slice(0, weeksRemaining);

        if (daysRemaining === 0) {
          row = [];
          daysRemaining = -1;
        }

        let first = true;
        for (; week < NUM_WEEKS; week++) {
          if (!first && daysRemaining !== 0) {
            row = [];
          }
          const extraWeek = extraCalendar.shift();
          if (extraWeek) {
            for (let s = 0; s < extraWeek.length; s++) {
              row.push(extraWeek[s]);
            }
            if (!first && daysRemaining !== 0) {
              weeks.push(row);
            }
          }
          first = false;
        }
      }
    }

    if (day > monthLength) {
      break;
    }
  }

  return {
    year,
    month: (month + 1),
    weeks
  };
}

/**
 * @param {Date|string} date
 * @returns {number}
 */
function getAge(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const ageDifMs = Date.now() - date.getTime();
  const ageDate  = new Date(ageDifMs);

  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default {
  getAge,
  getYear,
  getMonth,
  getDayOfMonth,
  getCalendarDate,
  getCalendar,
  daysInAMonth
};
