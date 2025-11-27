import React, { useState, useEffect } from "react";
import { Play, Square, RotateCcw, Footprints, Clock, AlertTriangle } from "lucide-react";
import { bbtoolsService, KickSession } from "../../../services/BBToolsService";

const KickCounter: React.FC = () => {
  const [isCounting, setIsCounting] = useState(false);
  const [kickCount, setKickCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<Array<{ date: string; kicks: number; time: number; id?: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // load persisted sessions from backend on mount
    let mounted = true;
    (async () => {
      setLoading(true);
      const resp = await bbtoolsService.getKickSessions();
      if (!mounted) return;
      setLoading(false);
      if (resp.success && Array.isArray(resp.data)) {
        const mapped = resp.data.map((s: KickSession) => ({
          id: s.id,
          date: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : (s.startTime ? new Date(s.startTime).toLocaleDateString() : ""),
          kicks: s.kicks,
          time: s.durationSeconds ?? 0,
        }));
        setSessionHistory(mapped);
      } else {
        console.warn("No kick sessions or failed to load:", resp.error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isCounting) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCounting]);

  const startCounting = () => {
    setIsCounting(true);
    setStartTime(new Date());
    setKickCount(0);
    setElapsedTime(0);
    setError(null);
  };

  const stopCounting = async () => {
    setIsCounting(false);
    if (!startTime) return;

    // Only save if at least one kick recorded (you can adjust logic)
    const payload = {
      startTime: startTime.toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: elapsedTime,
      kicks: kickCount,
    };

    // optimistic update: show locally immediately
    if (kickCount > 0) {
      const session = {
        date: new Date().toLocaleDateString(),
        kicks: kickCount,
        time: elapsedTime,
      };
      setSessionHistory(prev => [session, ...prev.slice(0, 4)]);
    }

    // persist to backend
    try {
      setSaving(true);
      const resp = await bbtoolsService.createKickSession(payload);
      setSaving(false);
      if (!resp.success) {
        setError(resp.error || "Failed to save kick session");
        console.error("Save kick session failed:", resp);
        return;
      }

      // Update session history with the returned ID / createdAt if available
      if (resp.data) {
        const returned = resp.data as KickSession;
        const newEntry = {
          id: returned.id,
          date: returned.createdAt ? new Date(returned.createdAt).toLocaleDateString() : (returned.startTime ? new Date(returned.startTime).toLocaleDateString() : new Date().toLocaleDateString()),
          kicks: returned.kicks,
          time: returned.durationSeconds,
        };
        setSessionHistory(prev => [newEntry, ...prev.filter(s => s.date !== newEntry.date).slice(0, 4)]);
      }
    } catch (err) {
      setSaving(false);
      setError("Unexpected error while saving kick session");
      console.error(err);
    } finally {
      // reset counter UI (but keep history)
      setKickCount(0);
      setElapsedTime(0);
      setStartTime(null);
      setIsCounting(false);
    }
  };

  const resetCounter = () => {
    setIsCounting(false);
    setKickCount(0);
    setElapsedTime(0);
    setStartTime(null);
    setError(null);
  };

  const addKick = () => {
    if (isCounting) setKickCount(prev => prev + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getKickStatus = () => {
    if (elapsedTime >= 3600 && kickCount < 10) return "low";
    if (elapsedTime >= 1800 && kickCount < 10) return "monitor";
    return "normal";
  };

  const status = getKickStatus();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Footprints className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Kick Counter</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Main Counter */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-pink-200 p-6 text-center">
            <div className="text-6xl font-bold text-bloomPink mb-4">{kickCount}</div>
            <p className="text-gray-600 mb-2">Kicks Counted</p>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-6">
              <Clock className="w-4 h-4" />
              <span>{formatTime(elapsedTime)}</span>
            </div>

            <div className="flex gap-3 justify-center">
              {!isCounting ? (
                <button
                  onClick={startCounting}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Counting
                </button>
              ) : (
                <>
                  <button
                    onClick={addKick}
                    className="bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <Footprints className="w-8 h-8" />
                    Add Kick
                  </button>
                  <button
                    onClick={stopCounting}
                    disabled={saving}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    Stop
                  </button>
                </>
              )}
              <button
                onClick={resetCounter}
                className="bg-gray-500 text-white px-4 py-3 rounded-2xl font-semibold hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {saving && <p className="text-sm text-gray-500 mt-3">Saving session...</p>}
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          </div>

          {/* Status Indicator */}
          {isCounting && status !== "normal" && (
            <div
              className={`rounded-2xl p-4 border ${
                status === "low" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${status === "low" ? "text-red-600" : "text-yellow-600"}`} />
                <span className={`font-semibold ${status === "low" ? "text-red-800" : "text-yellow-800"}`}>
                  {status === "low" ? "Low Kick Count" : "Monitor Closely"}
                </span>
              </div>
              <p className={`text-sm mt-1 ${status === "low" ? "text-red-700" : "text-yellow-700"}`}>
                {status === "low"
                  ? "Contact your healthcare provider if you notice decreased movement"
                  : "Continue monitoring - aim for 10 kicks in 2 hours"}
              </p>
            </div>
          )}
        </div>

        {/* History & Instructions */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">How to Count Kicks</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Count all movements - kicks, rolls, swishes</li>
              <li>• Start counting when baby is active</li>
              <li>• Aim for 10 movements within 2 hours</li>
              <li>• Best time: after meals or when resting</li>
              <li>• Contact provider if pattern changes</li>
            </ul>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">Loading sessions...</div>
          ) : sessionHistory.length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Recent Sessions</h4>
              <div className="space-y-2">
                {sessionHistory.map((session, index) => (
                  <div key={session.id ?? index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{session.date}</span>
                    <span className="font-semibold text-bloomPink">{session.kicks} kicks</span>
                    <span className="text-gray-500">{formatTime(session.time)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Recent Sessions</h4>
              <p className="text-sm text-gray-600">No saved sessions yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KickCounter;