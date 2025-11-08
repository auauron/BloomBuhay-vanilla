import React, { useState } from "react";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import MetricCard from "../components/health/MetricCard";
import AddMetricModal from "../components/health/AddMetricModal";
import MoodTracker from "../components/health/MoodTracker";
import SymptomsList from "../components/health/SymptomsList";
import { 
  Plus, 
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  Scale,
  BarChart3,
  Droplets,
  ScanHeart
} from "lucide-react";
import '../index.css';

export default function HealthTracker() {
  // State for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for add metric modal visibility
  const [showAddMetric, setShowAddMetric] = useState(false);
  
  // State for health metrics with sample data
  const [healthMetrics, setHealthMetrics] = useState([
    { 
      id: 1,
      title: "Weight", 
      value: "62", 
      unit: "kg", 
      change: "+1.2", 
      trend: "up", 
      icon: <Scale className="w-6 h-6" />, 
      color: "from-bloomPink to-[#F5ABA1]",
      category: "vitals"
    },
    { 
      id: 2,
      title: "Blood Pressure", 
      value: "110/70", 
      unit: "mmHg", 
      change: "Stable", 
      trend: "stable", 
      icon: <Heart className="w-6 h-6" />, 
      color: "from-bloomPink to-bloomYellow",
      category: "vitals"
    },
    { 
      id: 3,
      title: "BMI", 
      value: "23.4", 
      unit: "", 
      change: "Healthy", 
      trend: "stable", 
      icon: <BarChart3 className="w-6 h-6" />, 
      color: "from-[#F5ABA1] to-[#F3E198]",
      category: "health"
    },
    { 
      id: 4,
      title: "Water Intake", 
      value: "2.1", 
      unit: "L", 
      change: "-0.3", 
      trend: "down", 
      icon: <Droplets className="w-6 h-6" />, 
      color: "from-bloomPink to-[#F5ABA1]",
      category: "nutrition"
    },
  ]);

  // Toggle sidebar open/close
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  // Close sidebar
  const closeSidebar = () => setIsSidebarOpen(false);

  // Add new metric to the list
  const addMetric = (metric: any) => {
    const newMetric = {
      ...metric,
      id: Date.now() // Generate unique ID
    };
    setHealthMetrics([...healthMetrics, newMetric]);
  };

  // Remove metric by index
  const removeMetric = (id: number) => {
    setHealthMetrics(healthMetrics.filter(metric => metric.id !== id));
  };

  // Update existing metric
  const updateMetric = (updatedMetric: any) => {
    setHealthMetrics(healthMetrics.map(metric => 
      metric.id === updatedMetric.id ? updatedMetric : metric
    ));
  };

  // Get trend icon based on trend type
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4" />;
      case "down":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-screen font-poppins bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header Component */}
      <Header onMenuClick={toggleSidebar} />
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        
        {/* Page Header Section */}
        <div className="text-center py-8 px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-2xl shadow-lg text-center">
              <ScanHeart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-bloomPink">
              Health Tracker
            </h1>
          </div>
          <p className="text-bloomBlack font-rubik text-lg font-light max-w-2xl mx-auto">
            Better health, better life, better motherhood. <br></br>Track your vitals, mood, and wellness.          </p>
        </div>

        {/* Add Metric Button Section */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowAddMetric(true)}
            className="group bg-bloomPink/90 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gradient-to-r from-bloomPink to-bloomYellow hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-lg"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Add Health Metric</span>
          </button>
        </div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 px-8 mb-12 max-w-7xl mx-auto">
          {healthMetrics.map((metric) => (
            <MetricCard 
              key={metric.id} 
              metric={metric} 
              onRemove={() => removeMetric(metric.id)}
              onUpdate={updateMetric}
              trendIcon={getTrendIcon(metric.trend)}
            />
          ))}
        </div>

        {/* Mood & Symptoms Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 pb-12 max-w-7xl mx-auto">
          {/* Mood Tracker Component */}
          <MoodTracker />
          
          {/* Symptoms List Component */}
          <SymptomsList />
        </div>
      </div>

      {/* Add Metric Modal */}
      {showAddMetric && (
        <AddMetricModal 
          onClose={() => setShowAddMetric(false)} 
          onAdd={addMetric}
        />
      )}
    </div>
  );
}