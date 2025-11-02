import React, { useState } from "react";
import DueDateCalculator from "../tools/pregnant/DueDateCalculator";
import KickCounter from "./pregnant/KickCounter";
import ContractionTimer from "../tools/pregnant/ContractionTimer";
import HeartbeatMonitor from "../tools/pregnant/HeartbeatMonitor";
import BMICalculator from "../tools/pregnant/BMICalculator";
import DeliveryTimeline from "../tools/pregnant/DeliveryTimeline";
import { Calendar, Footprints, Clock, Heart, Scale, Sunrise } from "lucide-react";

const PregnantTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState("dueDate");

  const tools = [
    { id: "dueDate", label: "Due Date Calculator", icon: <Calendar className="w-5 h-5" />, component: <DueDateCalculator /> },
    { id: "kickCounter", label: "Kick Counter", icon: <Footprints className="w-5 h-5" />, component: <KickCounter /> },
    { id: "contractionTimer", label: "Contraction Timer", icon: <Clock className="w-5 h-5" />, component: <ContractionTimer /> },
    { id: "heartbeat", label: "Heartbeat Monitor", icon: <Heart className="w-5 h-5" />, component: <HeartbeatMonitor /> },
    { id: "bmi", label: "BMI Calculator", icon: <Scale className="w-5 h-5" />, component: <BMICalculator /> },
    { id: "timeline", label: "Delivery Timeline", icon: <Sunrise className="w-5 h-5" />, component: <DeliveryTimeline /> },
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-bloomPink/90 mb-2">Pregnancy Tools</h2>
        <p className="text-bloomBlack font-rubik font-light">Every kick, every change — beautifully guided for you and baby.</p>
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
            <div className="p-3 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl text-white mb-2">
              {tool.icon}
            </div>
            <span className="text-sm font-medium text-bloomBlack text-center leading-tight">
              {tool.label}
            </span>
          </button>
        ))}
      </div>

      {/* Active Tool Display */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
        {tools.find(tool => tool.id === activeTool)?.component}
      </div>
    </div>
  );
};

export default PregnantTools;