import React, { useState } from "react";
import NutritionLog from "../tools/childcare/NutritionLog";
import SleepActivitySchedule from "../tools/childcare/SleepActivitySchedule";
import VaccinationReminders from "../tools/childcare/VaccinationReminders";
import { Utensils, Clock, Bell, Activity } from "lucide-react";

const EarlyChildcareTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState("nutrition");

  const tools = [
    { id: "nutrition", label: "Nutrition Log", icon: <Utensils className="w-5 h-5" />, component: <NutritionLog /> },
    { id: "schedule", label: "Sleep & Activity", icon: <Clock className="w-5 h-5" />, component: <SleepActivitySchedule /> },
    { id: "vaccination", label: "Vaccination Reminders", icon: <Bell className="w-5 h-5" />, component: <VaccinationReminders /> },
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-bloomPink/90 mb-2">Early Childcare Tools</h2>
        <p className="text-bloomBlack font-rubik font-light">Cherish every giggle, step, and story — watch your baby bloom.</p>
      </div>

      {/* Tool Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 ${
              activeTool === tool.id
                ? "border-bloomPink bg-gradient-to-r from-bloomPink/10 to-bloomYellow/10 shadow-lg scale-105"
                : "border-gray-200 hover:border-bloomPink/50 hover:bg-gray-50"
            }`}
          >
            <div className="p-3 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl text-white mb-3">
              {tool.icon}
            </div>
            <span className="text-sm font-medium text-gray-700 text-center leading-tight">
              {tool.label}
            </span>
          </button>
        ))}
      </div>

      {/* Active Tool Display */}
      <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
        {tools.find(tool => tool.id === activeTool)?.component}
      </div>
    </div>
  );
};

export default EarlyChildcareTools;