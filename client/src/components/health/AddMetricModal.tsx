import React, { useState } from "react";
import { X, Calculator, Scale, Heart, Activity, Droplets, Moon, Sun, BarChart3, Thermometer, ScanHeart, Scan} from "lucide-react";

interface AddMetricModalProps {
  onClose: () => void;
  onAdd: (metric: any) => void;
}

const metricOptions = [
  { 
    value: "weight", 
    label: "Weight", 
    icon: <Scale className="w-5 h-5" />, 
    units: ["kg", "lbs"],
    color: "from-bloomPink to-[#F5ABA1]",
    category: "vitals"
  },
  { 
    value: "blood_pressure", 
    label: "Blood Pressure", 
    icon: <Heart className="w-5 h-5" />, 
    units: ["mmHg"],
    color: "from-bloomPink to-red-600",
    category: "vitals"
  },
  { 
    value: "bmi", 
    label: "BMI", 
    icon: <BarChart3 className="w-5 h-5" />, 
    units: [""],
    color: "from-[#F5ABA1] to-[#F3E198]",
    category: "health"
  },
  { 
    value: "water_intake", 
    label: "Water Intake", 
    icon: <Droplets className="w-5 h-5" />, 
    units: ["L", "ml", "cups", "oz"],
    color: "from-bloomPink to-blue-500",
    category: "nutrition"
  },
  { 
    value: "sleep_hours", 
    label: "Sleep Hours", 
    icon: <Moon className="w-5 h-5" />, 
    units: ["hours"],
    color: "from-purple-400 to-blue-400",
    category: "lifestyle"
  },
  { 
    value: "steps", 
    label: "Daily Steps", 
    icon: <Sun className="w-5 h-5" />, 
    units: ["steps"],
    color: "from-green-400 to-emerald-400",
    category: "activity"
  },
  { 
    value: "heart_rate", 
    label: "Heart Rate", 
    icon: <ScanHeart className="w-5 h-5" />, 
    units: ["bpm"],
    color: "from-red-500 to-pink-400",
    category: "vitals"
  },
  { 
    value: "temperature", 
    label: "Temperature", 
    icon: <Thermometer className="w-5 h-5" />, 
    units: ["°C", "°F"],
    color: "from-orange-400 to-yellow-400",
    category: "vitals"
  },
  { 
    value: "custom", 
    label: "Custom Metric", 
    icon: <Scan className="w-5 h-5" />, 
    units: ["custom"],
    color: "from-bloomPink to-bloomYellow",
    category: "custom"
  }
];

const commonUnits = ["", "units", "count", "percentage", "score", "rating", "times", "minutes", "hours", "days"];

const AddMetricModal: React.FC<AddMetricModalProps> = ({ onClose, onAdd }) => {
  const [selectedMetric, setSelectedMetric] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [showBMICalculator, setShowBMICalculator] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [customUnit, setCustomUnit] = useState("");
  const [useCustomUnit, setUseCustomUnit] = useState(false);

  const selectedMetricData = metricOptions.find(metric => metric.value === selectedMetric);

  const calculateBMI = () => {
    if (!weight || !height) return null;

    const weightNum = parseFloat(weight);
    let heightNum = parseFloat(height);

    // Convert height to meters if in cm
    if (heightUnit === "cm") {
      heightNum = heightNum / 100;
    }

    const bmi = weightNum / (heightNum * heightNum);
    return bmi.toFixed(1);
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
        // For pregnancy, weight gain is expected
        if (numValue < 0) return { status: "Weight Loss", trend: "down" };
        if (numValue < 50) return { status: "Underweight", trend: "down" };
        if (numValue >= 50 && numValue < 70) return { status: "Healthy", trend: "stable" };
        if (numValue >= 70 && numValue < 90) return { status: "Overweight", trend: "up" };
        if (numValue >= 90) return { status: "Obese", trend: "up" };
        return numValue > 0 ? { status: "Tracking", trend: "stable" } : { status: "New", trend: "stable" };
        
      case "Water Intake":
        // Convert to liters for comparison
        let waterInLiters = numValue;
        if (unit === "ml") waterInLiters = numValue / 1000;
        if (unit === "cups") waterInLiters = numValue * 0.24; // Approximate conversion
        if (unit === "oz") waterInLiters = numValue * 0.0296; // Approximate conversion
        
        if (waterInLiters >= 4) return { status: "Warning: may cause water poisoning", trend: "warning"}
        if (waterInLiters >= 2.5) return { status: "Excellent", trend: "up" };
        if (waterInLiters >= 2.0) return { status: "Good", trend: "stable" };
        if (waterInLiters >= 1.5) return { status: "Fair", trend: "down" };
        return { status: "Low", trend: "down" };
        
      case "Sleep Hours":
        if (numValue > 8) return { status: "Warning: oversleeping", trend: "warning" };
        if (numValue >= 8) return { status: "Excellent", trend: "up" };
        if (numValue >= 7) return { status: "Good", trend: "stable" };
        if (numValue >= 6) return { status: "Fair", trend: "down" };
        return { status: "Poor", trend: "down" };
        
      case "Heart Rate":
        if (numValue >= 60 && numValue <= 100) return { status: "Normal", trend: "stable" };
        if (numValue < 60) return { status: "Low", trend: "down" };
        return { status: "High", trend: "up" };
        
      case "Temperature":
        let tempInCelsius = numValue;
        if (unit === "°F") tempInCelsius = (numValue - 32) * 5/9; // Convert Fahrenheit to Celsius
        
        if (tempInCelsius >= 36.1 && tempInCelsius <= 37.2) return { status: "Normal", trend: "stable" };
        if (tempInCelsius < 36.1) return { status: "Low", trend: "down" };
        return { status: "Fever", trend: "up" };
        
      case "Daily Steps":
        if (numValue >= 10000) return { status: "Excellent", trend: "up" };
        if (numValue >= 7500) return { status: "Good", trend: "stable" };
        if (numValue >= 5000) return { status: "Fair", trend: "down" };
        return { status: "Low", trend: "down" };
        
      default:
        return { status: "Tracking", trend: "stable" };
    }
  };

  const handleAdd = () => {
    if (selectedMetric && value) {
      let finalValue = value;
      let finalUnit = unit;
      let trendData = { status: "New", trend: "stable" as "up" | "down" | "stable" | string | 'warning'};

      // Handle custom unit input
      if (selectedMetric === "custom" && useCustomUnit && customUnit) {
        finalUnit = customUnit;
      }

      // Handle BMI calculation
      if (selectedMetric === "bmi" && showBMICalculator) {
        const bmi = calculateBMI();
        if (bmi) {
          finalValue = bmi;
          trendData = calculateTrend("BMI", bmi, "");
        }
      } else {
        // Calculate trend for other metrics
        trendData = calculateTrend(
          selectedMetricData?.label || "Custom", 
          finalValue, 
          finalUnit
        );
      }

      const metricData = {
        title: selectedMetricData?.label || "Custom",
        value: finalValue,
        unit: finalUnit,
        change: trendData.status,
        trend: trendData.trend,
        icon: getMetricIcon(selectedMetric),
        color: selectedMetricData?.color || "from-bloomPink to-bloomYellow",
        category: selectedMetricData?.category || "custom"
      };

      onAdd(metricData);
      onClose();
    }
  };

  const getMetricIcon = (metricType: string) => {
    switch (metricType) {
      case "weight": return <Scale className="w-6 h-6" />;
      case "blood_pressure": return <Heart className="w-6 h-6" />;
      case "bmi": return <BarChart3 className="w-6 h-6" />;
      case "water_intake": return <Droplets className="w-6 h-6" />;
      case "sleep_hours": return <Moon className="w-6 h-6" />;
      case "steps": return <Sun className="w-6 h-6" />;
      case "heart_rate": return <ScanHeart className="w-6 h-6" />;
      case "temperature": return <Thermometer className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
  };

  const handleMetricSelect = (metricValue: string) => {
    setSelectedMetric(metricValue);
    setValue("");
    setShowBMICalculator(metricValue === "bmi");
    
    const metric = metricOptions.find(m => m.value === metricValue);
    if (metric) {
      // For metrics with only one unit option, set it automatically
      if (metric.units.length === 1) {
        setUnit(metric.units[0]);
      } else if (metric.units.length > 1) {
        setUnit(metric.units[0]);
      } else {
        setUnit("");
      }
    }
    
    // Reset custom unit state
    setUseCustomUnit(false);
    setCustomUnit("");
  };

  // Check if we should show unit input
  const shouldShowUnitInput = () => {
    if (!selectedMetricData) return false;
    
    // Never show unit for BMI (it's unitless)
    if (selectedMetric === "bmi") return false;
    
    // For custom metric, show custom unit options
    if (selectedMetric === "custom") return false;
    
    // Show dropdown only if there are multiple unit options
    return selectedMetricData.units.length > 1;
  };

  // Check if we should show custom unit input
  const shouldShowCustomUnitInput = () => {
    return selectedMetric === "custom" && useCustomUnit;
  };

  // Calculate and display trend preview
  const trendPreview = selectedMetric && value ? 
    calculateTrend(selectedMetricData?.label || "Custom", value, unit) : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-bloomPink">Add Health Metric</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Metric Selection - 3 Columns */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Metric Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {metricOptions.map((metric) => (
                <button
                  key={metric.value}
                  onClick={() => handleMetricSelect(metric.value)}
                  className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedMetric === metric.value
                      ? "border-bloomPink bg-gradient-to-r from-bloomPink/10 to-bloomYellow/10 scale-105"
                      : "border-gray-200 hover:border-bloomPink/50 hover:bg-gray-50 hover:scale-102"
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${metric.color} text-white mb-2`}>
                    {metric.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">
                    {metric.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {selectedMetric && (
            <>
              {/* BMI Calculator */}
              {selectedMetric === "bmi" && showBMICalculator && (
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Calculate Your BMI</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 62"
                        min="0"
                        step="0.1"
                        onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                              e.preventDefault();
                            }
                          }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 165"
                          min="0"
                          step="0.1"
                          onKeyDown={(e) => {
                                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                      e.preventDefault();
                                    }
                                  }}
                        />
                        <select
                          value={heightUnit}
                          onChange={(e) => setHeightUnit(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="cm">cm</option>
                          <option value="m">m</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {weight && height && calculateBMI() && (
                    <div className="bg-white rounded-xl p-4 border border-blue-300">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Your BMI is</p>
                        <p className="text-2xl font-bold text-blue-600 mb-1">{calculateBMI()}</p>
                        <p className={`text-sm font-medium ${
                          calculateTrend("BMI", calculateBMI()!, "").status === "Healthy" ? "text-green-600" :
                          calculateTrend("BMI", calculateBMI()!, "").status === "Underweight" ? "text-yellow-600" :
                          "text-orange-600"
                        }`}>
                          {calculateTrend("BMI", calculateBMI()!, "").status}
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowBMICalculator(false)}
                    className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium text-center"
                  >
                    I know my BMI, enter manually
                  </button>
                </div>
              )}

              {/* Value Input Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {selectedMetric === "bmi" && !showBMICalculator ? "BMI Value" : "Value"}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type={selectedMetric === "bmi" ? "number" : "number"}
                      onChange={(e) => {
                          const val = e.target.value;
                              // Prevent negative values
                              if (parseFloat(val) >= 0 || val === "") {
                                setValue(val);
                              }
                            }}
                      onKeyDown={(e) => {
                              if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                e.preventDefault();
                              }
                            }}
                      value={selectedMetric === "bmi" && showBMICalculator ? calculateBMI() || "" : value}
                      disabled={selectedMetric === "bmi" && showBMICalculator}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-bloomPink focus:border-transparent disabled:bg-gray-100"
                      placeholder={
                        selectedMetric === "bmi" ? "e.g., 23.4" :
                        selectedMetric === "blood_pressure" ? "e.g., 120/80" :
                        selectedMetric === "weight" ? "e.g., 62" :
                        "Enter value"
                      }
                      min="0"
                      step={selectedMetric === "bmi" ? "0.1" : "1"}
                    />
                    
                    {/* Unit Selection - Only show when needed */}
                    {shouldShowUnitInput() && (
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-bloomPink focus:border-transparent min-w-32"
                      >
                        {selectedMetricData?.units.map((unitOption) => (
                          <option key={unitOption} value={unitOption}>
                            {unitOption || "No Unit"}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Custom Metric Unit Options */}
                {selectedMetric === "custom" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={!useCustomUnit}
                          onChange={() => setUseCustomUnit(false)}
                          className="text-bloomPink focus:ring-bloomPink"
                        />
                        <span className="text-sm text-gray-700">Use common units</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={useCustomUnit}
                          onChange={() => setUseCustomUnit(true)}
                          className="text-bloomPink focus:ring-bloomPink"
                        />
                        <span className="text-sm text-gray-700">Enter custom unit</span>
                      </label>
                    </div>

                    {!useCustomUnit ? (
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
                      >
                        {commonUnits.map((unitOption) => (
                          <option key={unitOption} value={unitOption}>
                            {unitOption || "Select unit"}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={customUnit}
                        onChange={(e) => setCustomUnit(e.target.value)}
                        placeholder="Enter custom unit (e.g., points, mg/dL, etc.)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
                      />
                    )}
                  </div>
                )}

                {/* Trend Preview */}
                {trendPreview && (
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <span className={`text-sm font-semibold ${
                        trendPreview.status === "Healthy" || trendPreview.status === "Normal" || trendPreview.status === "Excellent" || trendPreview.status === "Good" ? "text-green-600" :
                        trendPreview.status === "Underweight" || trendPreview.status === "Overweight" || trendPreview.status === "Elevated" || trendPreview.status === "Fair" ? "text-orange-600" :
                        "text-red-600"
                      }`}>
                        {trendPreview.status}
                      </span>
                    </div>
                  </div>
                )}

                {/* Additional Instructions */}
                {selectedMetric === "blood_pressure" && (
                  <p className="text-sm text-gray-500">
                    Enter your blood pressure as systolic/diastolic (e.g., 120/80)
                  </p>
                )}
                {selectedMetric === "bmi" && !showBMICalculator && (
                  <p className="text-sm text-gray-500">
                    Enter your BMI value. Normal range is 18.5 - 24.9
                  </p>
                )}
                {selectedMetric === "water_intake" && (
                  <p className="text-sm text-gray-500">
                    Recommended: 2-3 liters (7-8 cups) per day during pregnancy
                  </p>
                )}
                {selectedMetric === "sleep_hours" && (
                  <p className="text-sm text-gray-500">
                    Recommended: 7-9 hours per night during pregnancy
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedMetric || !value}
            className="flex-1 bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-6 py-3 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            Add Metric
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMetricModal;