import React, { useEffect, useState } from "react";
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
import { healthtrackerService, HealthSymptom } from "../../services/healthtrackerService";

interface SymptomLocal {
  id?: number;
  symptom: string;
  time: string;
  intensity: "Low" | "Medium" | "High" | string;
  resolved: boolean;
  notes?: string;
  rawCreatedAt?: string;
}

interface FormState {
  symptom: string;
  intensity: "Low" | "Medium" | "High";
  date: string;
  time: string;
  notes?: string;
}

const SymptomsList: React.FC = () => {
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState<SymptomLocal[]>([
    // you can keep sample items or start empty; we'll fetch real ones on mount
  ]);

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
        if (res.success && res.data && res.data.symptoms) {
          // map incoming to local shape if necessary
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
          setSymptoms([]); // fallback
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
      notes: "",
    });
  };

  // create symptom via API
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
        // server returns mapped symptom object
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
        // fallback: optimistic local add if server fails
        const time = formatDisplayDate(formState.date, formState.time);
        setSymptoms((prev) => [{ symptom: formState.symptom, time, intensity: formState.intensity, resolved: false, notes: formState.notes }, ...prev]);
        console.error("Add symptom failed:", res.error);
      }
    } catch (err) {
      console.error("Add symptom exception:", err);
    } finally {
      resetFormState();
      setShowAddModal(false);
    }
  };

  // update symptom via API
  const updateSymptom = async () => {
    if (editingIndex === null) return;
    const target = symptoms[editingIndex];
    if (!target || !target.id) {
      // if no id, just update locally
      const updated = [...symptoms];
      updated[editingIndex] = {
        ...updated[editingIndex],
        ...formState,
        time: formatDisplayDate(formState.date, formState.time),
      };
      setSymptoms(updated);
      setEditingIndex(null);
      resetFormState();
      setShowEditModal(false);
      return;
    }

    const payload: any = {
      symptom: formState.symptom,
      intensity: formState.intensity,
      date: formState.date,
      time: formState.time,
      notes: formState.notes,
    };

    try {
      const res = await healthtrackerService.updateSymptom(target.id, payload);
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
          time: formatDisplayDate(formState.date, formState.time),
          notes: formState.notes,
        };
        setSymptoms(updated);
        console.error("Update symptom failed:", res.error);
      }
    } catch (err) {
      console.error("Update symptom exception:", err);
    } finally {
      setEditingIndex(null);
      resetFormState();
      setShowEditModal(false);
    }
  };

  // delete symptom via API
  const deleteSymptom = async (index: number) => {
    const target = symptoms[index];
    if (!target) return;
    if (target.id) {
      try {
        const res = await healthtrackerService.deleteSymptom(target.id);
        if (res.success) {
          setSymptoms((prev) => prev.filter((_, i) => i !== index));
        } else {
          console.error("Delete symptom failed:", res.error);
        }
      } catch (err) {
        console.error("Delete symptom exception:", err);
      }
    } else {
      // local-only item, just remove
      setSymptoms((prev) => prev.filter((_, i) => i !== index));
    }
    setEditingIndex(null);
    setShowEditModal(false);
  };

  // toggle resolved state (optimistic update + API call)
  const toggleResolved = async (index: number) => {
    const updated = [...symptoms];
    const item = updated[index];
    updated[index] = { ...item, resolved: !item.resolved };
    setSymptoms(updated);

    if (item.id) {
      try {
        const res = await healthtrackerService.updateSymptom(item.id, { resolved: updated[index].resolved });
        if (!res.success) {
          console.error("Toggle resolved failed:", res.error);
          // revert
          setSymptoms((prev) => prev.map((s, i) => (i === index ? item : s)));
        } else if (res.data) {
          // sync with server response
          const fromServer = res.data as any;
          setSymptoms((prev) => prev.map((s) => (s.id === fromServer.id ? {
            id: fromServer.id,
            symptom: fromServer.symptom,
            time: fromServer.time,
            intensity: fromServer.intensity,
            resolved: !!fromServer.resolved,
            notes: fromServer.notes,
          } : s)));
        }
      } catch (err) {
        console.error("Toggle resolved exception:", err);
        // revert
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

      <textarea
        placeholder="Notes (optional)"
        value={formState.notes}
        onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bloomPink focus:border-bloomPink placeholder-gray-500"
      />
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
          {loading ? (
            <div className="text-white/80">Loading...</div>
          ) : (
            [...symptoms]
              .sort((a, b) => Number(a.resolved) - Number(b.resolved))
              .map((item, idx) => (
                <div
                  key={item.id ?? `${item.symptom}-${item.time}-${idx}`}
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
              ))
          )}
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