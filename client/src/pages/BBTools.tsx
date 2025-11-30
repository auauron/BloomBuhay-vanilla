import React, { useState, useEffect } from "react";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import PregnantTools from "../components/tools/PregnantTools";
import PostpartumChildcareTools from "../components/tools/PostpartumTools";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPersonPregnant, faBaby } from '@fortawesome/free-solid-svg-icons'
import { bbtoolsService, BBMetric, FeedingLog, SleepLog, GrowthRecord, DiaperLog, VaccinationLog, DoctorVisitLog } from "../services/BBToolsService";

export default function BBTools() {
  const [activeStage, setActiveStage] = useState("pregnant");
  const [userStage, setUserStage] = useState("pregnant");
  const [metrics, setMetrics] = useState<BBMetric[]>([]);
  const [feedings, setFeedings] = useState<FeedingLog[]>([]);
  const [sleeps, setSleeps] = useState<SleepLog[]>([]);
  const [growths, setGrowths] = useState<GrowthRecord[]>([]);
  const [diapers, setDiapers] = useState<DiaperLog[]>([]);
  const [vaccinations, setVaccinations] = useState<VaccinationLog[]>([]);
  const [doctorVisits, setDoctorVisits] = useState<DoctorVisitLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await bbtoolsService.getAll();
      if (res.success && res.data) {
        setMetrics(res.data.metrics || []);
        setFeedings(res.data.feedings || []);
        setSleeps(res.data.sleeps || []);
        setGrowths(res.data.growths || []);
        setDiapers(res.data.diapers || []);
        setVaccinations(res.data.vaccinations || []);
        setDoctorVisits(res.data.doctorVisits || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const refreshData = async () => {
    const res = await bbtoolsService.getAll();
    if (res.success && res.data) {
      setMetrics(res.data.metrics || []);
      setFeedings(res.data.feedings || []);
      setSleeps(res.data.sleeps || []);
      setGrowths(res.data.growths || []);
      setDiapers(res.data.diapers || []);
      setVaccinations(res.data.vaccinations || []);
      setDoctorVisits(res.data.doctorVisits || []);
    }
  };

  const stages = [
    { 
      id: "pregnant", 
      label: "Pregnancy Tools", 
      icon: <FontAwesomeIcon icon={faPersonPregnant} style={{ width:18, height:18}} />,
      description: "Track your pregnancy journey"
    },
    { 
      id: "postpartum_childcare", 
      label: "Postpartum & Baby Care", 
      icon: <FontAwesomeIcon icon={faBaby} style={{ width:18, height:18}} />,
      description: "Postpartum & early childcare tools"
    },
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
    <div className="flex flex-col h-screen font-poppins bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="text-center py-8 px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-2xl shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-bloomPink">BB's Tools</h1>
          </div>
          <p className="text-bloomBlack font-rubik text-lg font-light max-w-2xl mx-auto">
            Your baby's world, beautifully tracked and tenderly cared for.
          </p>
        </div>

        <div className="flex justify-center mb-8 px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-2 max-w-xs sm:max-w-lg md:max-w-none">
            <div className="flex flex-col sm:flex-row gap-2">
              {stages.map((stage) => (
                <button 
                  key={stage.id} 
                  onClick={() => setActiveStage(stage.id)} 
                  className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl transition-all duration-300 w-full sm:w-auto ${
                    activeStage === stage.id 
                      ? "bg-gradient-to-r from-bloomPink to-bloomYellow text-white shadow-lg transform scale-105" 
                      : "text-gray-600 hover:bg-gray-50 hover:scale-102"
                  }`}
                >
                  {stage.icon}
                  <span className="font-medium text-sm sm:text-base">{stage.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stage Description */}
        <div className="text-center mb-6 px-4">
          <p className="text-bloomBlack/70 font-rubik text-sm italic max-w-2xl mx-auto">
            {stages.find(stage => stage.id === activeStage)?.description}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-pink-100 p-6 mb-8 max-w-7xl w-[90%] mx-auto">
          {loading ? (
            <div className="text-center py-8">Loading baby data...</div>
          ) : (
            <>
              {activeStage === "pregnant" && <PregnantTools />}
              {activeStage === "postpartum_childcare" && (
                <PostpartumChildcareTools 
                  feedings={feedings}
                  sleeps={sleeps}
                  growths={growths}
                  diapers={diapers}
                  vaccinations={vaccinations}
                  doctorVisits={doctorVisits}
                  onRefreshData={refreshData}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </motion.div>
  );
}