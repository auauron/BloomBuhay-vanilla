import React, { useState } from "react";
import {
  Plus,
  HeartHandshake,
  Info,
  Eye,
  Edit3,
  Trash2,
  ThumbsDown,
  ThumbsUp,
  Calendar,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../../index.css";

interface Symptom {
  symptom: string;
  time: string;
  intensity: "Low" | "Medium" | "High";
  resolved: boolean;
}

interface FormState {
  symptom: string;
  intensity: "Low" | "Medium" | "High";
  date: string;
  time: string;
}

const SymptomsList: React.FC = () => {
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { symptom: "Morning Sickness", time: "Today, 8:30 AM", intensity: "High", resolved: false },
    { symptom: "Fatigue", time: "Yesterday, 3:00 PM", intensity: "Medium", resolved: false },
    { symptom: "Back Pain", time: "Nov 12, 7:00 PM", intensity: "Medium", resolved: true },
    { symptom: "Food Cravings", time: "Nov 11, 2:00 PM", intensity: "Low", resolved: false },
  ]);

  const [formState, setFormState] = useState<FormState>({
    symptom: "",
    intensity: "Low",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const formatDisplayDate = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === now.toDateString()) return `Today, ${timeString}`;
    if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${timeString}`;
    return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${timeString}`;
  };

  const resetFormState = () => {
    setFormState({
      symptom: "",
      intensity: "Low",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
    });
  };

  // ------------------- CRUD -------------------
  const addSymptom = () => {
    const time = formatDisplayDate(formState.date, formState.time);
    setSymptoms([{ ...formState, time, resolved: false }, ...symptoms]);
    resetFormState();
    setShowAddModal(false);
  };

  const updateSymptom = () => {
    if (editingIndex === null) return;
    const updated = [...symptoms];
    updated[editingIndex] = {
      ...formState,
      time: formatDisplayDate(formState.date, formState.time),
      resolved: updated[editingIndex].resolved,
    };
    setSymptoms(updated);
    setEditingIndex(null);
    resetFormState();
    setShowEditModal(false);
  };

  const deleteSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
    setEditingIndex(null);
    setShowEditModal(false);
  };

  const toggleResolved = (index: number) => {
    const updated = [...symptoms];
    updated[index].resolved = !updated[index].resolved;
    setSymptoms(updated);
  };

  const openAddModal = () => {
    resetFormState();
    setShowAddModal(true);
  };

  const openEditModal = (index: number) => {
    const symptom = symptoms[index];
    setFormState({
      symptom: symptom.symptom,
      intensity: symptom.intensity,
      date: new Date().toISOString().split("T")[0],
      time: symptom.time.split(", ")[1] || new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
    });
    setEditingIndex(index);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingIndex(null);
    resetFormState();
  };

  const handleInfoClick = () => {
    navigate("/bloomguide?stage=generalMotherhood&category=symptoms");
  };

  const SymptomFormFields: React.FC = () => (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Symptom (e.g., Headache, Nausea, etc.)"
        value={formState.symptom}
        onChange={(e) => setFormState({ ...formState, symptom: e.target.value })}
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bloomPink focus:border-bloomPink placeholder-gray-500"
      />

      <p className="text-bloomBlack font-rubik">How intense is it?</p>
      <select
        value={formState.intensity}
        onChange={(e) => setFormState({ ...formState, intensity: e.target.value as "Low" | "Medium" | "High" })}
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bloomPink focus:border-bloomPink"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <p className="text-bloomBlack font-rubik">When did it start?</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="date"
            value={formState.date}
            onChange={(e) => setFormState({ ...formState, date: e.target.value })}
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bloomPink focus:border-bloomPink"
          />
        </div>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="time"
            value={formState.time}
            onChange={(e) => setFormState({ ...formState, time: e.target.value })}
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bloomPink focus:border-bloomPink"
          />
        </div>
      </div>
    </div>
  );

  const ModalBackdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">{children}</div>
  );

  const ModalContent: React.FC<{
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    actionButtons?: React.ReactNode;
  }> = ({ title, onClose, children, actionButtons }) => (
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto scrollbar-thin">
      <h3 className="text-xl font-bold text-bloomPink mb-4">{title}</h3>
      {children}
      {actionButtons}
      <button
        onClick={onClose}
        className="w-full mt-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold"
      >
        Cancel
      </button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-gradient-to-r from-bloomPink to-bloomYellow p-6 rounded-3xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Eye className="text-white w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Symptoms</h3>
          </div>
          <button
            onClick={handleInfoClick}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300"
            title="Learn more about your symptoms"
          >
            <Info className="text-white w-5 h-5" />
          </button>
        </div>

        <p className="text-bloomBlack font-rubik mb-4">
          Feel any discomfort in your body lately? Manage them better here. 🌸💗
        </p>

        {/* Logs Header */}
        <div className="flex items-center gap-2 mb-4">
          <HeartHandshake className="w-5 h-5 text-white" />
          <h4 className="text-lg font-semibold text-white">Symptom Logs</h4>
          <span className="bg-white/30 text-white text-sm px-2 py-1 rounded-full">{symptoms.length}</span>
        </div>

        {/* Symptom List */}
        <div className="space-y-3 mb-6 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/50 scrollbar-track-transparent hover:scrollbar-thumb-white/50">
          {symptoms
            .sort((a, b) => Number(a.resolved) - Number(b.resolved))
            .map((item, idx) => (
              <div
                key={idx}
                className={`flex justify-between items-center p-4 rounded-xl transition-all duration-200 ${
                  item.resolved
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
                    className="p-2 rounded-xl transition-colors duration-200 text-bloomBlack hover:text-bloomPink"
                    title="Edit symptom"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => toggleResolved(idx)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.resolved ? "bg-green-500/90 hover:bg-green-600 text-white" : "bg-red-500/90 hover:bg-green-300 text-white"
                    }`}
                    title={item.resolved ? "Mark as unresolved" : "Mark as resolved"}
                  >
                    {item.resolved ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Add Symptom Button */}
        <div className="flex justify-center">
          <button
            onClick={openAddModal}
            className="w-full group bg-white/30 text-white px-8 py-3 rounded-2xl font-semibold transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 shadow-md"
          >
            <Plus className="group-hover:rotate-90 transition-transform duration-200" />
            <span className="text-center">Log New Symptom</span>
          </button>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <ModalBackdrop>
            <ModalContent
              title="Add New Symptom"
              onClose={closeModals}
              actionButtons={
                <button
                  onClick={addSymptom}
                  className="w-full bg-gradient-to-r from-bloomPink to-bloomYellow hover:scale-105 rounded-xl transition-all shadow-lg duration-200 text-white font-semibold py-3 flex items-center justify-center gap-2 mt-6"
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

        {/* Edit Modal */}
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
                    <Edit3 size={16} />
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
    </motion.div>
  );
};

export default SymptomsList;