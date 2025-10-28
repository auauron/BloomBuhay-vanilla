import React from "react";
import { useState } from "react";
import "../index.css";
import Header from '../components/Header';
import Sidebar from "../components/Sidebar";


export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col font-poppins">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    

      {/* Greeting */}
      <div className="flex flex-col items-center text-center mt-8 px-4">
        <h2 className="text-4xl font-bold text-[#F875AA]">Hello, Mama Maria!</h2>
        <p className="text-[#474747] font-rubik mt-2 mb-[-5px] font-light text-lg">
          “One day at a time, one heartbeat at a time — you are growing a miracle.”
        </p>
      </div>

    {/* Dashboard Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[550px_1fr] gap-6 p-8 max-w-6xl mx-auto w-full">
        {/* Pregnancy Info */}
        <div className="bg-gradient-to-r from-[#F875AA] via-[#F5ABA1] to-[#F3E198] text-white p-8 rounded-[20px] shadow-lg relative">
            <h3 className="text-2xl font-bold mb-2" >You are now</h3>
            <h1 className="text-4xl font-extrabold leading-tight text-[#474747]">
            6 weeks, 5 days
            </h1>
            <p className="text-2xl font-semibold mb-6">pregnant.</p>
            <p className="text-white/90 text-xl absolute bottom-8 font-rubik font-light">
            Your baby is as big as a <span className="font-bold">tomato!</span>
            </p>
            <div className="absolute bottom-6 right-6 h-40 w-40  bg-white/80 rounded-full border-8 border-white"></div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
            {/* Progress */}
            <div className="bg-gradient-to-r from-[#F875AA] via-[#F5ABA1] to-[#F3E198] text-pink-800 p-6 rounded-[20px] shadow-md font-semibold">
            <h3 className="text-2xl mb-2 text-white font-bold">Progress</h3>
            <div className="w-full bg-white/60 rounded-full h-5 mt-3 overflow-hidden">
                <div className="bg-[#DE085F] h-full w-1/3 rounded-full"></div>
            </div>
            <p className="mt-2 text-lg text-center text-[#DE085F] font-bold">17% complete</p>
            <p className="mt-2 text-lg text-[#474747] font-rubik font-light"><span className="font-bold">Remaining:</span> 83% (33 weeks, 2 days)</p>
            <p className="mt-2 text-lg text-[#474747] font-rubik font-light"><span className="font-bold">Due Date:</span> January 15, 2024</p>
            </div>
            

            {/* To-do + Tips side by side */}
            <div className="grid grid-cols-2 gap-4">

            {/* To-do */}
            <div className="bg-gradient-to-r from-[#F875AA] via-[#F5ABA1] to-[#F3E198] p-6 rounded-[20px] shadow-md">
                <h3 className="text-2xl mb-3 text-white font-bold">To do</h3>
                <ul className="space-y-2 text-sm text-[#474747]">
                <li className="font-rubik font-">
                    <input type="checkbox" className="accent-[#DE085F] mr-2 text-[#474747] font-rubik font-light" />
                    Schedule checkup
                </li>
                <li className="font-rubik font-200">
                    <input type="checkbox" className="accent-[#DE085F] mr-2 text-[#474747] font-rubik font-light" />
                    Ask OB about safe medications for morning sickness
                </li>
                </ul>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-[#F875AA] via-[#F5ABA1] to-[#F3E198] text-pink-800 p-6 rounded-[20px] shadow-md">
                <h3 className="text-2xl mb-3 text-white font-bold">Tips</h3>
                <p className="text-sm text-[#474747] font-200 font-rubik">
                Drink plenty of water 💧 and take short naps when you feel tired.
                </p>
            </div>
            </div>
        </div>
        </div>
        </div>

  );
}
