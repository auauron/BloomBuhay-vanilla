import React from "react";
import { useState } from "react";
import "../index.css";
import Header from '../components/ui/Header';
import Sidebar from "../components/ui/Sidebar";
import CalendarComponent from "../components/CalendarComponent";
import ToDoListComponent from "../components/ToDoListComponent";



export default function Planner() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Example: State to hold all tasks, which might be linked to a date
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Plan project structure', completed: false, date: new Date(2025, 9, 30) }, // Use actual date objects
    { id: 2, text: 'Review calendar component code', completed: true, date: new Date(2025, 10, 5) },
  ]);

  // Example: State for the currently selected date in the calendar
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); 

  // Functions to pass to the TodoListComponent for management
  const addTask = (text: string, date: Date) => {
    const newTask = { id: Date.now(), text, completed: false, date };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

    // Filter tasks for the selected day to pass to the ToDo list
  const tasksForSelectedDate = tasks.filter(task => 
    task.date.toDateString() === selectedDate.toDateString()
  );

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
            <CalendarComponent 
              selectedDate={selectedDate} 
              onDateSelect={setSelectedDate} 
              allTasks={tasks} // Pass tasks to mark days with tasks
            />
          </div>
        </div>

        {/* To Do */}
        <div className="bg-gradient-to-r from-bloomPink via-[#F5ABA1] to-bloomYellow text-white p-4 rounded-[20px] shadow-lg relative">
          <h3 className="text-2xl mb-2 text-white font-bold">To Do</h3>
          <div className="bg-white rounded-xl text-[#474747] h-72 md:h-96">
            <ToDoListComponent 
              tasks={tasksForSelectedDate} 
              addTask={addTask} 
              toggleTaskCompletion={toggleTaskCompletion}
              currentDate={selectedDate} // Pass current date for new tasks
            />
          </div>
        </div>
      </div>
    </div>
  );
}