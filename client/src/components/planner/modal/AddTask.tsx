import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, number } from "framer-motion";
import { X, ChevronRight, ChevronUp, ChevronDown, Target } from "lucide-react";
import { plannerService } from "../../../services/plannerService";
import { Task, BloomDate, BloomTime } from "../../../types/plan";
import {
  getFullDate,
  getNow,
  getTime,
  taskID,
  translateBloomdate,
  isoToDisplay,
} from "../PlannerFuntions";

interface AddTaskModalProps {
  onClose: () => void;
  onTaskAdded?: () => Promise<void>;
  selectedDate?: string | null;
}

export default function AddTaskModal({
  onClose,
  onTaskAdded,
  selectedDate,
}: AddTaskModalProps) {
  const now: BloomDate = getNow();
  const nowTime: BloomTime = getTime();
  const todayDisplay: string = selectedDate
    ? isoToDisplay(selectedDate)
    : getFullDate(getNow());

  const [form, setForm] = useState<Task>({
    id: taskID(now, nowTime),
    task: "Task",
    description: null,
    isCompleted: false,
    startDate: now,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setIsEditing] = useState(false);
  const [isWholeDay, setWholeDay] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dateStart, setDateStart] = useState(todayDisplay);
  const [dateEnd, setDateEnd] = useState(todayDisplay);
  const [weekly, setWeekly] = useState<string[]>([]);
  const [interval, setInterval] = useState(0);
  const [timeHr, setTimeHr] = useState(6);
  const [timeMin, setTimeMin] = useState(0);
  const [clock, setClock] = useState("AM");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSelectingDate, setIsSelectingDate] = useState(false);
  const [selectedDay, setSelectedDay] = useState(now);

  const handleWholeDay = () => {
    setWholeDay(!isWholeDay);
  };

  const handleClose = () => {
    onClose();
  };

  const handleAdd = async () => {
    if (isSubmitting) return;

    // Validate that title is not empty
    if (!title.trim()) {
      setHasError(true);
      return;
    }

    setHasError(false);
    setIsSubmitting(true);

    try {
      const [day, month, year] = dateStart.split("/").map(Number);
      const isoDate = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;

      let isoDateTime: string;

      if (!isWholeDay) {
        // Use the selected time from the time picker
        let hour = timeHr;

        // Handle special cases for 12 AM and 12 PM
        if (clock === "AM" && hour === 12) {
          hour = 0; // 12 AM becomes 00
        } else if (clock === "PM" && hour !== 12) {
          hour += 12; // 1 PM becomes 13, 2 PM becomes 14, etc.
        }
        // 12 PM remains 12, 1-11 AM remain as-is

        const hh = String(hour).padStart(2, "0");
        const mm = String(timeMin).padStart(2, "0");
        isoDateTime = `${isoDate}T${hh}:${mm}:00`;
      } else {
        // If whole day task, use current time (time task was created)
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        isoDateTime = `${isoDate}T${hh}:${mm}:${ss}`;
      }

      console.log("Sending datetime to backend:", isoDateTime);

      const response = await plannerService.createTask({
        title: title.trim() || "New Task",
        description: description.trim(),
        date: isoDateTime,
      });

      if (response.success) {
        console.log("Task created successfully:", response.data);
        await onTaskAdded?.();
        onClose();
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handelStartDate = () => {};

  const handleTimeMin = (val: number) => {};

  const handleChangeClock = () => {
    clock === "AM" ? setClock("PM") : setClock("AM");
  };

  return (
    <AnimatePresence>
      <motion.div
        key="add-task-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-gradient-to-br from-[#F875AA] via-[#FDAB9F] to-[#F3E198] rounded-3xl shadow-xl"
      >
        <div className="p-6 flex flex-col h-[550px]">
          {/* Decorative elements */}
          {/* Header */}
          <div className="relative z-10 mb-6 flex-shrink-0">
            <h3 className="text-3xl font-semibold text-white mb-2 text-center">
              Add New Task
            </h3>
            <p className="text-sm text-white/90 text-center">
              One task at a time, mama!
            </p>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="absolute top-0 right-0 p-2 text-white hover:text-white/80 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="flex flex-col justify-between bg-white/95 backdrop-blur-sm rounded-2xl p-5 text-bloomBlack flex-1 overflow-hidden shadow-inner">
            <div className="w-full overflow-y-auto flex-1">
              <div className="space-y-4 relative z-10">
                {/* Task Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-bloomBlack/70">
                    Task Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (hasError && e.target.value.trim()) {
                          setHasError(false);
                        }
                      }}
                      className={`w-full px-3 py-2 rounded-lg bg-white/80 border text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 shadow-sm text-sm ${
                        hasError
                          ? "border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 focus:ring-bloomPink/20"
                      }`}
                      placeholder="What do you need to do?"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className={`h-5 w-5 ${
                          hasError ? "text-red-500" : "text-bloomPink/40"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                  </div>
                  {hasError && (
                    <p className="text-red-500 text-xs mt-1">
                      Please enter a task name
                    </p>
                  )}
                </div>

                <AnimatePresence>
                  {false && (
                    <motion.div
                      key="day-selector"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Day selection */}
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          name="daySelection"
                          className="appearance-none w-3 h-3 border border-bloomBlack/50 rounded-full checked:bg-bloomPink checked:border-bloomPink checked:shadow transition-all duration-300 cursor-pointer"
                        />
                        <span className="font-bold text-bloomBlack">
                          Everyday
                        </span>
                      </div>

                      <div className="flex justify-evenly w-full gap-2 mb-2">
                        {["Su", "M", "Tu", "W", "Th", "F", "Sa"].map(
                          (day, i) => (
                            <div
                              key={i}
                              className={`w-[32px] h-[32px] flex items-center justify-center rounded-full text-sm font-bold ${
                                weekly.includes(day)
                                  ? "bg-gradient-to-r from-bloomPink to-bloomYellow text-white shadow scale-105"
                                  : "border border-bloomPink text-bloomPink hover:bg-bloomYellow/50 hover:scale-105"
                              }`}
                              onClick={() => {
                                !weekly.includes(day)
                                  ? setWeekly(weekly.concat(day))
                                  : setWeekly(weekly.filter((x) => x !== day));
                              }}
                            >
                              {day}
                            </div>
                          )
                        )}
                      </div>

                      {/* Interval option */}
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          name="daySelection"
                          className="appearance-none w-3 h-3 border border-bloomBlack/50 rounded-full checked:bg-bloomPink checked:border-bloomPink checked:shadow transition-all duration-300 cursor-pointer"
                        />
                        <div className="px-1"></div>
                        <span className="font-bold text-bloomBlack pr-1">
                          Every
                        </span>
                        <input
                          type="number"
                          className="w-[30px] outline-none text-left text-bloomblack placeholder-bloomBlack font-bold bg-White rounded-[6px] focus:border-bloomBlack focus:shadow"
                          placeholder="_"
                          value={interval}
                          onChange={(e) => setInterval(Number(e.target.value))}
                          min={0}
                        />
                        <span className="font-bold text-bloomBlack">days</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Whole Day toggle */}
                <motion.div
                  layout
                  className="flex justify-between items-center mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-semibold text-bloomBlack/80">Whole Day</p>

                  <motion.div
                    layout
                    onClick={handleWholeDay}
                    className={`w-[45px] h-[24px] p-[2px] flex flex-row items-center rounded-full relative"
                    ${isWholeDay ? "justify-end" : "justify-start"}`}
                    style={{
                      background: isWholeDay
                        ? "linear-gradient(to right, #F875AA, #F3E198)"
                        : "#474747",
                    }}
                    animate={{
                      background: isWholeDay
                        ? "linear-gradient(to right, #F875AA, #F3E198)"
                        : "#474747",
                    }}
                  >
                    <motion.div
                      layout
                      className="bg-white p-[10px] rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                    />
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {!isWholeDay && (
                    <motion.div
                      layout
                      key="time-selector"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-center items-center gap-1 mb-2">
                        <div className="flex flex-col justify-center items-center w-[80px]">
                          <input
                            type="number"
                            className="w-full outline-none text-3xl text-center text-bloomBlack placeholder-bloomBlack font-bold bg-white border border-gray-200 rounded-lg focus:border-bloomPink focus:shadow py-1"
                            value={timeHr}
                            onChange={(e) => {
                              let hrInput = Number(e.target.value);
                              if (hrInput < 1) hrInput = 1;
                              if (hrInput > 12) hrInput = 12;
                              setTimeHr(hrInput);
                            }}
                            min={1}
                            max={12}
                          />
                        </div>
                        <div className="text-center text-3xl font-bold text-bloomBlack">
                          :
                        </div>
                        <div className="flex flex-col justify-center items-center w-[80px]">
                          <input
                            type="number"
                            className="w-full outline-none text-3xl text-center text-bloomBlack placeholder-bloomBlack font-bold bg-white border border-gray-200 rounded-lg focus:border-bloomPink focus:shadow py-1"
                            value={timeMin}
                            onChange={(e) => {
                              let minInput = Number(e.target.value);
                              if (minInput < 0) minInput = 0;
                              if (minInput > 59) minInput = 59;
                              setTimeMin(minInput);
                            }}
                            min={0}
                            max={59}
                          />
                        </div>
                        <div className="flex flex-col justify-center items-center w-[50px]">
                          <div
                            className="w-[50px] text-center text-2xl font-bold text-bloomBlack bg-white border border-gray-200 rounded-lg py-1 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={handleChangeClock}
                          >
                            {clock}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Date & Time Picker */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-bloomBlack/70">
                    Schedule
                  </label>

                  {/* Date Picker (new) */}
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1">
                      <input
                        type="date"
                        value={(() => {
                          const [day, month, year] = dateStart.split("/");
                          return `${year}-${month.padStart(
                            2,
                            "0"
                          )}-${day.padStart(2, "0")}`;
                        })()}
                        onChange={(e) => {
                          const iso = e.target.value; // YYYY-MM-DD
                          const [year, month, day] = iso.split("-");
                          setDateStart(`${day}/${month}/${year}`); // convert back to DD/MM/YYYY
                        }}
                        className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-bloomPink to-bloomYellow text-white font-medium hover:opacity-90 transition-all duration-200 shadow hover:shadow-md text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex-shrink-0 pt-4">
              {/* Buttons */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={handleClose}
                  className="w-28 py-2 rounded-full border-2 border-bloomPink text-bloomPink font-semibold hover:bg-bloomPink/10 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-6 py-2 rounded-full font-semibold shadow-md transition-all text-sm ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:opacity-90 hover:shadow-lg cursor-pointer"
                  }`}
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
