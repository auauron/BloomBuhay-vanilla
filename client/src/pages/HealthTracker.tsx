import React from "react";
import { useState } from "react";
import "../index.css";
import Header from '../components/Header';
import Sidebar from "../components/Sidebar";

export default function HealthTracker() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState([
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
      title: "BMI", 
      value: "23.4", 
      change: "Healthy", 
      trend: "stable",
      icon: "📊",
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
  ]);

  const [moodData, setMoodData] = useState([
    { day: "Mon", mood: "😊", notes: "Feeling good" },
    { day: "Tue", mood: "😴", notes: "Very tired" },
    { day: "Wed", mood: "🤢", notes: "Morning sickness" },
    { day: "Thu", mood: "😄", notes: "Happy day!" },
    { day: "Fri", mood: "😔", notes: "Back pain" },
    { day: "Sat", mood: "😊", notes: "Relaxing" },
    { day: "Sun", mood: "😍", notes: "Baby kicked!" }
  ]);

  const [newMetric, setNewMetric] = useState({
    title: "",
    value: "",
    unit: "",
    icon: "📝"
  });

  const [showAddMetric, setShowAddMetric] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const addNewMetric = () => {
    if (newMetric.title && newMetric.value) {
      const metric = {
        title: newMetric.title,
        value: `${newMetric.value} ${newMetric.unit}`,
        change: "New",
        trend: "stable",
        icon: newMetric.icon,
        color: "from-[#F875AA] to-[#F4C69D]"
      };
      setHealthMetrics([...healthMetrics, metric]);
      setNewMetric({ title: "", value: "", unit: "", icon: "📝" });
      setShowAddMetric(false);
    }
  };

  const removeMetric = (index: number) => {
    const updatedMetrics = healthMetrics.filter((_, i) => i !== index);
    setHealthMetrics(updatedMetrics);
  };

  const moodIcons = ["😊", "😄", "😍", "😴", "🤢", "😔", "😠", "😰", "😭", "😐"];

  const logMood = (mood: string) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const newMoodEntry = { day: today, mood: mood, notes: "How are you feeling?" };
    setMoodData([...moodData.slice(1), newMoodEntry]);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col font-poppins">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Page Header */}
      <div className="flex flex-col items-center text-center mt-8 px-4">
        <h2 className="text-4xl font-bold text-[#F875AA]">Health Tracker</h2>
        <p className="text-[#474747] font-rubik mt-2 font-light text-lg">
          Monitor your wellness throughout pregnancy
        </p>
      </div>

      {/* Add Metric Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShowAddMetric(true)}
          className="bg-gradient-to-r from-[#F875AA] to-[#F4C69D] text-white px-6 py-3 rounded-full font-semibold hover:from-[#F9649C] hover:to-[#F3B287] transition-colors shadow-lg"
        >
          + Add Health Metric
        </button>
      </div>

      {/* Add Metric Modal */}
      {showAddMetric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Metric</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Metric Name (e.g., Blood Sugar)"
                value={newMetric.title}
                onChange={(e) => setNewMetric({...newMetric, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F875AA] focus:border-transparent"
              />
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Value"
                  value={newMetric.value}
                  onChange={(e) => setNewMetric({...newMetric, value: e.target.value})}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F875AA] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Unit (kg, mg/dL, etc.)"
                  value={newMetric.unit}
                  onChange={(e) => setNewMetric({...newMetric, unit: e.target.value})}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F875AA] focus:border-transparent"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto py-2">
                {moodIcons.slice(0, 5).map((icon, index) => (
                  <button
                    key={index}
                    onClick={() => setNewMetric({...newMetric, icon})}
                    className={`text-2xl p-2 rounded-lg ${
                      newMetric.icon === icon ? 'bg-[#F875AA] text-white' : 'bg-gray-100'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddMetric(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={addNewMetric}
                className="flex-1 py-2 px-4 bg-[#F875AA] text-white rounded-lg hover:bg-[#F9649C] transition-colors font-medium"
              >
                Add Metric
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 max-w-7xl mx-auto w-full">
        {healthMetrics.map((metric, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-r ${metric.color} text-white p-6 rounded-[20px] shadow-lg relative min-h-[140px] group`}
          >
            <button 
              onClick={() => removeMetric(index)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 w-6 h-6 rounded-full flex items-center justify-center text-xs"
            >
              ×
            </button>
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
        
        {/* Mood Tracker */}
        <div className="bg-gradient-to-r from-[#F875AA] via-[#F5ABA1] to-[#F3E198] text-white p-6 rounded-[20px] shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Mood Tracker</h3>
          <p className="text-white/80 mb-4">How are you feeling today?</p>
          
          {/* Mood Selection */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {moodIcons.map((mood, index) => (
              <button
                key={index}
                onClick={() => logMood(mood)}
                className="text-2xl p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                {mood}
              </button>
            ))}
          </div>

          {/* Weekly Mood Chart */}
          <div className="bg-white/20 rounded-lg p-4">
            <h4 className="font-semibold mb-3">This Week's Mood</h4>
            <div className="flex justify-between items-end">
              {moodData.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-2xl mb-2">{day.mood}</span>
                  <span className="text-xs text-white/70">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Symptoms Tracker */}
        <div className="bg-gradient-to-r from-[#F875AA] to-[#F4C69D] text-white p-6 rounded-[20px] shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Recent Symptoms</h3>
          <div className="space-y-3">
            {[
              { symptom: "Morning Sickness", time: "Today, 8:30 AM", intensity: "High" },
              { symptom: "Fatigue", time: "Yesterday, 3:00 PM", intensity: "Medium" },
              { symptom: "Back Pain", time: "Nov 12, 7:00 PM", intensity: "Medium" },
              { symptom: "Food Cravings", time: "Nov 11, 2:00 PM", intensity: "Low" }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-white/20 p-3 rounded-lg">
                <div>
                  <span className="font-semibold">{item.symptom}</span>
                  <p className="text-sm text-white/70">{item.time}</p>
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
            + Log New Symptom
          </button>
        </div>
      </div>
    </div>
  );
}