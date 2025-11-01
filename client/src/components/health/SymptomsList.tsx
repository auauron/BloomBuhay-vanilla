import React, { useState } from "react";

interface Symptom {
  symptom: string;
  time: string;
  intensity: "Low" | "Medium" | "High";
  resolved: boolean;
}

const SymptomsList: React.FC = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { symptom: "Morning Sickness", time: "Today, 8:30 AM", intensity: "High", resolved: false },
    { symptom: "Fatigue", time: "Yesterday, 3:00 PM", intensity: "Medium", resolved: false },
    { symptom: "Back Pain", time: "Nov 12, 7:00 PM", intensity: "Medium", resolved: true },
    { symptom: "Food Cravings", time: "Nov 11, 2:00 PM", intensity: "Low", resolved: false },
  ]);

  const [formState, setFormState] = useState({ symptom: "", intensity: "Low" as "Low" | "Medium" | "High" });
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Add or update symptom
  const saveSymptom = () => {
    const time = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
    if (editingIndex !== null) {
      const updated = [...symptoms];
      updated[editingIndex] = { ...formState, time, resolved: updated[editingIndex].resolved };
      setSymptoms(updated);
      setEditingIndex(null);
    } else {
      setSymptoms([{ ...formState, time, resolved: false }, ...symptoms]);
    }
    setFormState({ symptom: "", intensity: "Low" });
    setShowForm(false);
  };

  // Delete symptom permanently
  const deleteSymptom = (index: number) => {
    const updated = symptoms.filter((_, i) => i !== index);
    setSymptoms(updated);
  };

  // Edit symptom
  const editSymptom = (index: number) => {
    setFormState({ symptom: symptoms[index].symptom, intensity: symptoms[index].intensity });
    setEditingIndex(index);
    setShowForm(true);
  };

  // Toggle resolved status
  const toggleResolved = (index: number) => {
    const updated = [...symptoms];
    updated[index].resolved = !updated[index].resolved;
    setSymptoms(updated);
  };

  return (
    <div className="bg-gradient-to-r from-[#F875AA] to-[#F4C69D] text-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold mb-4">Recent Symptoms</h3>

      {/* Symptoms List */}
      <div className="space-y-3 mb-4">
        {symptoms
          .sort((a, b) => Number(a.resolved) - Number(b.resolved)) // unresolved first
          .map((item, idx) => (
            <div
              key={idx}
              className={`flex justify-between items-center p-3 rounded-lg transition-colors
                ${item.resolved ? "bg-white/10 line-through text-white/60" : "bg-white/20 hover:bg-white/30"}`}
            >
              <div>
                <span className="font-semibold">{item.symptom}</span>
                <p className="text-sm">{item.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.intensity === "High"
                      ? "bg-red-400"
                      : item.intensity === "Medium"
                      ? "bg-yellow-400"
                      : "bg-green-400"
                  }`}
                >
                  {item.intensity}
                </span>
                {!item.resolved && (
                  <button
                    onClick={() => editSymptom(idx)}
                    className="px-2 py-1 rounded bg-white/20 hover:bg-white/40 text-white text-xs"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => toggleResolved(idx)}
                  className={`px-2 py-1 rounded text-xs ${
                    item.resolved ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {item.resolved ? "Unresolve" : "Resolve"}
                </button>
                <button
                  onClick={() => deleteSymptom(idx)}
                  className="px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Toggle Form Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-white/30 hover:bg-white/40 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          + Log New Symptom
        </button>
      )}

      {/* Add/Edit Symptom Form */}
      {showForm && (
        <div className="space-y-3 mt-3">
          <input
            type="text"
            placeholder="Symptom (e.g., Headache)"
            value={formState.symptom}
            onChange={(e) => setFormState({ ...formState, symptom: e.target.value })}
            className="w-full p-3 rounded-lg border border-white/40 bg-white/10 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-white"
          />

          <select
            value={formState.intensity}
            onChange={(e) =>
              setFormState({ ...formState, intensity: e.target.value as "Low" | "Medium" | "High" })
            }
            className="w-full p-3 rounded-lg border border-white/40 bg-white/10 text-gray focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="Low" className="text-black">Low</option>
            <option value="Medium" className="text-black">Medium</option>
            <option value="High" className="text-black">High</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={saveSymptom}
              className="flex-1 bg-white/30 hover:bg-white/40 text-white py-2 rounded-lg transition-colors font-semibold"
            >
              {editingIndex !== null ? "Update Symptom" : "Add Symptom"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingIndex(null);
                setFormState({ symptom: "", intensity: "Low" });
              }}
              className="flex-1 border border-white/40 text-white py-2 rounded-lg hover:bg-white/10 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomsList;
