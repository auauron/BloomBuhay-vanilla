
function isLeapYear(year: number): boolean {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  return year % 4 === 0;
}

function dayOfTheMonth(day: number, year: number, month: number): number {
  if (month < 3) {
    month += 12;
    year -= 1;
  }

  const K = year % 100;
  const J = Math.floor(year / 100);

  return (
    (day + Math.floor((13 * (month + 1)) / 5) + K + Math.floor(K / 4) + Math.floor(J / 4) + 5 * J) % 7
  );
}

function createCalendar(month: number, year: number): number[][] {
  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeapYear(year)) daysInMonths[1] = 29;

  const firstDay = dayOfTheMonth(1, year, month);

  // determine number of weeks in the calendar grid
  const calendar: number[][] =
    firstDay === 6 && daysInMonths[month] > 29
      ? [[], [], [], [], [], []]
      : [[], [], [], [], []];

  for (let i = 0; i < calendar.length; i++) {
    for (let j = 0; j < 7; j++) {
      const day = 7 * i + j - firstDay + 1;
      if (day < 1) {
        // days from previous month
        const prevMonthDays = daysInMonths[month - 2 < 0 ? 11 : month - 2];
        calendar[i].push(prevMonthDays + day);
      } else if (day > daysInMonths[month - 1]) {
        // days from next month
        calendar[i].push(day - daysInMonths[month - 1]);
      } else {
        calendar[i].push(day);
      }
    }
  }

  return calendar;
}

// Example
console.log(createCalendar(8, 2025));
type Task = {
  id: number;
  text: string;
  date: Date;
  completed: boolean;
};

type CalendarViewProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  tasks: Task[];
};

export default function CalendarView() {

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg border border-pink-100">
      
    </div>
  );
}
