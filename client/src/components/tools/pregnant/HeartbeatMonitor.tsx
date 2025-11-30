import React, { useState, useEffect } from "react";
import { Play, Square, Heart, Clock } from "lucide-react";
import { bbtoolsService } from "../../../services/BBToolsService";

interface HeartbeatSession {
  id?: number;
  date: string;
  time: string;
  bpm: number;
  duration: number;
  notes: string;
  category: string;
}

const HeartbeatMonitor: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [bpm, setBpm] = useState(0);
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState("");
  const [sessionHistory, setSessionHistory] = useState<HeartbeatSession[]>([]);
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isMonitoring) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const fetchSessions = async () => {
    const res = await bbtoolsService.getAll();
    if (res.success && res.data) {
      const heartbeatLogs =
        res.data.metrics?.filter((m: any) => m.title === "heartbeatMonitor") || [];

      const formatted = heartbeatLogs.map((log: any) => {
        const sessionBpm = log.value ? Number(log.value) : 0;
        return {
          id: log.id,
          date: new Date(log.createdAt).toLocaleDateString(),
          time: new Date(log.createdAt).toLocaleTimeString(),
          bpm: sessionBpm,
          duration: log.notes ? Number(log.notes.split(" | ")[0]) : 0,
          notes: log.notes ? log.notes.split(" | ")[1] : "",
          category: getBpmCategory(sessionBpm)
        };
      });

      setSessionHistory(formatted);
    }
  };

  const getBpmCategory = (currentBpm: number): string => {
    if (currentBpm === 0) return "No Data";
    if (currentBpm < 110) return "Low";
    if (currentBpm > 160) return "High";
    return "Normal";
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    setDuration(0);
    setBpm(0);
    setTapTimes([]);
  };

  const stopMonitoring = async () => {
    setIsMonitoring(false);

    if (duration > 0) {
      const category = getBpmCategory(bpm);
      const session: HeartbeatSession = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        bpm: Math.round(bpm),
        duration,
        notes,
        category
      };

      setSessionHistory(prev => [session, ...prev.slice(0, 4)]);
      setNotes("");

      await bbtoolsService.createMetric({
        title: "heartbeatMonitor",
        value: String(session.bpm),
        notes: `${session.duration} | ${session.notes}`,
      });

      fetchSessions();
    }
  };

  const handleTap = () => {
    const now = Date.now();
    
    setTapTimes(prev => {
      const updated = [...prev, now]; // 
      
      if (updated.length >= 2) {
        const intervals = [];
        for (let i = 1; i < updated.length; i++) {
          intervals.push((updated[i] - updated[i - 1]) / 1000); // Convert to seconds
        }
        
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const calculatedBpm = 60 / avgInterval;
        
        setBpm(calculatedBpm);
      }
      
      return updated;
    });
  };

  const bpmCategory = getBpmCategory(bpm);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Normal": return "text-green-600";
      case "Low": return "text-yellow-600";
      case "High": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">
          Fetal Heartbeat Monitor
        </h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-pink-200 p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div
                className={`p-4 rounded-full ${
                  bpmCategory === "Normal"
                    ? "bg-green-100"
                    : bpmCategory === "Low"
                    ? "bg-yellow-100"
                    : bpmCategory === "High"
                    ? "bg-red-100"
                    : "bg-gray-200"
                }`}
              >
                <Heart
                  className={`w-8 h-8 ${
                    bpmCategory === "Normal"
                      ? "text-green-600 animate-pulse"
                      : bpmCategory === "Low"
                      ? "text-yellow-600"
                      : bpmCategory === "High"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                />
              </div>

              <div>
                <div className="text-4xl font-bold text-gray-800">
                  {bpm > 0 ? Math.round(bpm) : "--"}
                </div>
                <div className="text-lg text-gray-600">BPM</div>
                {bpm > 0 && (
                  <div className={`text-sm font-semibold ${getCategoryColor(bpmCategory)}`}>
                    {bpmCategory}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-6">
              <Clock className="w-4 h-4" />
              <span>{duration} seconds</span>
              <span className="text-xs text-gray-500">{tapTimes.length} taps</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              {!isMonitoring ? (
                <button
                  onClick={startMonitoring}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Monitor
                </button>
              ) : (
                <>
                  <button
                    onClick={stopMonitoring}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    Stop
                  </button>

                  <button
                    onClick={handleTap}
                    className="bg-blue-500 text-white px-6 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-600 transition-all duration-300 w-full"
                  >
                    Tap Heartbeat
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-3">Session Notes</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this monitoring session..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-bloomPink focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">BPM Categories</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li><span className="font-semibold text-green-600">Normal:</span> 110–160 BPM</li>
              <li><span className="font-semibold text-yellow-600">Low:</span> Below 110 BPM</li>
              <li><span className="font-semibold text-red-600">High:</span> Above 160 BPM</li>
            </ul>
            <p className="mt-3 text-xs text-blue-600">
              ⚠️ This tool is for awareness only. Consult your healthcare provider for medical advice.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Recent Sessions</h4>

            {sessionHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No sessions recorded yet</p>
            ) : (
              <div className="space-y-3">
                {sessionHistory.map((session, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">
                        {session.bpm} BPM
                      </span>
                      <span className={`text-sm font-semibold ${getCategoryColor(session.category)}`}>
                        {session.category}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>{session.date}</span>
                      <span>{session.time}</span>
                    </div>

                    {session.notes && (
                      <p className="text-sm text-gray-700 mt-2">{session.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartbeatMonitor;