import React, { useState, useMemo } from "react";
import { ChevronsLeft, ChevronsRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import DateJumper from "./modal/DateJumper";
import { BloomDate } from "../../types/plan";

export default function CalendarView() {
  const now = new Date();
  const [selectedDay, setSelectedDay] = useState<string | null>(
    `${now.getDate()}${now.getMonth()}${now.getFullYear()}`
  );
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [showPicker, setShowPicker] = useState(false);

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const handleSelect = (id: string) => {
    setSelectedDay((prev) => (prev === id ? null : id));
  };

  const isLeapYear = (y: number) =>
    (y % 400 === 0) || (y % 4 === 0 && y % 100 !== 0);

  const getDayOfWeek = (day: number, y: number, m: number): number => {
    if (m < 3) {
      m += 12;
      y -= 1;
    }
    const K = y % 100;
    const J = Math.floor(y / 100);
    const h =
      (day +
        Math.floor((13 * (m + 1)) / 5) +
        K +
        Math.floor(K / 4) +
        Math.floor(J / 4) +
        5 * J) %
      7;
    return (h + 6) % 7; // Convert to 0=Sunday
  };

  const createCalendar = (m: number, y: number): BloomDate[] => {
    const daysInMonth = [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const prevMonth = m === 0 ? 11 : m - 1;
    const nextMonth = m === 11 ? 0 : m + 1;
    const prevYear = m === 0 ? y - 1 : y;
    const nextYear = m === 11 ? y + 1 : y;

    const firstDay = (getDayOfWeek(1, y, m + 1) <= 3) ? getDayOfWeek(1, y, m + 1) + 7 : getDayOfWeek(1, y, m + 1)

    const calendar: BloomDate[] = [];

    

    for (let i = 0; i < 42; i++) {
      const dayNum = i - firstDay + 1;
      if (dayNum < 1) {
        calendar.push({ day: daysInMonth[prevMonth] + dayNum, month: prevMonth, year: prevYear });
      } else if (dayNum > daysInMonth[m]) {
        calendar.push({ day: dayNum - daysInMonth[m], month: nextMonth, year: nextYear });
      } else {
        calendar.push({ day: dayNum, month: m, year: y });
      }
    }
    return calendar;
  };

  const calendar = useMemo(() => createCalendar(month, year), [month, year]);
  const today = `${now.getDate()}${now.getMonth()}${now.getFullYear()}`;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-gradient-to-r from-bloomPink to-bloomYellow text-white p-4 rounded-[20px] shadow-lg">
        {/* Header */}
        <h3 className="text-2xl mb-2 font-bold flex items-center justify-center gap-4 p-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setMonth((prev) => (prev === 0 ? 11 : prev - 1));
              setYear((prev) => (month === 0 ? prev - 1 : prev));
            }}
          >
            <ChevronsLeft className="w-8 h-8 text-white" />
          </motion.button>

          <span className="flex-1 text-center">
            {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
          </span>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowPicker(true)
            }}
          >
            <Calendar className="w-8 h-8 text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setMonth((prev) => (prev === 11 ? 0 : prev + 1));
              setYear((prev) => (month === 11 ? prev + 1 : prev));
            }}
          >
            <ChevronsRight className="w-8 h-8 text-white" />
          </motion.button>
        </h3>

        {/* Calendar */}
        <div className="bg-white h-[500px] rounded-xl p-4 text-[#474747]">
          <div className="grid grid-cols-7 gap-3">
            {daysOfWeek.map((d) => (
              <div
                key={d}
                className="border border-bloomYellow bg-bloomPink-50 text-center rounded-xl py-4 font-semibold"
              >
                {d}
              </div>
            ))}

            {calendar.map((date, i) => {
              const id = `${date.day}${date.month}${date.year}`;
              const isCurrentMonth = date.month === month;
              const isToday = id === today;
              const isSelected = id === selectedDay;

              return (
                <div
                  key={id}
                  onClick={() => {
                    if (!isCurrentMonth) {
                      setMonth(date.month);
                      setYear(date.year);
                    }
                    handleSelect(id);
                  }}
                  className={[
                    "py-4 text-center rounded-2xl transition-all duration-300 cursor-pointer select-none",
                    isSelected
                      ? "border-bloomPink border scale-105"
                      : isToday
                        ? "bg-gradient-to-r from-bloomPink to-bloomYellow text-white shadow-lg hover:scale-105"
                        : isCurrentMonth
                          ? "hover:bg-gradient-to-r from-bloomPink/50 to-bloomYellow/50 hover:shadow-md hover:scale-105"
                          : "text-bloomBlack opacity-60",
                  ].join(" ")}
                >
                  {date.day}
                </div>
              );
            })}
          </div>
        </div>
        <DateJumper
          isOpen={showPicker}
          curMonth={month}
          curYear={year}
          onCancel={() => setShowPicker(false)}
          onSave={(m, y) => {
            setMonth(m);
            setYear(y);
          }}
        />
      </div>
    </motion.div>
  );
}
