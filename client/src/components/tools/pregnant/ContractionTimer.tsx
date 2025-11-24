import React, { useState, useEffect, useRef } from "react";
import { Play, Square, RotateCcw, Clock, Timer, AlertCircle } from "lucide-react";
import { bbtoolsService, BBMetric } from "../../../services/BBToolsService";

interface Contraction {
  startTime: Date;
  endTime?: Date;
  duration?: number;
  frequency?: number; 
  metricId?: number;
  tempId?: string; 
}

const LOCAL_KEY = "contractions_v1";

const ContractionTimer: React.FC = () => {
  const [isTiming, setIsTiming] = useState(false);
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [currentStart, setCurrentStart] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // interval ref (browser-friendly type)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load from backend (preferred) or localStorage
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await bbtoolsService.getAll();
        if (!mounted) return;

        if (res.success && res.data?.metrics) {
          // find metrics with title === 'Contraction'
          const metrics: BBMetric[] = res.data.metrics.filter((m: BBMetric) => m.title === "Contraction");
          if (metrics.length > 0) {
            const parsed: Contraction[] = metrics.map((m) => {
              let notes: any = {};
              try { notes = m.notes ? JSON.parse(m.notes) : {}; } catch { notes = {}; }
              return {
                startTime: notes.startTime ? new Date(notes.startTime) : (m.createdAt ? new Date(m.createdAt) : new Date()),
                endTime: notes.endTime ? new Date(notes.endTime) : undefined,
                duration: Number(m.value) || notes.duration || undefined,
                frequency: notes.frequency,
                metricId: m.id,
              };
            });
            // sort desc, newest first
            parsed.sort((a, b) => (b.startTime.getTime() - a.startTime.getTime()));
            setContractions(parsed);
            return;
          }
        }
      } catch (err) {
        // ignore - fallback to localStorage
        console.warn("Failed to load contractions from server, falling back to localStorage", err);
      }

      // fallback to localStorage
      try {
        const saved = localStorage.getItem(LOCAL_KEY);
        if (saved) {
          const parsed = JSON.parse(saved).map((c: any) => ({
            ...c,
            startTime: new Date(c.startTime),
            endTime: c.endTime ? new Date(c.endTime) : undefined,
          }));
          if (mounted) setContractions(parsed);
        }
      } catch (e) {
        console.warn("Failed to parse local contractions", e);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Persist to localStorage whenever contractions change (always keep a local copy)
  useEffect(() => {
    try {
      // strip Date -> ISO for storage
      const toStore = contractions.map((c) => ({
        ...c,
        startTime: c.startTime.toISOString(),
        endTime: c.endTime ? c.endTime.toISOString() : undefined,
      }));
      localStorage.setItem(LOCAL_KEY, JSON.stringify(toStore));
    } catch (e) {
      console.warn("Failed to save contractions to localStorage", e);
    }
  }, [contractions]);

  // interval to update elapsedTime when timing
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
    setIsTiming(true);
    setCurrentStart(startTime);
    setElapsedTime(0);
  };

  const endContraction = async () => {
    if (!currentStart) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - currentStart.getTime()) / 1000);

    const newContraction: Contraction = {
      startTime: currentStart,
      endTime,
      duration,
      tempId: currentStart.toISOString(), // used to match after server save
    };

    // compute frequency against most recent saved contraction (if any)
    if (contractions.length > 0) {
      const last = contractions[0];
      const freq = Math.floor((currentStart.getTime() - last.startTime.getTime()) / 60000);
      newContraction.frequency = freq;
    }

    // optimistic update to UI + localStorage
    setContractions((prev) => [newContraction, ...prev]);
    setIsTiming(false);
    setCurrentStart(null);
    setElapsedTime(0);

    // try to save to backend (non-blocking). If it succeeds, update the saved item with metricId.
    (async () => {
      try {
        const payload = {
          title: "Contraction",
          value: String(duration),
          unit: "sec",
          notes: JSON.stringify({
            startTime: newContraction.startTime.toISOString(),
            endTime: newContraction.endTime?.toISOString(),
            duration: newContraction.duration,
            frequency: newContraction.frequency,
            tempId: newContraction.tempId,
          }),
        };
        const res = await bbtoolsService.createMetric(payload);
        if (res.success && res.data) {
          const created: BBMetric = res.data;
          // match by tempId in notes (or startTime/duration)
          const createdNotes = (() => {
            try { return created.notes ? JSON.parse(created.notes) : {}; } catch { return {}; }
          })();
          const matchTempId = createdNotes?.tempId;
          setContractions((prev) =>
            prev.map((c) => {
              if (c.tempId && matchTempId && c.tempId === matchTempId) {
                return { ...c, metricId: created.id, tempId: undefined };
              }
              // fallback: match by startTime ISO and duration
              if (
                !c.metricId &&
                c.startTime.toISOString() === (createdNotes.startTime || "") &&
                String(c.duration) === String(created.value || createdNotes.duration)
              ) {
                return { ...c, metricId: created.id, tempId: undefined };
              }
              return c;
            })
          );
        } else {
          // not authenticated or server error: ignore (we already persisted locally)
          console.warn("Create contraction metric failed:", res.error ?? res.message);
        }
      } catch (err) {
        console.warn("Failed to save contraction to server:", err);
      }
    })();
  };

  const deleteContraction = async (c: Contraction) => {
    // Optimistic remove
    setContractions((prev) => prev.filter((x) => x !== c));

    // If metricId exists, try delete on server
    if (c.metricId) {
      try {
        const res = await bbtoolsService.deleteMetric(String(c.metricId));
        if (!res.success) console.warn("Failed to delete contraction metric on server:", res.error ?? res.message);
      } catch (err) {
        console.warn("Failed to delete contraction metric:", err);
      }
    }
  };

  const resetTimer = () => {
    setIsTiming(false);
    setCurrentStart(null);
    setElapsedTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getLaborStatus = () => {
    if (contractions.length < 3) return "early";

    const recentContractions = contractions.slice(0, 3);
    const avgFrequency =
      recentContractions.reduce((sum, c) => sum + (c.frequency || 0), 0) / recentContractions.length;
    const avgDuration =
      recentContractions.reduce((sum, c) => sum + (c.duration || 0), 0) / recentContractions.length;

    if (avgFrequency <= 5 && avgDuration >= 45) return "active";
    if (avgFrequency <= 3 && avgDuration >= 60) return "transition";
    return "early";
  };

  const laborStatus = getLaborStatus();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Timer className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Contraction Timer</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
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
                {laborStatus === "early" ? "Early Labor" : laborStatus === "active" ? "Active Labor" : "Transition Phase"}
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

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" /> Contraction History
            </h4>

            {contractions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No contractions recorded yet</p>
            ) : (
              <div className="space-y-3">
                {contractions.slice(0, 10).map((c, index) => (
                  <div key={c.tempId ?? c.metricId ?? index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-semibold text-gray-800">{formatTime(c.duration || 0)}</div>
                      <div className="text-sm text-gray-500">{c.startTime.toLocaleString()}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      {c.frequency !== undefined && (
                        <div className="text-right">
                          <div className="font-semibold text-bloomPink">{c.frequency} min</div>
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