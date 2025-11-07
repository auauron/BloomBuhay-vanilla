import React, { useState } from "react";
import { Edit3, Trash2, Save, X } from "lucide-react";
import { motion } from "framer-motion";

interface Metric {
  id: number;
  title: string;
  value: string;
  unit: string;
  change: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
  category: string;
}

interface MetricCardProps {
  metric: Metric;
  onRemove: () => void;
  onUpdate: (metric: Metric) => void;
  trendIcon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, onRemove, onUpdate, trendIcon }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(metric.value);

  const handleSave = () => {
    // Calculate new trend based on value and metric type
    const newTrend = calculateTrend(metric.title, editedValue, metric.unit);
    
    onUpdate({
      ...metric,
      value: editedValue,
      change: newTrend.status,
      trend: newTrend.trend
    });
    setIsEditing(false);
  };

  const calculateTrend = (title: string, value: string, unit: string) => {
    const numValue = parseFloat(value);
    
    switch (title) {
      case "BMI":
        if (numValue < 18.5) return { status: "Underweight", trend: "down" };
        if (numValue >= 18.5 && numValue < 25) return { status: "Healthy", trend: "stable" };
        if (numValue >= 25 && numValue < 30) return { status: "Overweight", trend: "up" };
        return { status: "Obese", trend: "up" };
        
      case "Blood Pressure":
        const [systolic, diastolic] = value.split('/').map(Number);
        if (systolic < 90 || diastolic < 60) return { status: "Low", trend: "down" };
        if (systolic < 120 && diastolic < 80) return { status: "Normal", trend: "stable" };
        if (systolic >= 120 && systolic < 130 && diastolic < 80) return { status: "Elevated", trend: "up" };
        if (systolic >= 130 || diastolic >= 80) return { status: "High", trend: "up" };
        return { status: "Normal", trend: "stable" };
        
      case "Weight":
        // For pregnancy, weight gain is expected - simplified logic
        return numValue > 0 ? { status: "Tracking", trend: "stable" } : { status: "New", trend: "stable" };
        
      case "Water Intake":
        if (numValue >= 2.5) return { status: "Excellent", trend: "up" };
        if (numValue >= 2.0) return { status: "Good", trend: "stable" };
        if (numValue >= 1.5) return { status: "Fair", trend: "down" };
        return { status: "Low", trend: "down" };
        
      case "Sleep Hours":
        if (numValue >= 8) return { status: "Excellent", trend: "up" };
        if (numValue >= 7) return { status: "Good", trend: "stable" };
        if (numValue >= 6) return { status: "Fair", trend: "down" };
        return { status: "Poor", trend: "down" };
        
      case "Heart Rate":
        if (numValue >= 60 && numValue <= 100) return { status: "Normal", trend: "stable" };
        if (numValue < 60) return { status: "Low", trend: "down" };
        return { status: "High", trend: "up" };
        
      case "Temperature":
        if (numValue >= 36.1 && numValue <= 37.2) return { status: "Normal", trend: "stable" };
        if (numValue < 36.1) return { status: "Low", trend: "down" };
        return { status: "Fever", trend: "up" };
        
      default:
        return { status: "Tracking", trend: "stable" };
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "normal":
      case "excellent":
      case "good":
        return "text-green-600";
      case "underweight":
      case "overweight":
      case "obese":
      case "elevated":
      case "high":
      case "fever":
      case "fair":
        return "text-orange-600";
      case "low":
      case "poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
    <div className="group relative bg-gradient-to-r from-pink-50 to-pink-100 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-pink-100">
      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-r ${metric.color} shadow-md`}>
              <span className="text-xl">{metric.icon}</span>
            </div>
            <h3 className="font-semibold text-gray-800 text-lg">{metric.title}</h3>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-pink-50 rounded-xl transition-colors duration-200 text-gray-600 hover:text-bloomPink"
              title="Edit Metric"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onRemove}
              title="Delete Metric"
              className="p-2 hover:bg-red-50 rounded-xl transition-colors duration-200 text-gray-600 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Value Display/Edit */}
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                className="flex-1 px-3 w-4 py-2 border border-pink-300 rounded-xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
                placeholder={`Enter ${metric.title} value`}
              />
              <span className="text-gray-600 font-medium">{metric.unit}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-bloomPink to-bloomYellow text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm"
              >
                <Save className="w-3 h-3" />
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedValue(metric.value);
                }}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm"
              >
                <X className="w-3 h-3" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {metric.value} {metric.unit && <span className="text-lg font-normal text-gray-600">{metric.unit}</span>}
            </div>

            {/* Trend and Status */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                {trendIcon}
                <span className={`text-sm font-medium ${getStatusColor(metric.change)}`}>
                  {metric.change}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </motion.div>
  );
};

export default MetricCard;