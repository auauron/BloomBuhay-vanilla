import React, { useState } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CalendarView() {

  const [currentMonth, setCurrentMonth] = useState((new Date()).getMonth())
  const [currentYear, setCurrentYear] = useState((new Date()).getFullYear())

  const daysOfTheWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Checks for leap year
  function isLeapYear(year: number): boolean {
    if (year % 400 === 0) return true;
    if (year % 100 === 0) return false;
    return year % 4 === 0;
  }

  //What day of the week was that day of the month
  function dayOfTheMonth(day: number, year: number, month: number): number {
    if (month < 3) {
      month += 12;
      year -= 1;
    }

    const K = year % 100;
    const J = Math.floor(year / 100);

    return (
      (day + 2 + Math.floor((13 * (month + 1)) / 5) + K + Math.floor(K / 4) + Math.floor(J / 4) + 5 * J) % 7
    );
  }

  // Calendar generator using arrays
  function createCalendar(month: number, year: number): number[][] {

    const prevMonth = (month === 0) ? 11 : month - 1
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (isLeapYear(year)) daysInMonths[1] = 29;

    const firstDay = dayOfTheMonth(1, year, month);
    const calendar: number[][] = Array.from({ length: (Math.ceil((daysInMonths[month] + firstDay)/7)) }, () => []);

    for (let i = 0; i < calendar.length; i++) {
      for (let j = 0; j < 7; j++) {
        const day = (7 * i + j) - firstDay + 1;
        if (day < 1) {
          calendar[i].push(daysInMonths[prevMonth] + day);
        } else if (day > daysInMonths[month]) {
          calendar[i].push(day - daysInMonths[month]);
        } else {
          calendar[i].push(day);
        }
      }
    }
    return calendar;
  }


  const currentCalendar: number[][] = createCalendar(currentMonth, currentYear);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
    <div className="bg-gradient-to-r from-bloomPink via-[#F5ABA1] to-bloomYellow text-white p-4 rounded-[20px] shadow-lg relative items-center">
        <h3 className="text-2xl mb-2 text-white font-bold text-center items-center flex col">

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}>
          <button
          onClick={() => {
            setCurrentMonth((currentMonth === 0) ? currentMonth + 11 : currentMonth - 1);
            setCurrentYear((currentMonth === 0) ? currentYear - 1 : currentYear)
            }}>
            <ChevronsLeft className="w-8 h-8 text-white" />
          </button>
          </motion.button>

          {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })}
          {" "}
          {currentYear}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}>
          <button
          onClick={() => {
            setCurrentMonth((currentMonth === 11) ? currentMonth - 11 : currentMonth + 1)
            setCurrentYear((currentMonth === 11) ? currentYear + 1 : currentYear)
            }}>
            <ChevronsRight className="w-8 h-8 text-white" />
          </button>
          </motion.button>
        </h3>
        <div className="bg-white rounded-xl text-[#474747] h-72 md:h-96">
          <div className="grid grid-cols-7 grid-rows-7 gap-1">
            {daysOfTheWeek.map((day) => (
              <div className="p-3 group relative bg-gradient-to-r from-pink-50 to-pink-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 text-center">
                {day}
                </div>
              ))}
            {currentCalendar.map((week) => (
              week.map((day) => (
              <div className="p-3 group relative bg-gradient-to-r from-pink-50 to-pink-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 text-center">
                {day}
                </div>
              ))))}
        </div>
      </div>
    </div>
    </motion.div>
  );
}
