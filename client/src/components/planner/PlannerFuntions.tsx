import { number } from "framer-motion";
import { BloomDate, BloomTime } from "../../types/plan";

export function getNow (): BloomDate {
  return { day: new Date().getDay(), date: new Date().getDate(), month: new Date().getMonth(), year: new Date().getFullYear() }
};

export function getTime (): BloomTime {
  return { hour: new Date().getHours(), min: new Date().getMinutes(), sec: new Date().getSeconds() }
}

export function militaryTime (hour: number, min: number, clock: string): BloomTime {
  if (hour === 12) {
    if (clock === "AM") {
      return {hour: 0, min: min, sec: 0}
    } else {
      return {hour: 12, min: min, sec: 0}
    }
  } else {
    if (clock === "AM") {
      return {hour: hour, min: min, sec: 0}
    } else {
      return {hour: hour + 12, min: min, sec: 0}
    }
  }
}

export function translateBloomdate (date: BloomDate | undefined | null): string {
  if (!date) return 'No date';
  const day = date.day ?? '?';
  const dateNum = date.date ?? '?';
  const month = date.month !== undefined ? date.month + 1 : '?'; // Adding 1 since months are 0-indexed
  const year = date.year ?? '?';
  return `${day}/${dateNum}/${month}/${year}`;
};

export function translateBloomtime ( time: BloomTime ): string {
  return `${time.hour}/${time.min}/${time.sec}`
};

export function translateDateStringToBloomDate ( date: string ) : BloomDate {
  const data = date.split("/"); 
  return { day: Number(data[0]), date: Number(data[1]), month: Number(data[2]), year: Number(data[3]) }
}

export function getFullDate ( date: BloomDate ) : string {
  return `${date.date}/${date.month}/${date.year}`
}

export function taskID ( date: BloomDate, time: BloomTime ): number {
  return Number(`${date.date}${date.month}${date.year}/${time.hour}${time.min}${time.sec}`)
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