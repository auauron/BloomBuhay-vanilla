import { BloomDate, BloomTime } from "../../types/plan";

export function getNow (): BloomDate {
  return { day: new Date().getDay(), date: new Date().getDate(), month: new Date().getMonth(), year: new Date().getFullYear() }
};

export function getTime (): BloomTime {
  return { hour: new Date().getHours(), min: new Date().getMinutes(), sec: new Date().getSeconds() }
}

export function translateBloomdate ( date: BloomDate ): string {
  return `${date.day}/${date.date}/${date.month}/${date.year}`
};

export function getFullDate ( date: BloomDate ) : string {
  return `${date.date}/${date.month}/${date.year}`
}

export function taskID ( date: BloomDate, time: BloomTime ): string {
  return `${date.date}/${date.month}/${date.year}/${time.hour}/${time.min}/${time.sec}`
}

export function createCalendar ( month: number, year: number ): BloomDate[] {
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const prevMonth = month === 0 ? 11 : month - 1;
  const nextMonth = month === 11 ? 0 : month + 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextYear = month === 11 ? year + 1 : year;

  const firstDay = (getDayOfWeek(1, year, month + 1) <= 3) ? getDayOfWeek(1, year, month + 1) + 7 : getDayOfWeek(1, year, month + 1)
  const calendar: BloomDate[] = [];

  for (let i = 0; i < 42; i++) {
    const dayNum = i - firstDay;
    if (dayNum < 1) {
      calendar.push({ day: i % 7, date: daysInMonth[prevMonth] + dayNum, month: prevMonth, year: prevYear });
    } else if (dayNum > daysInMonth[month]) {
      calendar.push({ day: i % 7, date: dayNum - daysInMonth[month], month: nextMonth, year: nextYear });
    } else {
      calendar.push({ day: i % 7, date: dayNum, month: month, year: year });
    }
  }
  return calendar;
};

export function isLeapYear ( year: number ) : boolean {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
};

export function getDayOfWeek ( day: number, year: number, month: number ) {
  if (month < 3) { month += 12; year -= 1; }

  const K = year % 100;
  const J = Math.floor(year / 100);
  const h = (day + Math.floor((13 * (month + 1)) / 5) + K + Math.floor(K / 4) + Math.floor(J / 4) + 5 * J) % 7;
  return (h + 5) % 7;
};