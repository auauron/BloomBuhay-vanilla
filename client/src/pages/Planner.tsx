import React from "react";
import { useState } from "react";
import "../index.css";
import Header from '../components/ui/Header';
import Sidebar from "../components/ui/Sidebar";
import CalendarView from "../components/CalendarComponent";
import TodoList from "../components/ToDoListComponent";

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
    <div className="min-h-screen bg-pink-50 flex flex-col font-poppins">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/*Greeting*/}
      <div className="flex flex-col item-center text-center mt-8 px-4">
        <h2 className="text-4xl font-bold text-bloomPink">Planner</h2>
        <p className="text-[#474747] font-rubik mt-2 mb-[-5px] font-light text-lg">
          Your journey, organized.
        </p>
      </div>

      {/* Planner Content */}
      <div className="grid grid-cols-1 md:grid-cols-[0.6fr_0.4fr] gap-6 p-8 max-w-6xl mx-auto w-full">

        {/* Calendar */}
        <div className="bg-gradient-to-r from-bloomPink via-[#F5ABA1] to-bloomYellow text-white p-4 rounded-[20px] shadow-lg relative">
          <h3 className="text-2xl mb-2 text-white font-bold">August 2025</h3>
          <div className="bg-white rounded-xl text-[#474747] h-72 md:h-96">
            
          </div>
        </div>

        {/* To Do */}
        <div className="bg-gradient-to-r from-bloomPink via-[#F5ABA1] to-bloomYellow text-white p-4 rounded-[20px] shadow-lg relative">
          <h3 className="text-2xl mb-2 text-white font-bold">To Do</h3>
          <div className="bg-white rounded-xl text-[#474747] h-72 md:h-96">
            
          </div>
        </div>
      </div>
    </div>
  );
}

