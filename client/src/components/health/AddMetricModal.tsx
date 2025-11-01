import React, { useState } from "react";

interface Metric {
  title: string;
  value: string;
  unit: string;
  icon: string;
}

interface AddMetricModalProps {
  onClose: () => void;
  onAdd: (metric: any) => void;
}

const moodIcons = ["😊", "😄", "😍", "😴", "🤢"];

const AddMetricModal: React.FC<AddMetricModalProps> = ({ onClose, onAdd }) => {
  const [newMetric, setNewMetric] = useState<Metric>({
    title: "",
    value: "",
    unit: "",
    icon: "📝",
  });

  const handleAdd = () => {
    if (newMetric.title && newMetric.value) {
      onAdd({
        title: newMetric.title,
        value: `${newMetric.value} ${newMetric.unit}`,
        change: "New",
        trend: "stable",
        icon: newMetric.icon,
        color: "from-[#F875AA] to-[#F4C69D]",
      });
      setNewMetric({ title: "", value: "", unit: "", icon: "📝" });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Metric</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Metric Name"
            value={newMetric.title}
            onChange={(e) => setNewMetric({ ...newMetric, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F875AA] focus:border-transparent"
          />
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Value"
              value={newMetric.value}
              onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F875AA] focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Unit"
              value={newMetric.unit}
              onChange={(e) => setNewMetric({ ...newMetric, unit: e.target.value })}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F875AA] focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto py-2">
            {moodIcons.map((icon, index) => (
              <button
                key={index}
                onClick={() => setNewMetric({ ...newMetric, icon })}
                className={`text-2xl p-2 rounded-lg ${
                  newMetric.icon === icon ? "bg-[#F875AA] text-white" : "bg-gray-100"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 py-2 px-4 bg-[#F875AA] text-white rounded-lg hover:bg-[#F9649C] transition-colors font-medium"
          >
            Add Metric
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMetricModal;
