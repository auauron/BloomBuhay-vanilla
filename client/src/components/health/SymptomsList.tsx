import React, { useEffect, useState, useMemo } from "react";
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
import { healthtrackerService } from "../../services/healthtrackerService";
type Intensity = "Low" | "Medium" | "High";

interface SymptomLocal {
  id?: number;
  symptom: string;
  time: string;
  intensity: Intensity | string;
  resolved: boolean;
  notes?: string;
  rawCreatedAt?: string;
}

interface FormState {
  symptom: string;
  intensity: Intensity;
  date: string;
  time: string;
  notes?: string;
}

interface SymptomFormFieldsProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}

export const SymptomFormFields: React.FC<SymptomFormFieldsProps> = React.memo(function SymptomFormFields({
  formState,
  setFormState,
}) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Symptom (e.g., Headache, Nausea, etc.)"
        value={formState.symptom}
        onChange={(e) => setFormState((s) => ({ ...s, symptom: e.target.value }))}
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bloomPink focus:border-bloomPink placeholder-gray-500"
      />

      <p className="text-bloomBlack font-rubik">How intense is it?</p>
      <select
        value={formState.intensity}
        onChange={(e) => setFormState((s) => ({ ...s, intensity: e.target.value as Intensity }))}
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
            max={new Date().toISOString().split('T')[0]} 
            onChange={(e) => setFormState((s) => ({ ...s, date: e.target.value }))}
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bloomPink focus:border-bloomPink"
          />
        </div>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="time"
            value={formState.time}
            onChange={(e) => setFormState((s) => ({ ...s, time: e.target.value }))}
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bloomPink focus:border-bloomPink"
          />
        </div>
      </div>

      <textarea
        placeholder="Notes (optional)"
        value={formState.notes}
        onChange={(e) => setFormState((s) => ({ ...s, notes: e.target.value }))}
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bloomPink focus:border-bloomPink placeholder-gray-500"
      />
    </div>
  );
});

export const ModalBackdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">{children}</div>
);

export const ModalContent: React.FC<{
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

const SymptomsList: React.FC = () => {
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState<SymptomLocal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [formState, setFormState] = useState<FormState>({
    symptom: "",
    intensity: "Low",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
    notes: "",
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await healthtrackerService.getAll();
        if (!mounted) return;
        if (res.success && res.data?.symptoms) {
          const mapped: SymptomLocal[] = (res.data.symptoms as any[]).map((s) => ({
            id: s.id,
            symptom: s.symptom,
            time: s.time,
            intensity: s.intensity ?? "Low",
            resolved: !!s.resolved,
            notes: s.notes,
            rawCreatedAt: s.rawCreatedAt,
          }));
          setSymptoms(mapped);
        } else {
          setSymptoms([]);
        }
      } catch (err) {
        console.error("Failed to fetch symptoms:", err);
        setSymptoms([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const sortedSymptoms = useMemo(() => {
    return [...symptoms].sort((a, b) => Number(a.resolved) - Number(b.resolved));
  }, [symptoms]);

  const resetFormState = () => {
    setFormState({
      symptom: "",
      intensity: "Low",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      notes: "",
    });
  };

  const addSymptom = async () => {
    const payload = {
      symptom: formState.symptom,
      intensity: formState.intensity,
      date: formState.date,
      time: formState.time,
      notes: formState.notes,
      resolved: false,
    };

    try {
      const res = await healthtrackerService.addSymptom(payload);
      if (res.success && res.data) {
        const created = res.data as any;
        const local: SymptomLocal = {
          id: created.id,
          symptom: created.symptom,
          time: created.time,
          intensity: created.intensity ?? "Low",
          resolved: !!created.resolved,
          notes: created.notes,
          rawCreatedAt: created.rawCreatedAt,
        };
        setSymptoms((prev) => [local, ...prev]);
      } else {
        setSymptoms((prev) => [
          { symptom: formState.symptom, time: `${formState.date} ${formState.time}`, intensity: formState.intensity, resolved: false, notes: formState.notes },
          ...prev,
        ]);
        console.error("Add symptom failed:", (res as any).error);
      }
    } catch (err) {
      console.error("Add symptom exception:", err);
    } finally {
      resetFormState();
      setShowAddModal(false);
    }
  };

  const updateSymptom = async () => {
    if (editingIndex === null) return;
    const target = symptoms[editingIndex];
    if (!target || !target.id) {
      // local-only update
      const updated = [...symptoms];
      updated[editingIndex] = {
        ...updated[editingIndex],
        symptom: formState.symptom,
        intensity: formState.intensity,
        time: `${formState.date} ${formState.time}`,
        notes: formState.notes,
      };
      setSymptoms(updated);
      setEditingIndex(null);
      resetFormState();
      setShowEditModal(false);
      return;
    }

    try {
      const res = await healthtrackerService.updateSymptom(target.id, {
        symptom: formState.symptom,
        intensity: formState.intensity,
        date: formState.date,
        time: formState.time,
        notes: formState.notes,
      });
      if (res.success && res.data) {
        const updatedFromServer = res.data as any;
        const updatedLocal: SymptomLocal = {
          id: updatedFromServer.id,
          symptom: updatedFromServer.symptom,
          time: updatedFromServer.time,
          intensity: updatedFromServer.intensity,
          resolved: !!updatedFromServer.resolved,
          notes: updatedFromServer.notes,
          rawCreatedAt: updatedFromServer.rawCreatedAt,
        };
        setSymptoms((prev) => prev.map((s) => (s.id === updatedLocal.id ? updatedLocal : s)));
      } else {
        // fallback local update
        const updated = [...symptoms];
        updated[editingIndex] = {
          ...updated[editingIndex],
          symptom: formState.symptom,
          intensity: formState.intensity,
          time: `${formState.date} ${formState.time}`,
          notes: formState.notes,
        };
        setSymptoms(updated);
        console.error("Update symptom failed:", (res as any).error);
      }
    } catch (err) {
      console.error("Update symptom exception:", err);
    } finally {
      setEditingIndex(null);
      resetFormState();
      setShowEditModal(false);
    }
  };

  const deleteSymptom = async (index: number) => {
    const target = symptoms[index];
    if (!target) return;
    if (target.id) {
      try {
        const res = await healthtrackerService.deleteSymptom(target.id);
        if (res.success) {
          setSymptoms((prev) => prev.filter((_, i) => i !== index));
        } else {
          console.error("Delete symptom failed:", (res as any).error);
        }
      } catch (err) {
        console.error("Delete symptom exception:", err);
      }
    } else {
      setSymptoms((prev) => prev.filter((_, i) => i !== index));
    }
    setEditingIndex(null);
    setShowEditModal(false);
  };

  const toggleResolved = async (index: number) => {
    const updated = [...symptoms];
    const item = updated[index];
    updated[index] = { ...item, resolved: !item.resolved };
    setSymptoms(updated);

    if (item.id) {
      try {
        const res = await healthtrackerService.updateSymptom(item.id, { resolved: updated[index].resolved });
        if (!res.success) {
          console.error("Toggle resolved failed:", (res as any).error);
          setSymptoms((prev) => prev.map((s, i) => (i === index ? item : s)));
        }
      } catch (err) {
        console.error("Toggle resolved exception:", err);
        setSymptoms((prev) => prev.map((s, i) => (i === index ? item : s)));
      }
    }
  };

  const openAddModal = () => {
    resetFormState();
    setShowAddModal(true);
  };

  const openEditModal = (index: number) => {
    const symptom = symptoms[index];
    setFormState({
      symptom: symptom.symptom,
      intensity: (symptom.intensity as any) ?? "Low",
      date: symptom.rawCreatedAt ? new Date(symptom.rawCreatedAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      time: symptom.rawCreatedAt ? new Date(symptom.rawCreatedAt).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      notes: symptom.notes ?? "",
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
          <button onClick={handleInfoClick} className="p-2 rounded-xl bg-white/20 hover:bg-white/30" title="Learn more about your symptoms">
            <Info className="text-white w-5 h-5" />
          </button>
        </div>

        <p className="text-bloomBlack font-rubik mb-4">
          Feel any discomfort in your body lately? Manage them better here. 🌸💗
        </p>

        {/* Symptom List */}
        <div className="space-y-3 mb-6 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/50 scrollbar-track-transparent hover:scrollbar-thumb-white/50">
          {loading ? (
            <div className="text-white/80">Loading...</div>
          ) : (
            sortedSymptoms.map((item, idx) => (
              <div
                key={item.id ?? `${item.symptom}-${item.rawCreatedAt ?? item.time}-${idx}`}
                className={`flex justify-between items-center p-4 rounded-xl transition-all duration-200 ${
                  item.resolved ? "bg-gray-900/10 border border-white/20" : "bg-white border border-white/30 hover:bg-white/25 hover:border-white/40"
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
                  <button onClick={() => openEditModal(idx)} className="p-2 rounded-xl transition-colors duration-200 text-bloomBlack hover:text-bloomPink" title="Edit symptom">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => toggleResolved(idx)} className={`p-2 rounded-lg transition-colors ${item.resolved ? "bg-green-500/90 hover:bg-green-600 text-white" : "bg-red-500/90 hover:bg-green-300 text-white"}`} title={item.resolved ? "Mark as unresolved" : "Mark as resolved"}>
                    {item.resolved ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Symptom Button */}
        <div className="flex justify-center">
          <button onClick={openAddModal} className="w-full group bg-white/30 text-white px-8 py-3 rounded-2xl font-semibold transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 shadow-md">
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
              <SymptomFormFields formState={formState} setFormState={setFormState} />
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
                  <button onClick={() => deleteSymptom(editingIndex)} className="flex-1 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={16} />
                    Delete
                  </button>
                  <button onClick={updateSymptom} className="flex-1 py-3 rounded-lg bg-bloomPink hover:bg-bloomPink/90 text-white font-semibold transition-colors flex items-center justify-center gap-2" disabled={!formState.symptom.trim()}>
                    <Edit3 size={16} />
                    Update
                  </button>
                </div>
              }
            >
              <SymptomFormFields formState={formState} setFormState={setFormState} />
            </ModalContent>
          </ModalBackdrop>
        )}
      </div>
    </motion.div>
  );
};

export default SymptomsList;