import React, { useState } from "react";
import { 
  Info, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Clock,
  Rose,
  Smile,
  Frown,
  Laugh,
  Meh,
  Angry,
  Heart,
  Zap,
  CloudRain,
  Cloud,
  Sun
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import { motion } from "framer-motion";

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
  // Sample mood logs for presentation
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([
    {
      id: 1,
      date: "Mon, Jan 15",
      mood: "Happy",
      label: "Happy",
      notes: "Feeling great today! Baby has been active and I have lots of energy. Had a wonderful prenatal yoga session this morning.",
      timestamp: "09:30 AM"
    },
    {
      id: 2,
      date: "Sun, Jan 14",
      mood: "Tired",
      label: "Tired",
      notes: "Long day but managed to get some rest. Feeling a bit exhausted but happy overall.",
      timestamp: "08:15 PM"
    },
    {
      id: 3,
      date: "Sat, Jan 13",
      mood: "Excited",
      label: "Excited",
      notes: "We saw the baby's heartbeat during the ultrasound today! Everything looks perfect.",
      timestamp: "02:45 PM"
    }
  ]);

  const [selectedMood, setSelectedMood] = useState<string>("");
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [editingLog, setEditingLog] = useState<MoodLog | null>(null);
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  const handleLogMood = (label: string) => {
    const newLog: MoodLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      mood: label,
      label,
      notes: note,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMoodLogs([newLog, ...moodLogs]);
    setSelectedMood(label);
    setNote("");
    setShowMoodModal(false);
  };

  const startEdit = (log: MoodLog) => {
    setEditingLog(log);
    setNote(log.notes || "");
  };

  const saveEdit = () => {
    if (editingLog) {
      setMoodLogs(moodLogs.map(log => 
        log.id === editingLog.id 
          ? { ...log, notes: note }
          : log
      ));
      setEditingLog(null);
      setNote("");
    }
  };

  const cancelEdit = () => {
    setEditingLog(null);
    setNote("");
  };

  const deleteMood = (id: number) => {
    setMoodLogs(moodLogs.filter((log) => log.id !== id));
    if (editingLog?.id === id) {
      setEditingLog(null);
    }
  };

  const handleInfoClick = () => {
    navigate("/bloomguide");
  };

  const getMoodIcon = (label: string) => {
    return moodOptions.find(mood => mood.label === label)?.icon || <Meh className="w-5 h-5" />;
  };

  const getMoodColor = (label: string) => {
    return moodOptions.find(mood => mood.label === label)?.color || "from-gray-400 to-gray-500";
  };

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
          {moodLogs.length === 0 ? (
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
                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-bloomPink to-bloomYellow text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm"

                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm"
                      >
                        <X className="w-4 h-4" />
                        Cancel
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
            className="w-full group bg-white/30 text-white px-8 py-3 rounded-2xl font-semibold over:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 shadow-md"
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
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Mood Selection */}
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
                  <Plus className="w-4 h-4" />
                  Log Mood
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