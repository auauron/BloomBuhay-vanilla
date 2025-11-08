import React, { useState, useEffect } from "react";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import PregnantTools from "../components/tools/PregnantTools";
import PostpartumTools from "../components/tools/PostpartumTools";
import EarlyChildcareTools from "../components/tools/EarlyChildcareTools";
import { Baby, Calendar, Clock, Heart, Scale, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPersonPregnant } from '@fortawesome/free-solid-svg-icons'
import { faPersonBreastfeeding } from '@fortawesome/free-solid-svg-icons'
import { faChild } from '@fortawesome/free-solid-svg-icons'

export default function BBTools() {
  const [activeStage, setActiveStage] = useState("pregnant");
  const [userStage, setUserStage] = useState("pregnant");

  useEffect(() => {
    // Simulate fetching user stage from database
  }, []);

  const stages = [
    { id: "pregnant", label: "Pregnancy Tools", icon: <FontAwesomeIcon icon={faPersonPregnant} style={{ width:18, height:18}} />},
    { id: "postpartum", label: "Postpartum Tools", icon: <FontAwesomeIcon icon={faPersonBreastfeeding} style={{ width:18, height:18}} /> },
    { id: "childcare", label: "Early Childcare", icon: <FontAwesomeIcon icon={faChild} style={{ width:18, height:18}} />},
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
    
    <div className="flex flex-col h-screen font-poppins bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header Component - Fixed */}
      <Header onMenuClick={toggleSidebar} />
      
      {/* Sidebar Component - Fixed/Overlay */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        
        {/* Page Header */}
        <div className="text-center py-8 px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-2xl shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-bloomPink">
              BB's Tools
            </h1>
          </div>
          <p className="text-bloomBlack font-rubik text-lg font-light max-w-2xl mx-auto">
            Your baby's world, beautifully tracked and tenderly cared for.
          </p>
        </div>

        {/* Stage Selection */}
        <div className="flex justify-center mb-8 px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-2 max-w-xs sm:max-w-lg md:max-w-none">
            <div className="flex flex-col sm:flex-row gap-2">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 w-full sm:w-auto ${
                    activeStage === stage.id
                      ? "bg-gradient-to-r from-bloomPink to-bloomYellow text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {stage.icon}
                  <span className="font-medium text-sm sm:text-base">{stage.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-pink-100 p-6 mb-8 max-w-7xl w-[90%] mx-auto">
          {activeStage === "pregnant" && <PregnantTools />}
          {activeStage === "postpartum" && <PostpartumTools />}
          {activeStage === "childcare" && <EarlyChildcareTools />}
        </div>
      </div>
    </div>
    </motion.div>
  );
}