import React, { useState } from "react";
import FeedingLog from "./postpartum/FeedingLog";
import SleepTracker from "./postpartum/SleepTracker";
import DiaperTracker from "./postpartum/DiaperTracker";
import VaccinationTracker from "./postpartum/VaccinationTracker";
import GrowthChart from "./postpartum/GrowthChart";
import PediatricVisitNotes from "./postpartum/PediatricVisitNotes";
import { Utensils, Moon, Baby, Syringe, ChartBar, Stethoscope } from "lucide-react";
import { PostpartumToolsProps } from "../../services/BBToolsService";

const PostpartumTools: React.FC<PostpartumToolsProps> = ({ 
  feedings = [], 
  sleeps = [], 
  growths = [], 
  diapers = [],
  vaccinations = [],
  doctorVisits = [],
  onRefreshData 
}) => {
  const [activeTool, setActiveTool] = useState("feeding");

  const tools = [
    { 
      id: "feeding", 
      label: "Feeding Log", 
      icon: <Utensils className="w-5 h-5" />, 
      component: <FeedingLog feedings={feedings} onRefresh={onRefreshData} /> 
    },
    { 
      id: "sleep", 
      label: "Sleep Tracker", 
      icon: <Moon className="w-5 h-5" />, 
      component: <SleepTracker sleeps={sleeps} onRefresh={onRefreshData} /> 
    },
    { 
      id: "diaper", 
      label: "Diaper Tracker", 
      icon: <Baby className="w-5 h-5" />, 
      component: <DiaperTracker diapers={diapers} onRefresh={onRefreshData} /> 
    },
    { 
      id: "vaccination", 
      label: "Vaccination Tracker", 
      icon: <Syringe className="w-5 h-5" />, 
      component: <VaccinationTracker vaccinations={vaccinations} onRefresh={onRefreshData} /> 
    },
    { 
      id: "growth", 
      label: "Growth Chart", 
      icon: <ChartBar className="w-5 h-5" />, 
      component: <GrowthChart growths={growths} onRefresh={onRefreshData} /> 
    },
    { 
      id: "pediatric", 
      label: "Doctor Visits", 
      icon: <Stethoscope className="w-5 h-5" />, 
      component: <PediatricVisitNotes doctorVisits={doctorVisits} onRefresh={onRefreshData} /> 
    },
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-bloomPink/90 mb-2">Postpartum & Childcare Tools</h2>
        <p className="text-bloomBlack font-rubik font-light mb-0">Guiding you and your baby through life's tender beginnings.</p>
      </div>

      {/* Tool Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
              activeTool === tool.id
                ? "border-bloomPink bg-gradient-to-r from-bloomPink/10 to-bloomYellow/10 shadow-lg scale-105"
                : "border-gray-200 hover:border-bloomPink/50 hover:bg-gray-50"
            }`}
          >
            <div className="p-3 bg-gradient-to-tl from-bloomYellow to-bloomPink rounded-xl text-white mb-2">
              {tool.icon}
            </div>
            <span className="text-sm font-medium text-gray-700 text-center leading-tight">
              {tool.label}
            </span>
          </button>
        ))}
      </div>

      {/* Active Tool Display */}
      <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
        {tools.find(tool => tool.id === activeTool)?.component}
      </div>
    </div>
  );
};

export default PostpartumTools;