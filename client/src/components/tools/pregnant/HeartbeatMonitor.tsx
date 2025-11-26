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
    setBpm(0);
    setTapTimes([]);
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
      const updated = [...prev, now].slice(-5); // keep last 5 taps

      if (updated.length >= 2) {
        const intervals = [];
        for (let i = 1; i < updated.length; i++) {
          intervals.push((updated[i] - updated[i - 1]) / 1000); // seconds
        }

        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const calculatedBpm = 60 / avgInterval;

        setBpm(calculatedBpm);
      }

      return updated;
    });
  };

  const getBpmStatus = (currentBpm: number) => {
    if (currentBpm === 0) return "none";
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
        <h3 className="text-2xl font-bold text-bloomBlack">
          Fetal Heartbeat Monitor
        </h3>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl mb-6 text-sm text-blue-700 border border-blue-200">
        <p className="font-semibold">Instructions:</p>
        <ul className="list-disc ml-5 mt-1 space-y-1">
          <li>Press <strong>Start Monitor</strong> when you're ready.</li>
          <li>Each time you hear a heartbeat, tap the <strong>Tap Heartbeat</strong> button.</li>
          <li>The BPM will update based on your taps.</li>
          <li>About <strong>10–12 taps</strong> is enough to get an accurate reading.</li>
          <li>Try to tap steadily and in rhythm with the heartbeat you hear.</li>
        </ul>

        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="font-semibold">Normal Heart Rate Guide:</p>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            <li><strong>110–160 BPM</strong> – typical fetal heart rate</li>
            <li><strong>Below 110 BPM</strong> – lower than usual</li>
            <li><strong>Above 160 BPM</strong> – higher than usual</li>
          </ul>

    <p className="mt-2 text-xs text-blue-600">
      ⚠️ This tool is for awareness only and not a medical device. If your readings stay low or high,
      or if you have concerns, please consult your healthcare provider.
    </p>
  </div>
</div>


      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-pink-200 p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div
                className={`p-4 rounded-full ${
                  bpmStatus === "normal"
                    ? "bg-green-100"
                    : bpmStatus === "low"
                    ? "bg-yellow-100"
                    : bpmStatus === "high"
                    ? "bg-red-100"
                    : "bg-gray-200"
                }`}
              >
                <Heart
                  className={`w-8 h-8 ${
                    bpmStatus === "normal"
                      ? "text-green-600 animate-pulse"
                      : bpmStatus === "low"
                      ? "text-yellow-600"
                      : bpmStatus === "high"
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
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-6">
              <Clock className="w-4 h-4" />
              <span>{duration} seconds</span>
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


// So we will use this logic:

// User taps the big “Tap Heartbeat” button

// Store timestamps in an array

// Always keep the last 5 taps

// Calculate intervals between taps

// Compute average interval

// BPM = 60 / avgIntervalInSeconds