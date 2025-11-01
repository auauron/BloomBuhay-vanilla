import React, { useState } from "react";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import MetricCard from "../components/health/MetricCard";
import AddMetricModal from "../components/health/AddMetricModal";
import MoodTracker from "../components/health/MoodTracker";
import SymptomsList from "../components/health/SymptomsList";

export default function HealthTracker() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState([
    { title: "Weight", value: "62 kg", change: "+1.2 kg", trend: "up", icon: "⚖️", color: "from-[#F875AA] to-[#F5ABA1]" },
    { title: "Blood Pressure", value: "110/70", change: "Stable", trend: "stable", icon: "❤️", color: "from-[#F875AA] to-[#F4C69D]" },
    { title: "BMI", value: "23.4", change: "Healthy", trend: "stable", icon: "📊", color: "from-[#F5ABA1] to-[#F3E198]" },
    { title: "Water Intake", value: "2.1 L", change: "-0.3 L", trend: "down", icon: "💧", color: "from-[#F875AA] to-[#F5ABA1]" },
  ]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const addMetric = (metric: any) => setHealthMetrics([...healthMetrics, metric]);
  const removeMetric = (index: number) => setHealthMetrics(healthMetrics.filter((_, i) => i !== index));

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col font-poppins">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Page Header */}
      <div className="flex flex-col items-center text-center mt-8 px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F875AA] to-[#F4C69D]">
          Health Tracker
        </h2>
        <p className="text-[#474747] font-light mt-2 text-lg">
          Monitor your wellness throughout pregnancy
        </p>
      </div>

      {/* Add Metric Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShowAddMetric(true)}
          className="bg-gradient-to-r from-[#F875AA] to-[#F4C69D] text-white px-6 py-3 rounded-full font-semibold hover:from-[#F9649C] hover:to-[#F3B287] hover:scale-105 transform transition-all shadow-lg"
        >
          + Add Health Metric
        </button>
      </div>

      {showAddMetric && <AddMetricModal onClose={() => setShowAddMetric(false)} onAdd={addMetric} />}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 max-w-7xl mx-auto w-full">
        {healthMetrics.map((metric, idx) => (
          <MetricCard key={idx} metric={metric} onRemove={() => removeMetric(idx)} />
        ))}
      </div>

      {/* Mood & Symptoms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8 max-w-7xl mx-auto w-full">
        <MoodTracker />
        <SymptomsList />
      </div>
    </div>
  );
}
