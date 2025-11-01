import React, { useState } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle, Calendar, Clock } from "lucide-react";
import "../../index.css"

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

  const [formState, setFormState] = useState({ 
    symptom: "", 
    intensity: "Low" as "Low" | "Medium" | "High",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  });
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Format date for display
  const formatDisplayDate = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return `Today, ${timeString}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${timeString}`;
    } else {
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeString}`;
    }
  };

  // Reset form state
  const resetFormState = () => {
    setFormState({ 
      symptom: "", 
      intensity: "Low",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    });
  };

  // Add new symptom
  const addSymptom = () => {
    const time = formatDisplayDate(formState.date, formState.time);
    setSymptoms([{ ...formState, time, resolved: false }, ...symptoms]);
    resetFormState();
    setShowAddModal(false);
  };

  // Update existing symptom
  const updateSymptom = () => {
    if (editingIndex === null) return;
    
    const time = formatDisplayDate(formState.date, formState.time);
    const updated = [...symptoms];
    updated[editingIndex] = { ...formState, time, resolved: updated[editingIndex].resolved };
    setSymptoms(updated);
    setEditingIndex(null);
    resetFormState();
    setShowEditModal(false);
  };

  // Delete symptom permanently
  const deleteSymptom = (index: number) => {
    const updated = symptoms.filter((_, i) => i !== index);
    setSymptoms(updated);
    setShowEditModal(false);
    setEditingIndex(null);
  };

  // Open add modal
  const openAddModal = () => {
    resetFormState();
    setShowAddModal(true);
  };

  // Open edit modal
  const openEditModal = (index: number) => {
    const symptom = symptoms[index];
    // Parse the existing time string back to date and time inputs
    const timeParts = symptom.time.split(', ');
    let date = new Date().toISOString().split('T')[0];
    let time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    if (timeParts.length === 2) {
      // This is a simplified parsing - you might want to enhance this for production
      time = timeParts[1];
    }
    
    setFormState({ 
      symptom: symptom.symptom, 
      intensity: symptom.intensity,
      date,
      time
    });
    setEditingIndex(index);
    setShowEditModal(true);
  };

  // Toggle resolved status
  const toggleResolved = (index: number) => {
    const updated = [...symptoms];
    updated[index].resolved = !updated[index].resolved;
    setSymptoms(updated);
  };

  // Close all modals
  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingIndex(null);
    resetFormState();
  };

  // Modal backdrop component
  const ModalBackdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {children}
    </div>
  );

  // Modal content component
  const ModalContent: React.FC<{ 
    title: string; 
    onClose: () => void; 
    children: React.ReactNode;
    actionButtons?: React.ReactNode;
    className?: string
  }> = ({ title, onClose, children, actionButtons }) => (
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-bold text-bloomPink mb-4">{title}</h3>
      {children}
      {actionButtons}
      <button
        onClick={onClose}
        className="w-full mt-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors font-semibold"
      >
        Cancel
      </button>
    </div>
  );

  // Form fields component
  const SymptomFormFields: React.FC = () => (

    <div className="space-y-auto">
      <input
        type="text"
        placeholder="Symptom (e.g., Headache, Nausea, etc.)"
        value={formState.symptom}
        onChange={(e) => setFormState({ ...formState, symptom: e.target.value })}
        className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-bloomPink/50 focus:border-bloomPink placeholder-gray-500"
      />

    <p className="text-bloomBlack font-rubik mb-2 mt-4">How intense is it?</p>
      <select
        value={formState.intensity}
        onChange={(e) =>
          setFormState({ ...formState, intensity: e.target.value as "Low" | "Medium" | "High" })
        }
        className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-bloomPink/50 focus:border-bloomPink"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

    <p className="text-bloomBlack font-rubik mb-2 mt-4">When did it start?</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="date"
            value={formState.date}
            onChange={(e) => setFormState({ ...formState, date: e.target.value })}
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-bloomPink/50 focus:border-bloomPink"
          />
        </div>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="time"
            value={formState.time}
            onChange={(e) => setFormState({ ...formState, time: e.target.value })}
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-bloomPink/50 focus:border-bloomPink"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-bloomPink to-bloomYellow text-white p-6 rounded-2xl shadow-lg ">
      <h3 className="text-2xl font-bold mb-2">Recent Symptoms</h3>
        <p className="text-bloomBlack font-rubik font-normal mb-4">How have you been feeling? Tracking symptoms help you monitor health patterns better. 🌸💗</p>

      {/* Symptoms List */}
      <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
        {symptoms
          .sort((a, b) => Number(a.resolved) - Number(b.resolved)) // unresolved first
          .map((item, idx) => (
            <div
              key={idx}
              className={`flex justify-between items-center p-4 rounded-xl transition-all duration-200
                ${item.resolved 
                  ? "bg-gray-900/10 border border-white/20" 
                  : "bg-white border border-white/30 hover:bg-white/25 hover:border-white/40"
                } shadow-sm`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`font-semibold text-lg ${item.resolved ? "text-white/60 line-through" : "text-gray-600"}`}>
                    {item.symptom}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.intensity === "High"
                        ? "bg-red-400/90 text-white"
                        : item.intensity === "Medium"
                        ? "bg-yellow-400/90 text-white"
                        : "bg-green-400/90 text-white"
                    }`}
                  >
                    {item.intensity}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock size={14} />
                  <span>{item.time}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(idx)}
                  className="p-2 rounded-lg bg-bloomYellow hover:bg-white/30 text-bloomBlack transition-colors"
                  title="Edit symptom"
                >
                  <Edit size={16} />
                </button>
                
                <button
                  onClick={() => toggleResolved(idx)}
                  className={`p-2 rounded-lg transition-colors ${
                    item.resolved 
                      ? "bg-green-500/90 hover:bg-green-600 text-white" 
                      : "bg-blue-500/90 hover:bg-blue-600 text-white"
                  }`}
                  title={item.resolved ? "Mark as unresolved" : "Mark as resolved"}
                >
                  {item.resolved ? <CheckCircle size={16} /> : <XCircle size={16} />}
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Add Symptom Button */}
      <button
        onClick={openAddModal}
        className="w-full bg-white/30 hover:bg-white/40 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2 shadow-sm hover:shadow-md"
      >
        <Plus size={20} />
        Log New Symptom
      </button>

      {/* Add Symptom Modal */}
      {showAddModal && (
        <ModalBackdrop>
          <ModalContent 
            title="Add New Symptom" 
            onClose={closeModals}
            actionButtons={
              <button
                onClick={addSymptom}
                className="w-full bg-gradient-to-r from-bloompink to-bloomYellow hover:from-bloomPink hover:to-bloomYellow hover:scale-105 rounded-xl transition-all shadow-lg duration-200 text-white font-semibold py-3 flex items-center justify-center gap-2 mt-6"
                disabled={!formState.symptom.trim()}
              >
                <Plus size={16} />
                Add Symptom
              </button>
            }
          >
            <SymptomFormFields />
          </ModalContent>
        </ModalBackdrop>
      )}

      {/* Edit Symptom Modal */}
      {showEditModal && editingIndex !== null && (
        <ModalBackdrop>
          <ModalContent 
            title="Edit Symptom" 
            onClose={closeModals}
            actionButtons={
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => deleteSymptom(editingIndex)}
                  className="flex-1 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                <button
                  onClick={updateSymptom}
                  className="flex-1 py-3 rounded-lg bg-bloomPink hover:bg-bloomPink/90 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                  disabled={!formState.symptom.trim()}
                >
                  <Edit size={16} />
                  Update
                </button>
              </div>
            }
          >
            <SymptomFormFields />
          </ModalContent>
        </ModalBackdrop>
      )}
        </div>
  );
};

export default SymptomsList;