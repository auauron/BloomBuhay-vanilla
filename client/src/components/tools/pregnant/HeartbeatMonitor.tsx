import React, { useState, useEffect } from "react";
import { Play, Square, Heart, Clock, Volume2 } from "lucide-react";
import { bbtoolsService } from "../../../services/BBToolsService";

interface HeartbeatSession {
  id?: number;
  date: string;
  time: string;
  bpm: number;
  duration: number;
  notes: string;
}

const HeartbeatMonitor: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState("");
  const [sessionHistory, setSessionHistory] = useState<HeartbeatSession[]>([]);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    // Fetch session history from backend on mount
    fetchSessions();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isMonitoring) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        setBpm(prev => prev + (Math.random() - 0.5) * 4); // simulate variation
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const fetchSessions = async () => {
    const res = await bbtoolsService.getAll();
    if (res.success && res.data) {
      // Filter tools logs for heartbeat sessions
      const heartbeatLogs = res.data.metrics?.filter((m: any) => m.title === "heartbeatMonitor") || [];
      const formatted = heartbeatLogs.map((log: any) => ({
        id: log.id,
        date: new Date(log.createdAt).toLocaleDateString(),
        time: new Date(log.createdAt).toLocaleTimeString(),
        bpm: log.value ? Number(log.value) : 0,
        duration: log.notes ? Number(log.notes.split(" | ")[0]) : 0,
        notes: log.notes ? log.notes.split(" | ")[1] : "",
      }));
      setSessionHistory(formatted);
    }
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    setDuration(0);
    setBpm(120 + Math.random() * 40);
  };

  const stopMonitoring = async () => {
    setIsMonitoring(false);
    if (duration > 0) {
      const session: HeartbeatSession = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        bpm: Math.round(bpm),
        duration,
        notes
      };
      setSessionHistory(prev => [session, ...prev.slice(0, 4)]);
      setNotes("");

      // Persist to backend as a ToolsLog metric
      await bbtoolsService.createMetric({
        title: "heartbeatMonitor",
        value: String(session.bpm),
        notes: `${session.duration} | ${session.notes}`, // store duration + notes together
      });
      fetchSessions(); // refresh history after saving
    }
  };

  const playHeartbeatSound = () => {
    setAudioPlaying(true);
    setTimeout(() => setAudioPlaying(false), 3000);
  };

  const getBpmStatus = (currentBpm: number) => {
    if (currentBpm < 110) return "low";
    if (currentBpm > 160) return "high";
    return "normal";
  };

  const bpmStatus = getBpmStatus(bpm);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Fetal Heartbeat Monitor</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Monitor Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-pink-200 p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={`p-4 rounded-full ${
                bpmStatus === "normal" ? "bg-green-100" :
                bpmStatus === "low" ? "bg-yellow-100" : "bg-red-100"
              }`}>
                <Heart className={`w-8 h-8 ${
                  bpmStatus === "normal" ? "text-green-600 animate-pulse" :
                  bpmStatus === "low" ? "text-yellow-600" : "text-red-600"
                }`} />
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-800">{Math.round(bpm)}</div>
                <div className="text-lg text-gray-600">BPM</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-6">
              <Clock className="w-4 h-4" />
              <span>{duration} seconds</span>
            </div>

            <div className="flex gap-3 justify-center">
              {!isMonitoring ? (
                <button
                  onClick={startMonitoring}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Monitor
                </button>
              ) : (
                <button
                  onClick={stopMonitoring}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </button>
              )}
              <button
                onClick={playHeartbeatSound}
                disabled={audioPlaying}
                className="bg-blue-500 text-white px-4 py-3 rounded-2xl font-semibold hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes Section */}
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

        {/* History Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Recent Sessions</h4>
            {sessionHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No sessions recorded yet</p>
            ) : (
              <div className="space-y-3">
                {sessionHistory.map((session, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">{session.bpm} BPM</span>
                      <span className="text-sm text-gray-500">{session.duration}s</span>
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