import React, { useState, useMemo } from "react";
import { ChevronsLeft, ChevronsRight, Calendar } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import DateJumper from "./modal/DateJumper";
import { BloomDate } from "../../types/plan";
import { createCalendar, translateBloomdate, isLeapYear, getDayOfWeek, getNow } from "./PlannerFuntions";

export default function CalendarView() {
  const now: BloomDate = getNow()
  const [selectedDay, setSelectedDay] = useState<string | null>(translateBloomdate(now));
  const [month, setMonth] = useState(now.month);
  const [year, setYear] = useState(now.year);
  const [showPicker, setShowPicker] = useState(false);

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const handleSelect = (id: string) => {
    setSelectedDay((prev) => (prev === id ? null : id));
  };

  const calendar = useMemo(() => createCalendar(month, year), [month, year]);
  const today: string = translateBloomdate(now);

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
        <AnimatePresence>
          <motion.div 
          className="bg-white h-[500px] rounded-xl p-4 text-[#474747]"
          key="calendar"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-7 gap-3">
              {daysOfWeek.map((d) => (
                <div
                  key={d}
                  className="border border-bloomYellow bg-bloomPink-50 text-center rounded-xl py-4 font-semibold"
                >
                  {d}
                </div>
              ))}

              {calendar.map((date) => {
                const id = translateBloomdate(date);
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
                    {date.date}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
        <DateJumper
          isOpen={showPicker}
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
