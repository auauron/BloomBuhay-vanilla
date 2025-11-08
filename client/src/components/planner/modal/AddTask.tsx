import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Task } from "../../../types/plan";
import { BloomDate } from "../../../types/plan";
import { AddTaskModalProps } from "../../../types/plan";

function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

export default function AddTaskModal() {

  // const now: BloomDate = {
  //       day: new Date().getDay(),
  //       month: new Date().getMonth(),
  //       year: new Date().getFullYear()
  //     }

  // const [form, setForm] = useState<Task>({
  //     task: "Task",
  //     description: null,
  //     isCompleted: false,
  //     startDate: now
  // });

  // const [isSingleDate, setSingleDate] = useState(true);
  // const [isWholeDay, setWholeDay] = useState(true);
  // const [isEveryday, setEveryday] = useState(false)
  // const [isWeekly, setWeekly] = useState(false)
  // const [isInterval, setInterval] = useState(false)

  // const handleSingleDay = () => {
  //   const properties: string[] = ["task", "description", "isCompleted", "startDate"]
  //   if (!isSingleDate) {
  //     if (isEveryday) {

  //     } else if (isWeekly) {

  //     } else {

  //     }
  //   }

  //   if(!isWholeDay) {
  //     properties.push("time")
  //   }
  // }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-gradient-to-r from-bloomPink via-[#F5ABA1] to-bloomYellow text-white p-4 rounded-[20px] shadow-lg relative items-center">
          {/* Header */}
          <h3 className="text-2xl text-white font-bold flex items-center justify-center gap-4 p-2 mb-2">
            <span className="flex-1 text-center">Add Task</span>

            {/* Add Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-8 h-8 text-white" />
            </motion.button>
          </h3>

        <div className="bg-white rounded-xl p-4 text-[#474747] max-h-[500px] overflow-y-auto shadow-inner">
          {/* Title input */}
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Title"
              className="w-full border border-bloomBlack/50 outline-none text-bloomBlack placeholder-bloomBlack/50 text-[12px] font-bold bg-White shadow-md rounded-full px-3 focus:placeholder-bloomPink/50 focus:border-bloomPink focus:text-bloomPink focus:bg-bloomYellow/25"
            />

            <span className="h-[24px] w-[24px] bg-bloomPink border border-bloomPink rounded-[12px]">

            </span>
          </div>

          {/* Description input */}
          <textarea
            placeholder="Description..."
            rows={3}
            className="w-full border outline-none bg-bloomWhite shadow-md rounded-2xl py-2 px-3 resize-none focus:ring-2 focus:ring-bloomPink"
          />

          {/* Date range */}
          <div className="flex items-center justify-center gap-3">
            <div className="px-4 py-1 bg-gradient-to-r from-bloomPink to-bloomYellow text-white font-semibold rounded-full shadow">
              Oct 12, 2025
            </div>
            <span className="font-bold text-gray-500">⇒</span>
            <div className="px-4 py-1 bg-gradient-to-r from-bloomPink to-bloomYellow text-white font-semibold rounded-full shadow">
              Oct 26, 2025
            </div>
          </div>

          {/* Single Date toggle */}
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-700">Single Date</p>
            <div className="w-10 h-5 bg-gray-400 rounded-full relative">
              <div className="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow transition" />
            </div>
          </div>

          {/* Day selection */}
          <p className="text-bloomPink font-semibold">
            • Every Mon, Wed, Thu
          </p>
          <div className="flex justify-center gap-2">
            {["Su", "M", "Tu", "W", "Th", "F", "Sa"].map((day, i) => (
              <div
                key={i}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold shadow ${
                  ["M", "W", "Th"].includes(day)
                    ? "bg-gradient-to-r from-bloomPink to-bloomYellow text-white"
                    : "border border-bloomPink text-bloomPink"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Interval option */}
          <div className="flex items-center gap-2">
            <input type="radio" name="repeat" className="accent-bloomPink" />
            <span className="font-semibold text-gray-700">Every __ days</span>
          </div>

          {/* Whole Day toggle */}
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-700">Whole Day</p>
            <div className="w-10 h-5 bg-gray-400 rounded-full relative">
              <div className="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow transition" />
            </div>
          </div>

          {/* Time picker mock */}
          <div className="flex justify-center items-center gap-2">
            <div className="text-center text-3xl font-bold bg-gradient-to-r from-bloomPink to-bloomYellow bg-clip-text text-transparent">
              12 : 00 pm
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <button className="w-32 py-2 rounded-full border border-bloomPink text-bloomPink font-semibold hover:bg-pink-50 transition">
              Cancel
            </button>
            <button className="w-32 py-2 rounded-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white font-semibold shadow hover:opacity-90 transition">
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


