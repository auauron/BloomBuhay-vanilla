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
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [editingLog, setEditingLog] = useState<MoodLog | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch moods from API on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await healthtrackerService.getAll();
        if (!mounted) return;
        if (res.success && res.data?.moods) {
          setMoodLogs(
            res.data.moods.map((m: HealthMood) => ({
              id: m.id,
              date: new Date(m.createdAt || "").toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
              timestamp: new Date(m.createdAt || "").toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              mood: m.mood,
              label: m.mood,
              notes: m.notes,
            }))
          );
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

  // Add new mood to API
  const handleLogMood = async (label: string) => {
    const payload = { mood: label, notes: note };
    try {
      const res = await healthtrackerService.addMood(payload);
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
          label,
          notes: note,
        };
        setMoodLogs([newLog, ...moodLogs]);
      } else {
        console.error("Failed to save mood:", res.error);
      }
    } catch (err) {
      console.error("Add mood error:", err);
    }
    setSelectedMood("");
    setNote("");
    setShowMoodModal(false);
  };

  // Start editing a mood
  const startEdit = (log: MoodLog) => {
    setEditingLog(log);
    setNote(log.notes || "");
  };

  // Save edited notes to API
  const saveEdit = async () => {
    if (!editingLog) return;
    try {
      if ('updateMood' in healthtrackerService && typeof (healthtrackerService as any).updateMood === "function") {
        const res = await (healthtrackerService as any).updateMood(editingLog.id, { notes: note });
        if (res.success) {
          setMoodLogs(
            moodLogs.map((log) => (log.id === editingLog.id ? { ...log, notes: note } : log))
          );
        } else {
          console.error("Failed to update mood:", res.error);
        }
      } else {
        // API doesn't provide updateMood — apply local optimistic update
        console.warn("healthtrackerService.updateMood not available; applying local update only.");
        setMoodLogs(
          moodLogs.map((log) => (log.id === editingLog.id ? { ...log, notes: note } : log))
        );
      }
    } catch (err) {
      console.error("Update mood error:", err);
    } finally {
      setEditingLog(null);
      setNote("");
    }
  };

  // Delete mood from API
  const deleteMood = async (id: number) => {
    try {
      if ('deleteMood' in healthtrackerService && typeof (healthtrackerService as any).deleteMood === "function") {
        const res = await (healthtrackerService as any).deleteMood(id);
        if (res.success) {
          setMoodLogs(moodLogs.filter((log) => log.id !== id));
        } else {
          console.error("Failed to delete mood:", res.error);
        }
      } else {
        // API doesn't provide deleteMood — apply local optimistic delete
        console.warn("healthtrackerService.deleteMood not available; applying local delete only.");
        setMoodLogs(moodLogs.filter((log) => log.id !== id));
      }
    } catch (err) {
      console.error("Delete mood error:", err);
    }
    if (editingLog?.id === id) setEditingLog(null);
  };

  const handleInfoClick = () => {
    navigate("/bloomguide?stage=generalMotherhood&category=moods");
  };

  const getMoodIcon = (label: string) => moodOptions.find((m) => m.label === label)?.icon || <Meh className="w-5 h-5" />;
  const getMoodColor = (label: string) => moodOptions.find((m) => m.label === label)?.color || "from-gray-400 to-gray-500";
  const handleCloseModal = () => {
    setShowMoodModal(false);
    setSelectedMood("");
    setNote("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-gradient-to-r from-bloomPink to-bloomYellow p-6 rounded-3xl shadow-lg border-pink-100 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Smile className="text-white w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Mood Tracker</h3>
          </div>
          <button
            onClick={handleInfoClick}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300"
            title="Learn more about your moods"
          >
            <Info className="text-white w-5 h-5" />
          </button>
        </div>

        <p className="text-bloomBlack font-rubik font-normal mb-4">
          How are you feeling today? Your emotions matter. 💝
        </p>

        {/* Mood Logs Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Rose className="w-5 h-5 text-white" />
            <h4 className="text-lg font-semibold text-white">Mood Logs</h4>
            <span className="bg-white/30 text-white text-sm px-2 py-1 rounded-full">
              {moodLogs.length}
            </span>
          </div>

          <div className="space-y-3 mb-6 max-h-80 scrollbar-thin overflow-y-auto scrollbar-thumb-white/50 scrollbar-track-transparent hover:scrollbar-thumb-white/50">
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
                  className="bg-white backdrop-blur-sm rounded-2xl p-4 border border-white/30 hover:border-white/50 transition-all duration-300"
                >
                  {/* Log Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${getMoodColor(log.label)} text-white`}>
                        {getMoodIcon(log.label)}
                      </div>
                      <div>
                        <h5 className="font-semibold text-bloomBlack">{log.label}</h5>
                        <div className="flex items-center gap-2 text-xs text-bloomBlack/80">
                          <Clock className="w-3 h-3" />
                          <span>{log.date}</span>
                          <span>•</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(log)}
                        className="p-2 rounded-xl transition-colors duration-200 text-bloomBlack hover:text-bloomPink"
                        title="Edit notes"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMood(log.id)}
                        className="p-2 hover:bg-red/20 rounded-xl transition-colors duration-200 text-bloomBlack hover:text-red-700"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {editingLog?.id === log.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full px-3 py-2 border border-white/0 rounded-xl focus:ring-2 focus:ring-white focus:border-white bg-bloomYellow/50 text-bloomBlack placeholder-white/60"
                        rows={3}
                        placeholder="Add your notes here..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="flex items-center gap-2 px-3 py-2 bg-bloomPink text-white rounded-xl hover:shadow-lg hover:bg-bloomPink/90 transition-all duration-300 text-sm"
                        >
                          <Save className="w-4 h-4" /> Save
                        </button>
                        <button
                          onClick={() => { setEditingLog(null); setNote(""); }}
                          className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {log.notes ? (
                        <p className="text-bloomBlack/80 text-sm bg-bloomYellow/50 rounded-xl p-3 border border-white/20">
                          {log.notes}
                        </p>
                      ) : (
                        <p className="text-white/60 text-sm italic">No notes added</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Mood Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowMoodModal(true)}
            className="w-full group bg-white/30 text-white px-8 py-3 rounded-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 shadow-md"
          >
            <Plus className="group-hover:rotate-90 transition-transform duration-200" />
            <span className="text-center">Log Your Mood</span>
          </button>
        </div>

        {/* Mood Selection Modal */}
        {showMoodModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
                    <Smile className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-bloomPink">How are you feeling? </h2> 
                </div>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <p className="mr-6 ml-6 mt-8 text-sm font-medium text-gray-700 mb-[-4px]">Select your current mood</p>
              <div className="p-6">
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {moodOptions.map((mood, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedMood(mood.label)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
                        selectedMood === mood.label 
                          ? "bg-gradient-to-r from-bloomPink/20 to-bloomYellow/20 border-2 border-bloomPink scale-105" 
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${mood.color} text-white mb-2`}>
                        {mood.icon}
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                        {mood.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Notes Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Add notes (optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="How are you feeling today? Any specific thoughts or concerns?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-bloomPink focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => selectedMood && handleLogMood(selectedMood)}
                    disabled={!selectedMood}
                    className="flex-1 bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-6 py-3 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none flex items-center justify-center gap-2"
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