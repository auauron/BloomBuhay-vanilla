import React from "react";

interface Symptom {
  symptom: string;
  time: string;
  intensity: "Low" | "Medium" | "High";
}

const SymptomsList: React.FC = () => {
  const symptoms: Symptom[] = [
    { symptom: "Morning Sickness", time: "Today, 8:30 AM", intensity: "High" },
    { symptom: "Fatigue", time: "Yesterday, 3:00 PM", intensity: "Medium" },
    { symptom: "Back Pain", time: "Nov 12, 7:00 PM", intensity: "Medium" },
    { symptom: "Food Cravings", time: "Nov 11, 2:00 PM", intensity: "Low" },
  ];

  return (
    <div className="bg-gradient-to-r from-[#F875AA] to-[#F4C69D] text-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold mb-4">Recent Symptoms</h3>
      <div className="space-y-3">
        {symptoms.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center bg-white/20 p-3 rounded-lg hover:bg-white/30 transition-colors">
            <div>
              <span className="font-semibold">{item.symptom}</span>
              <p className="text-sm text-white/80">{item.time}</p>
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
  );
};

export default SymptomsList;
