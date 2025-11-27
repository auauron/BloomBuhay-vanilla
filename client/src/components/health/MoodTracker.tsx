import React, { useState, useEffect } from "react";
import { 
  Info, Plus, Edit3, Trash2, Save, X, Clock,
  Rose, Smile, Frown, Laugh, Meh, Angry, Heart, Zap, CloudRain, Cloud, Sun
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { healthtrackerService, HealthMood } from "../../services/healthtrackerService";

import "../../index.css";

interface MoodLog {
  id: number;
  date: string;
  mood: string;
  label: string;
  notes?: string;
  timestamp: string;
}

const moodOptions = [
  { icon: <Laugh className="w-6 h-6" />, label: "Excited", color: "from-yellow-400 to-orange-400" },
  { icon: <Smile className="w-6 h-6" />, label: "Happy", color: "from-green-400 to-emerald-400" },
  { icon: <Sun className="w-6 h-6" />, label: "Content", color: "from-blue-400 to-cyan-400" },
  { icon: <Meh className="w-6 h-6" />, label: "Neutral", color: "from-gray-400 to-gray-500" },
  { icon: <Cloud className="w-6 h-6" />, label: "Tired", color: "from-slate-400 to-slate-500" },
  { icon: <Frown className="w-6 h-6" />, label: "Low Energy", color: "from-purple-400 to-pink-400" },
  { icon: <CloudRain className="w-6 h-6" />, label: "Emotional", color: "from-indigo-400 to-purple-400" },
  { icon: <Angry className="w-6 h-6" />, label: "Irritable", color: "from-red-400 to-orange-400" },
  { icon: <Zap className="w-6 h-6" />, label: "Anxious", color: "from-amber-400 to-yellow-400" },
  { icon: <Heart className="w-6 h-6" />, label: "Loving", color: "from-rose-400 to-pink-400" },
];

const MoodTracker: React.FC = () => {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [showMoodModal, setShowMoodModal] = useState(false);

  const [editingLog, setEditingLog] = useState<MoodLog | null>(null);
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /** ============================
   *  FETCH MOODS FROM BACKEND
   *  ============================ */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await healthtrackerService.getAll();

        if (!mounted) return;

        if (res.success && res.data?.moods) {
          const formatted = res.data.moods.map((m: HealthMood) => ({
            id: m.id,
            date: new Date(m.createdAt).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
            timestamp: new Date(m.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            mood: m.mood,
            label: m.mood,
            notes: m.notes,
          }));

          setMoodLogs(formatted.reverse()); // newest first
        }
      } catch (err) {
        console.error("Failed to fetch moods:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /** ============================
   *  ADD MOOD TO BACKEND
   *  ============================ */
  const handleLogMood = async (label: string) => {
    try {
      const res = await healthtrackerService.addMood({ mood: label, notes: note });

      if (res.success && res.data) {
        const newLog: MoodLog = {
          id: res.data.id,
          date: new Date(res.data.createdAt).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          timestamp: new Date(res.data.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          mood: label,
          label: label,
          notes: note,
        };

        setMoodLogs((prev) => [newLog, ...prev]);
      }
    } catch (err) {
      console.error("Add mood error:", err);
    }

    setSelectedMood("");
    setNote("");
    setShowMoodModal(false);
  };

  /** ============================
   *  START EDIT
   *  ============================ */
  const startEdit = (log: MoodLog) => {
    setEditingLog(log);
    setNote(log.notes || "");
  };

  /** ============================
   *  SAVE EDIT
   *  ============================ */
  const saveEdit = async () => {
    if (!editingLog) return;

    try {
      const res = await healthtrackerService.updateMood(editingLog.id, { notes: note });

      if (res.success) {
        setMoodLogs((prev) =>
          prev.map((log) =>
            log.id === editingLog.id ? { ...log, notes: note } : log
          )
        );
      }
    } catch (err) {
      console.error("Update mood error:", err);
    }

    setEditingLog(null);
    setNote("");
  };

  /** ============================
   *  DELETE MOOD
   *  ============================ */
  const deleteMood = async (id: number) => {
    try {
      const res = await healthtrackerService.deleteMood(id);

      if (res.success) {
        setMoodLogs((prev) => prev.filter((log) => log.id !== id));
      }
    } catch (err) {
      console.error("Delete mood error:", err);
    }

    if (editingLog?.id === id) setEditingLog(null);
  };

  const handleInfoClick = () => {
    navigate("/bloomguide?stage=generalMotherhood&category=moods");
  };

  const getMoodIcon = (label: string) =>
    moodOptions.find((m) => m.label === label)?.icon || <Meh className="w-5 h-5" />;

  const getMoodColor = (label: string) =>
    moodOptions.find((m) => m.label === label)?.color || "from-gray-400 to-gray-500";

  const closeModal = () => {
    setShowMoodModal(false);
    setSelectedMood("");
    setNote("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-gradient-to-r from-bloomPink to-bloomYellow p-6 rounded-3xl shadow-lg border-pink-100 overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Smile className="text-white w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Mood Tracker</h3>
          </div>

          <button
            onClick={handleInfoClick}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all"
          >
            <Info className="text-white w-5 h-5" />
          </button>
        </div>

        <p className="text-bloomBlack font-normal mb-4">
          How are you feeling today? Your emotions matter. 💝
        </p>

        {/* =======================
            MOOD LOGS
        ======================== */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Rose className="w-5 h-5 text-white" />
            <h4 className="text-lg font-semibold text-white">Mood Logs</h4>
            <span className="bg-white/30 text-white text-sm px-2 py-1 rounded-full">
              {moodLogs.length}
            </span>
          </div>

          <div className="space-y-3 mb-6 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/40">

            {loading ? (
              <p className="text-white/60 text-center py-6">Loading moods...</p>
            ) : moodLogs.length === 0 ? (
              <div className="text-center py-8 text-white/80">
                <Smile className="w-12 h-12 mx-auto mb-3 text-white/60" />
                <p className="font-medium">No moods logged yet</p>
                <p className="text-sm">Track your first mood to get started</p>
              </div>
            ) : (
              moodLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white rounded-2xl p-4 border border-white/30 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${getMoodColor(log.label)} text-white`}>
                        {getMoodIcon(log.label)}
                      </div>
                      <div>
                        <h5 className="font-semibold text-bloomBlack">{log.label}</h5>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{log.date}</span>
                          <span>•</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(log)}
                        className="p-2 rounded-xl text-bloomBlack hover:text-bloomPink transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMood(log.id)}
                        className="p-2 rounded-xl text-bloomBlack hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {editingLog?.id === log.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border bg-bloomYellow/40"
                        rows={3}
                        placeholder="Add notes..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="px-3 py-2 bg-bloomPink text-white rounded-xl"
                        >
                          <Save className="w-4 h-4 inline-block mr-1" />
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingLog(null); setNote(""); }}
                          className="px-3 py-2 border rounded-xl text-gray-700"
                        >
                          <X className="w-4 h-4 inline-block mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {log.notes ? (
                        <p className="text-gray-700 text-sm bg-bloomYellow/40 rounded-xl p-3">
                          {log.notes}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-sm italic">No notes added</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ADD MOOD BUTTON */}
        <button
          onClick={() => setShowMoodModal(true)}
          className="w-full bg-white/30 text-white px-8 py-3 rounded-2xl hover:scale-105 transition flex justify-center items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Log Your Mood
        </button>

        {/* ==========================
            MOOD MODAL
        =========================== */}
        {showMoodModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">

              <div className="flex justify-between items-center p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
                    <Smile className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-bloomPink">How are you feeling?</h2>
                </div>

                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {moodOptions.map((mood, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedMood(mood.label)}
                      className={`flex flex-col items-center p-3 rounded-2xl transition 
                      ${selectedMood === mood.label
                        ? "bg-gradient-to-r from-bloomPink/20 to-bloomYellow/20 border-2 border-bloomPink"
                        : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${mood.color} text-white mb-2`}>
                        {mood.icon}
                      </div>
                      <span className="text-xs text-gray-700">{mood.label}</span>
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 border rounded-2xl focus:ring-bloomPink"
                  rows={3}
                  placeholder="Any thoughts or feelings to note?"
                />

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeModal}
                    className="flex-1 border px-6 py-3 rounded-2xl text-gray-700"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={!selectedMood}
                    onClick={() => handleLogMood(selectedMood)}
                    className="flex-1 bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-6 py-3 rounded-2xl 
                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Log Mood
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default MoodTracker;