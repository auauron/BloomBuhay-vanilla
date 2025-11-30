import React, { useState, useEffect } from "react";
import { Play, Square, RotateCcw, Footprints, Clock, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { bbtoolsService, KickSession } from "../../../services/BBToolsService";

interface Session {
  id?: number;
  date: string;
  kicks: number;
  time: number;
  category: string;
}

const KickCounter: React.FC = () => {
  const [isCounting, setIsCounting] = useState(false);
  const [kickCount, setKickCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          category: getSessionCategory(s.kicks, s.durationSeconds ?? 0)
        }));
        setSessionHistory(mapped);
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

  const getSessionCategory = (kicks: number, time: number): string => {
    const minutes = Math.floor(time / 60);
    
    if (kicks >= 10 && minutes <= 30) return "Excellent";
    if (kicks >= 10 && minutes <= 120) return "Good";
    if (kicks >= 5 && minutes <= 60) return "Monitor";
    if (kicks < 5 && minutes >= 60) return "Low";
    if (kicks < 3 && minutes >= 90) return "Concerning";
    
    return "Monitor";
  };

  const getCurrentCategory = (): string => {
    return getSessionCategory(kickCount, elapsedTime);
  };

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

    const payload = {
      startTime: startTime.toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: elapsedTime,
      kicks: kickCount,
    };

    const category = getCurrentCategory();
    const session: Session = {
      date: new Date().toLocaleDateString(),
      kicks: kickCount,
      time: elapsedTime,
      category: category
    };

    setSessionHistory(prev => [session, ...prev.slice(0, 4)]);

    try {
      setSaving(true);
      const resp = await bbtoolsService.createKickSession(payload);
      setSaving(false);
      
      if (resp.success && resp.data) {
        const returned = resp.data as KickSession;
        const newEntry: Session = {
          id: returned.id,
          date: returned.createdAt ? new Date(returned.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          kicks: returned.kicks,
          time: returned.durationSeconds ?? elapsedTime,
          category: getSessionCategory(returned.kicks, returned.durationSeconds ?? elapsedTime)
        };
        setSessionHistory(prev => [newEntry, ...prev.filter(s => s.id !== newEntry.id).slice(0, 4)]);
      }
    } catch (err) {
      setError("Failed to save session");
    } finally {
      setKickCount(0);
      setElapsedTime(0);
      setStartTime(null);
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
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Excellent": return "text-green-600";
      case "Good": return "text-blue-600";
      case "Monitor": return "text-yellow-600";
      case "Low": return "text-orange-600";
      case "Concerning": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const currentCategory = getCurrentCategory();

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

            {isCounting && (
              <div className="mb-4">
                <span className={`text-sm font-semibold ${getCategoryColor(currentCategory)}`}>
                  Status: {currentCategory}
                </span>
              </div>
            )}

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
                    <Footprints className="w-4 h-4" />
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

            {saving && <p className="text-sm text-gray-500 mt-3">Saving...</p>}
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          </div>
        </div>

        {/* History & Info */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">Kick Categories</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li><span className="font-semibold text-green-600">Excellent:</span> 10+ kicks in 30 min</li>
              <li><span className="font-semibold text-blue-600">Good:</span> 10+ kicks in 2 hours</li>
              <li><span className="font-semibold text-yellow-600">Monitor:</span> Some movement</li>
              <li><span className="font-semibold text-orange-600">Low:</span> Few kicks over time</li>
              <li><span className="font-semibold text-red-600">Concerning:</span> Very low movement</li>
            </ul>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">Loading...</div>
          ) : sessionHistory.length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Recent Sessions</h4>
              <div className="space-y-3">
                {sessionHistory.map((session, index) => (
                  <div key={session.id ?? index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-semibold text-gray-800">{session.kicks} kicks</div>
                      <div className="text-xs text-gray-500">{session.date}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${getCategoryColor(session.category)}`}>
                        {session.category}
                      </div>
                      <div className="text-xs text-gray-500">{formatTime(session.time)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">No sessions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KickCounter;