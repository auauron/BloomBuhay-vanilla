import React from "react";
import { useState } from "react";
import "../index.css";
import Header from '../components/ui/Header';
import Sidebar from "../components/ui/Sidebar";
import CalendarView from "../components/planner/Calendar";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

type Task = {
  id: number;
  text: string;
  date: Date;
  completed: boolean;
};

export default function Planner() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);

  function addTask(task: Task): void {
    setTasks((prev) => [...prev, task]);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

    <div className="flex flex-col h-screen font-poppins bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Planner Content */}
      <div className="flex-1 overflow-y-auto min-h-0">

        {/*Subheader*/}
        <div className="text-center py-8 px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-2xl shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-bloomPink">
              Planner
            </h1>
          </div>
          <p className="text-bloomBlack font-rubik text-lg font-light max-w-2xl mx-auto">
            Your journey, organized.
          </p>
        </div>

        {/* Calendar */}
        <CalendarView />

        {/* To Do */}
        <div className="bg-gradient-to-r from-bloomPink via-[#F5ABA1] to-bloomYellow text-white p-4 rounded-[20px] shadow-lg relative">
          <h3 className="text-2xl mb-2 text-white font-bold">To Do</h3>
          <div className="bg-white rounded-xl text-[#474747] h-72 md:h-96">
            
          </div>
        </div>
      </div>
    </div>
    </motion.div>
  );
}

