import React, { useState } from "react";
import "../index.css";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import CalendarView from "../components/planner/Calendar";
import ToDoList from "../components/planner/ToDoList";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { getNow, translateBloomdate, translateDateStringToBloomDate } from "../components/planner/PlannerFuntions";
import { BloomDate } from "../types/plan";

export default function Planner() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const now: BloomDate = getNow()
  const today: string = translateBloomdate(now)
  const [selectedDay, setSelectedDay] = useState<string | null>(today);
  const [month, setMonth] = useState(now.month);
  const [year, setYear] = useState(now.year);
  const [showPicker, setShowPicker] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  console.log(selectedDay)
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col h-screen font-poppins bg-bloomWhite">
        <Header onMenuClick={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Planner Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {/* Subheader */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-2xl shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-bloomPink">Planner</h1>
            </div>
            <p className="text-bloomBlack font-rubik text-lg font-light">
              Your journey, organized.
            </p>
          </div>

          {/* Calendar + To-Do Layout */}
          <div className="grid grid-cols-1 md:grid-cols-[59%_39%] gap-[2%] max-w-7xl mx-auto w-full">
            {/* Calendar Section */}
            <div className="rounded-[22px] shadow-md bg-bloomPink p-[2px]">
              <CalendarView
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              month={month}
              setMonth={setMonth}
              year={year}
              setYear={setYear}
              showPicker={showPicker}
              setShowPicker={setShowPicker}
              />
            </div>

            {/* To-Do List Section */}
            <div className="rounded-[22px] shadow-md bg-bloomPink p-[2px]">
              <ToDoList
              selectedDate={translateDateStringToBloomDate((selectedDay === null) ? today : selectedDay)}
              isSelecting={isSelecting}
              onSelectDate={setIsSelecting}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
