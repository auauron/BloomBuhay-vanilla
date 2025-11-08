import React, { useState, useEffect } from "react";
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
import { healthtrackerService, HealthMetric } from "../services/healthtrackerService"; // adjust path if needed

export default function HealthTracker() {
  // State for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for add metric modal visibility
  const [showAddMetric, setShowAddMetric] = useState(false);
  
  // Loading state
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Sample fallback metrics used only if API fails (kept similar to your original)
  const fallbackSampleMetrics: HealthMetric[] = [
    { 
      id: "1",
      title: "Weight", 
      value: "62", 
      unit: "kg", 
      change: "+1.2", 
      trend: "up", 
      color: "from-bloomPink to-[#F5ABA1]",
      category: "vitals",
      createdAt: new Date().toISOString()
    },
    { 
      id: "2",
      title: "Blood Pressure", 
      value: "110/70", 
      unit: "mmHg", 
      change: "Stable", 
      trend: "stable", 
      color: "from-bloomPink to-bloomYellow",
      category: "vitals",
      createdAt: new Date().toISOString()
    },
    { 
      id: "3",
      title: "BMI", 
      value: "23.4", 
      unit: "", 
      change: "Healthy", 
      trend: "stable", 
      color: "from-[#F5ABA1] to-[#F3E198]",
      category: "health",
      createdAt: new Date().toISOString()
    },
    { 
      id: "4",
      title: "Water Intake", 
      value: "2.1", 
      unit: "L", 
      change: "-0.3", 
      trend: "down", 
      color: "from-bloomPink to-[#F5ABA1]",
      category: "nutrition",
      createdAt: new Date().toISOString()
    },
  ];

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);

  // Toggle sidebar open/close
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  // Close sidebar
  const closeSidebar = () => setIsSidebarOpen(false);

  const getIconForMetric = (metric: HealthMetric) => {
    const title = (metric.title || "").toLowerCase();
    const cat = (metric.category || "").toLowerCase();

    if (title.includes("weight") || cat === "vitals") return <Scale className="w-6 h-6" />;
    if (title.includes("blood") || title.includes("pressure")) return <Heart className="w-6 h-6" />;
    if (title.includes("bmi")) return <BarChart3 className="w-6 h-6" />;
    if (title.includes("water") || title.includes("intake")) return <Droplets className="w-6 h-6" />;
    return <ScanHeart className="w-6 h-6" />; // default
  };

  // Get trend icon based on trend type
  const getTrendIcon = (trend: string | undefined) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4" />;
      case "down":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingMetrics(true);
      try {
        const res = await healthtrackerService.getAll();
        if (!mounted) return;
        if (res.success && res.data && res.data.metrics) {
          setHealthMetrics(res.data.metrics.map((m: any) => ({ ...m, id: String(m.id) })));
        } else {
          setHealthMetrics(fallbackSampleMetrics);
          if (!res.success) console.error("Failed to load health data:", res.error);
        }
      } catch (err) {
        console.error("Health fetch error:", err);
        setHealthMetrics(fallbackSampleMetrics);
      } finally {
        if (mounted) setLoadingMetrics(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const addMetric = async (metric: any) => {
    const payload = {
      title: metric.title,
      value: String(metric.value ?? ""),
      unit: metric.unit ?? "",
      change: metric.change ?? "",
      trend: metric.trend ?? "stable",
      color: metric.color ?? null,
      category: metric.category ?? null,
    };

    try {
      const res = await healthtrackerService.createMetric(payload);
      if (res.success && res.data) {
        setHealthMetrics(prev => [{ ...res.data, id: String(res.data.id) }, ...prev]);
      } else {
        const newMetric: HealthMetric = { id: Date.now().toString(), ...payload, createdAt: new Date().toISOString() };
        setHealthMetrics(prev => [newMetric, ...prev]);
        console.error("create metric failed", res.error);
      }
    } catch (err) {
      console.error("create metric exception", err);
      const newMetric: HealthMetric = { id: Date.now().toString(), ...payload, createdAt: new Date().toISOString() };
      setHealthMetrics(prev => [newMetric, ...prev]);
    }
  };

  const removeMetric = async (id: string | number) => {
    const idStr = String(id);
    try {
      const res = await healthtrackerService.deleteMetric(idStr);
      if (res.success) {
        setHealthMetrics(prev => prev.filter(metric => String(metric.id) !== idStr));
      } else {
        console.error("delete metric failed", res.error);
      }
    } catch (err) {
      console.error("delete metric exception", err);
    }
  };

  const updateMetric = async (updatedMetric: any) => {
    const idStr = String(updatedMetric.id);
    const payload = {
      title: updatedMetric.title,
      value: String(updatedMetric.value ?? ""),
      unit: updatedMetric.unit ?? "",
      change: updatedMetric.change ?? "",
      trend: updatedMetric.trend ?? "stable",
      color: updatedMetric.color ?? null,
      category: updatedMetric.category ?? null,
    };

    try {
      const res = await healthtrackerService.updateMetric(idStr, payload);
      if (res.success && res.data) {
        setHealthMetrics(prev => prev.map(m => (String(m.id) === idStr ? { ...res.data, id: idStr } : m)));
      } else {
        setHealthMetrics(prev => prev.map(m => (String(m.id) === idStr ? { ...m, ...payload } : m)));
        console.error("update metric failed", res.error);
      }
    } catch (err) {
      console.error("update metric exception", err);
      setHealthMetrics(prev => prev.map(m => (String(m.id) === idStr ? { ...m, ...payload } : m)));
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
            <div className="p-3 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-2xl shadow-lg">
              <ScanHeart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-bloomPink">
              Health Tracker
            </h1>
          </div>
          <p className="text-bloomBlack font-rubik text-lg font-light max-w-2xl mx-auto">
            Better health, better life, better motherhood. <br />Track your vitals, mood, and wellness.
          </p>
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
          {loadingMetrics ? (
            <div className="col-span-full text-center text-gray-500">Loading metrics...</div>
          ) : (
            healthMetrics.map((metric) => (
              <MetricCard 
                key={metric.id} 
                metric={{
                  ...metric,
                  icon: (metric as any).icon ?? getIconForMetric(metric)
                }} 
                onRemove={() => removeMetric(metric.id)}
                onUpdate={updateMetric}
                trendIcon={getTrendIcon(metric.trend)}
              />
            ))
          )}
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