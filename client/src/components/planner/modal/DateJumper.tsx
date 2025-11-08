import React, { useState } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DateJumperProps } from "../../../types/plan";

export default function DateJumper({ isOpen, curMonth, curYear, onCancel, onSave }: DateJumperProps) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const [selectedMonth, setSelectedMonth] = useState(curMonth);
  const [selectedYear, setSelectedYear] = useState(curYear);

  const nameMonth = months[selectedMonth]


  const handleSave = () => {
    onSave(selectedMonth, selectedYear);
    onCancel();
  };

  const handleCancel = () => {
    setSelectedMonth(curMonth)
    setSelectedYear(curYear)
    onCancel();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-[30px] shadow-xl p-8 w-[480px] flex flex-col items-center border-2 border-bloomPink"
          >

            <h2 className="text-2xl font-bold text-bloomPink mb-4 w-full">
              Jump to Date {nameMonth} {selectedYear}
            </h2>

            <h3 className="text-xl flex w-[200px] font-bold text-bloomPink flex items-center justify-center mb-4 gap-4 p-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedYear((prev) => prev - 1)
                }}
              >
                <ChevronsLeft className="w-8 h-8" color="#f875aa" />
              </motion.button>

              <span className="flex-1 text-center">
                {selectedYear}
              </span>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedYear((prev) => prev + 1)
                }}
              >
                <ChevronsRight className="w-8 h-8" color="#f875aa" />
              </motion.button>
            </h3>

            <div className="grid grid-cols-4 gap-y-4 gap-x-8 mb-8">
              {months.map((m, i) => (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    key={i}
                    onClick={() => setSelectedMonth(i)}
                    className={`rounded-full h-[80px] w-[80px] font-medium transition-all duration-300 
                    ${selectedMonth === i
                        ? "shadow-md bg-gradient-to-r from-bloomPink to-bloomYellow hover:border-2 hover:border-bloomPink hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-bloomPink to-bloomYellow"
                        : "hover:border-2 hover:border-bloomPink text-transparent bg-clip-text bg-gradient-to-r from-bloomPink to-bloomYellow"
                      }`}
                  >
                    {m}
                  </button>
                </motion.button>
              ))}
            </div>

            <div className="flex justify-between w-full">
              <motion.button
                whileHover={{ scale: 1.1 }}
              >
                <button
                  onClick={handleCancel}
                  className="py-2 w-[200px] rounded-full border border-bloomPink text-bloomPink bg-white hover:bg-gradient-to-r hover:from-bloomPink hover:to-bloomYellow hover:text-white hover:shadow-md"
                >
                  Cancel
                </button>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
              >
                <button
                  onClick={handleSave}
                  className="py-2 w-[200px] rounded-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white shadow-md hover:border hover:border-bloomPink hover:text-bloomPink hover:bg-none hover:bg-white"
                >
                  Save
                </button>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
