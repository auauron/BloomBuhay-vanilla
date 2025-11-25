import React, { useState, useEffect, useRef } from "react";
import { Play, Square, RotateCcw, Clock, Timer, AlertCircle } from "lucide-react";
import { bbtoolsService } from "../../../services/BBToolsService";

interface Contraction {
  id?: number;
  startTime: Date;
  endTime?: Date;
  duration?: number; // seconds
  frequency?: number; // minutes since previous contraction
  tempId?: string;
  metricId?: number;
}

const parseContraction = (c: any): Contraction => {
  // Handle various date formats from backend
  const parseDate = (dateValue: any): Date => {
    if (!dateValue) return new Date();
    if (dateValue instanceof Date) return dateValue;
    
    // Try parsing as string/number
    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) return parsed;
    
    // Fallback to current time if parsing fails
    console.warn('Failed to parse date:', dateValue);
    return new Date();
  };

  return {
    ...c,
    startTime: parseDate(c.startTime),
    endTime: c.endTime ? parseDate(c.endTime) : undefined,
    tempId: c.id ? undefined : c.tempId ?? Math.random().toString(36).substring(2, 9),
  };
};

const formatDate = (date: Date | string | undefined) => {
  if (!date) return "Unknown time";
  
  try {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "Unknown time";
    
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (err) {
    console.error('Date formatting error:', err, date);
    return "Unknown time";
  }
};
// format seconds to MM:SS
const formatTime = (seconds: any) => {
  if (seconds === null || seconds === undefined) return "00:00";

  let s: number;
  try {
    s = typeof seconds === "number" ? seconds : Number(seconds);
    if (isNaN(s) || s < 0) return "00:00";
  } catch (err) {
    console.warn("Failed to parse seconds:", seconds, err);
    return "00:00";
  }

  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const ContractionTimer: React.FC = () => {
  const [isTiming, setIsTiming] = useState(false);
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [currentStart, setCurrentStart] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load contractions from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await bbtoolsService.getContractions();
        if (!mounted) return;
        if (res.success && res.data) {
          const parsed = res.data.map(parseContraction);
          parsed.sort((a: { startTime: { getTime: () => number; }; }, b: { startTime: { getTime: () => number; }; }) => b.startTime.getTime() - a.startTime.getTime());
          setContractions(parsed);
        }
      } catch (err) {
        console.warn("Failed to load contractions from backend", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Timer tick
  useEffect(() => {
    if (isTiming) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTiming]);

  const startContraction = () => {
    const startTime = new Date();
    setCurrentStart(startTime);
    setElapsedTime(0);
    setIsTiming(true);
  };

  const endContraction = async () => {
    if (!currentStart) return;

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - currentStart.getTime()) / 1000);

    const last = contractions[0];
    const frequency =
      last && last.endTime
        ? Math.round((currentStart.getTime() - last.endTime.getTime()) / 60000)
        : 0;

    const optimistic: Contraction = {
      startTime: currentStart,
      endTime,
      duration,
      frequency,
      tempId: currentStart.toISOString(),
    };

    setContractions((prev) => [optimistic, ...prev]);

    setIsTiming(false);
    setCurrentStart(null);
    setElapsedTime(0);

    try {
      const payload = {
        startTime: optimistic.startTime.toISOString(),
        endTime: optimistic.endTime!.toISOString(),
        duration: optimistic.duration!,
        frequency: optimistic.frequency ?? 0,
      };

      const res = await bbtoolsService.createContraction(payload);

      if (res.success && res.data) {
        const saved = parseContraction(res.data);
        setContractions((prev) =>
          prev.map((c) => (c.tempId === optimistic.tempId ? saved : c))
        );
      } else {
        console.warn("Create contraction failed:", res.error ?? res.message);
      }
    } catch (err) {
      console.warn("Failed to save contraction to backend", err);
    }
  };

  const deleteContraction = async (c: Contraction) => {
    setContractions((prev) => prev.filter((x) => x !== c));
    if (c.id) {
      try {
        await bbtoolsService.deleteContraction(c.id);
      } catch (err) {
        console.warn("Failed to delete contraction on backend", err);
      }
    }
  };

  const resetTimer = () => {
    setIsTiming(false);
    setCurrentStart(null);
    setElapsedTime(0);
  };

  const getLaborStatus = () => {
    if (contractions.length < 3) return "early";
    const recent = contractions.slice(0, 3);
    const avgFreq = recent.reduce((s, c) => s + (c.frequency || 0), 0) / recent.length;
    const avgDur = recent.reduce((s, c) => s + (c.duration || 0), 0) / recent.length;

    if (avgFreq <= 5 && avgDur >= 45) return "active";
    if (avgFreq <= 3 && avgDur >= 60) return "transition";
    return "early";
  };

  const laborStatus = getLaborStatus();

  // ---------------------------------------------------------------
  // EVERYTHING BELOW IS YOUR EXACT UI — UNTOUCHED
  // ---------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Timer className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Contraction Timer</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Timer & Labor Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-pink-200 p-6 text-center">
            <div className="text-5xl font-bold text-bloomPink mb-4 font-mono">
              {formatTime(elapsedTime)}
            </div>
            <p className="text-gray-600 mb-6">Current Contraction Duration</p>

            <div className="flex gap-3 justify-center">
              {!isTiming ? (
                <button
                  onClick={startContraction}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 text-lg hover:shadow-lg hover:scale-105"
                >
                  <Play className="w-5 h-5" /> Start Contraction
                </button>
              ) : (
                <>
                  <button
                    onClick={endContraction}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 text-lg hover:shadow-lg hover:scale-105"
                  >
                    <Square className="w-5 h-5" /> End Contraction
                  </button>

                  <button
                    onClick={resetTimer}
                    className="bg-gray-500 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div
            className={`rounded-2xl p-6 border ${
              laborStatus === "early"
                ? "bg-blue-50 border-blue-200"
                : laborStatus === "active"
                ? "bg-yellow-50 border-yellow-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle
                className={`w-6 h-6 ${
                  laborStatus === "early"
                    ? "text-blue-600"
                    : laborStatus === "active"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              />
              <h4 className="font-semibold text-lg">
                {laborStatus === "early"
                  ? "Early Labor"
                  : laborStatus === "active"
                  ? "Active Labor"
                  : "Transition Phase"}
              </h4>
            </div>
            <p className="text-sm">
              {laborStatus === "early"
                ? "Contractions are irregular, 5-30 minutes apart"
                : laborStatus === "active"
                ? "Contractions are 3-5 minutes apart, lasting 45-60 seconds"
                : "Contractions are 2-3 minutes apart, lasting 60-90 seconds"}
            </p>
          </div>
        </div>

        {/* History */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" /> Contraction History
            </h4>

            {contractions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No contractions recorded yet</p>
            ) : (
              <div className="space-y-3">
                {contractions.slice(0, 10).map((c, idx) => (
                  <div
                    key={c.id ?? c.tempId ?? idx}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <div className="font-semibold text-gray-800">
                        {formatTime(c.duration || 0)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(c.startTime)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {c.frequency !== undefined && (
                        <div className="text-right">
                          <div className="font-semibold text-bloomPink">
                            {c.frequency} min
                          </div>
                          <div className="text-sm text-gray-500">since last</div>
                        </div>
                      )}

                      <button
                        onClick={() => deleteContraction(c)}
                        className="px-3 py-1 text-sm rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">When to Go to Hospital</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Contractions 5-1-1 pattern: 5 min apart, 1 min long, 1 hour</li>
              <li>• Water breaks or leaking fluid</li>
              <li>• Decreased fetal movement</li>
              <li>• Bleeding heavier than a period</li>
              <li>• Severe abdominal pain</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractionTimer;