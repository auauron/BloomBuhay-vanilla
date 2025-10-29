import React from "react";
import { useState } from "react";
import "../index.css";
import Header from '../components/Header';
import Sidebar from "../components/Sidebar";

export default function HealthTracker() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Sample health data
  const healthMetrics = [
    { 
      title: "Weight", 
      value: "62 kg", 
      change: "+1.2 kg", 
      trend: "up",
      icon: "⚖️",
      color: "from-[#F875AA] to-[#F5ABA1]"
    },
    { 
      title: "Blood Pressure", 
      value: "110/70", 
      change: "Stable", 
      trend: "stable",
      icon: "❤️",
      color: "from-[#F875AA] to-[#F4C69D]"
    },
    { 
      title: "Sleep", 
      value: "7.5 hrs", 
      change: "+0.5 hrs", 
      trend: "up",
      icon: "😴",
      color: "from-[#F5ABA1] to-[#F3E198]"
    },
    { 
      title: "Water Intake", 
      value: "2.1 L", 
      change: "-0.3 L", 
      trend: "down",
      icon: "💧",
      color: "from-[#F875AA] to-[#F5ABA1]"
    }
  ];

  const weeklySymptoms = [
    { day: "Mon", symptom: "Morning Sickness", intensity: "High" },
    { day: "Tue", symptom: "Fatigue", intensity: "Medium" },
    { day: "Wed", symptom: "Food Cravings", intensity: "Low" },
    { day: "Thu", symptom: "Back Pain", intensity: "Medium" },
    { day: "Fri", symptom: "Mood Swings", intensity: "High" }
  ];

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col font-poppins">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Page Header */}
      <div className="flex flex-col items-center text-center mt-8 px-4">
        <h2 className="text-4xl font-bold text-[#F875AA]">Health Tracker</h2>
        <p className="text-[#474747] font-rubik mt-2 font-light text-lg">
          Track your wellness journey throughout pregnancy
        </p>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 max-w-7xl mx-auto w-full">
        {healthMetrics.map((metric, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-r ${metric.color} text-white p-6 rounded-[20px] shadow-lg relative min-h-[140px]`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">{metric.title}</h3>
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className={`text-sm mt-2 ${
                  metric.trend === 'up' ? 'text-green-200' : 
                  metric.trend === 'down' ? 'text-red-200' : 'text-yellow-200'
                }`}>
                  {metric.change}
                </p>
              </div>
              <span className="text-2xl">{metric.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8 max-w-7xl mx-auto w-full">
        
        {/* Symptoms Tracker */}
        <div className="bg-gradient-to-r from-[#F875AA] via-[#F5ABA1] to-[#F3E198] text-white p-6 rounded-[20px] shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Weekly Symptoms</h3>
          <div className="space-y-3">
            {weeklySymptoms.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-white/20 p-3 rounded-lg">
                <div>
                  <span className="font-semibold">{item.day}</span>
                  <span className="ml-4">{item.symptom}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.intensity === 'High' ? 'bg-red-400' :
                  item.intensity === 'Medium' ? 'bg-yellow-400' :
                  'bg-green-400'
                }`}>
                  {item.intensity}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-white/30 hover:bg-white/40 text-white font-semibold py-2 rounded-lg transition-colors">
            + Add Symptom
          </button>
        </div>

        {/* Medical Appointments */}
        <div className="bg-gradient-to-r from-[#F875AA] to-[#F4C69D] text-white p-6 rounded-[20px] shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            <div className="bg-white/20 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">Monthly Checkup</h4>
                  <p className="text-sm">Dr. Rodriguez</p>
                </div>
                <span className="bg-white/30 px-2 py-1 rounded text-sm">Nov 15</span>
              </div>
              <p className="text-sm mt-2">10:00 AM - Mother & Child Clinic</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">Ultrasound Scan</h4>
                  <p className="text-sm">Dr. Santos</p>
                </div>
                <span className="bg-white/30 px-2 py-1 rounded text-sm">Nov 22</span>
              </div>
              <p className="text-sm mt-2">2:30 PM - Imaging Center</p>
            </div>
          </div>
          <button className="w-full mt-4 bg-white/30 hover:bg-white/40 text-white font-semibold py-2 rounded-lg transition-colors">
            Schedule Appointment
          </button>
        </div>

        {/* Medication Tracker */}
        <div className="bg-gradient-to-r from-[#F5ABA1] to-[#F3E198] text-white p-6 rounded-[20px] shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Today's Medications</h3>
          <div className="space-y-3">
            {[
              { name: "Prenatal Vitamins", time: "8:00 AM", taken: true },
              { name: "Folic Acid", time: "12:00 PM", taken: false },
              { name: "Iron Supplement", time: "6:00 PM", taken: false }
            ].map((med, index) => (
              <div key={index} className="flex justify-between items-center bg-white/20 p-3 rounded-lg">
                <div>
                  <span className="font-semibold">{med.name}</span>
                  <span className="ml-4 text-sm">{med.time}</span>
                </div>
                <button className={`w-6 h-6 rounded-full border-2 ${
                  med.taken ? 'bg-green-400 border-green-400' : 'border-white'
                }`}></button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-[#F875AA] via-[#F4C69D] to-[#F3E198] text-white p-6 rounded-[20px] shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white/30 hover:bg-white/40 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
              <span className="text-2xl mb-2">📊</span>
              <span className="font-semibold">Add Measurement</span>
            </button>
            <button className="bg-white/30 hover:bg-white/40 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
              <span className="text-2xl mb-2">📝</span>
              <span className="font-semibold">Log Symptom</span>
            </button>
            <button className="bg-white/30 hover:bg-white/40 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
              <span className="text-2xl mb-2">💊</span>
              <span className="font-semibold">Medication</span>
            </button>
            <button className="bg-white/30 hover:bg-white/40 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
              <span className="text-2xl mb-2">📅</span>
              <span className="font-semibold">Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}