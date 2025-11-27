import React, { useState, useEffect, useRef } from "react";
import { Play, Square, RotateCcw, Clock, Timer, AlertCircle } from "lucide-react";
import { bbtoolsService } from "../../../services/BBToolsService";

interface Contraction {
  id?: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  frequency?: number;
  tempId?: string;
}

const parseContraction = (c: any): Contraction => {
  const toDate = (d: any) => {
    if (!d) return undefined;
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  };

  const startTime = toDate(c.startTime) ?? new Date();
  const endTime = toDate(c.endTime);
  
  // Parse duration, ensuring it's a number
  let duration = c.duration;
  if (typeof duration === 'string') {
    duration = parseInt(duration, 10);
  }
  if (isNaN(duration) || duration === undefined) {
    duration = undefined;
  }

  // Parse frequency, ensuring it's a number
  let frequency = c.frequency;
  if (typeof frequency === 'string') {
    frequency = parseInt(frequency, 10);
  }
  if (isNaN(frequency) || frequency === undefined) {
    frequency = undefined;
  }

  return {
    id: c.id,
    startTime,
    endTime,
    duration,
    frequency,
    tempId: c.tempId,
  };
};

const formatDate = (d: Date | undefined) => {
  if (!d) return "Unknown time";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTime = (sec: number | undefined) => {
  if (sec === undefined || sec < 0) return "00:00";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const ContractionTimer: React.FC = () => {
  const [isTiming, setIsTiming] = useState(false);
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [currentStart, setCurrentStart] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load from backend
  useEffect(() => {
    (async () => {
      const res = await bbtoolsService.getContractions();
      if (res.success && Array.isArray(res.data)) {
        const parsed = res.data.map(parseContraction);
        parsed.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
        setContractions(parsed);
      }
    })();
  }, []);

  // Timer tick
  useEffect(() => {
    if (isTiming) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((e) => e + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTiming]);

  const startContraction = () => {
    const now = new Date();
    setCurrentStart(now);
    setElapsedTime(0);
    setIsTiming(true);
  };

const endContraction = async () => {
  if (!currentStart) return;

  const endTime = new Date();
  const duration = Math.round((endTime.getTime() - currentStart.getTime()) / 1000);

  const prev = contractions[0];
  const frequency =
    prev?.endTime ? Math.round((currentStart.getTime() - prev.endTime.getTime()) / 60000) : 0;

  const tempId = crypto.randomUUID();

  // Create the contraction object with the correctly calculated duration
  const optimistic: Contraction = {
    tempId,
    startTime: new Date(currentStart),
    endTime: new Date(endTime),
    duration: duration,
    frequency,
  };

  // Add the contraction immediately to the list
  setContractions((prev) => [optimistic, ...prev]);

  // Stop timing and clear state
  setIsTiming(false);
  setCurrentStart(null);
  setElapsedTime(0);

  try {
    const payload = {
      startTime: optimistic.startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: duration,
      frequency,
    };

    const res = await bbtoolsService.createContraction(payload);
    if (res.success && res.data) {
      const saved = parseContraction(res.data);
      
      // Make sure the saved contraction has the duration
      if (saved.duration === undefined || saved.duration === 0) {
        saved.duration = duration;
      }

      setContractions((prev) =>
        prev.map((c) => (c.tempId === tempId ? saved : c))
      );
    }
  } catch (e) {
    console.warn("Failed to save contraction", e);
  }
};

  const deleteContraction = async (c: Contraction) => {
    setContractions((prev) => prev.filter((x) => x !== c));
    if (c.id) {
      try {
        await bbtoolsService.deleteContraction(c.id);
      } catch (e) {
        console.warn("Failed to delete contraction on backend", e);
      }
    }
  };

  const resetTimer = () => {
    setIsTiming(false);
    setCurrentStart(null);
    setElapsedTime(0);
  };

  const laborStatus = (() => {
    if (contractions.length < 3) return "early";
    const last3 = contractions.slice(0, 3);
    const avgFreq = last3.reduce((s, c) => s + (c.frequency || 0), 0) / 3;
    const avgDur = last3.reduce((s, c) => s + (c.duration || 0), 0) / 3;

    if (avgFreq <= 5 && avgDur >= 45) return "active";
    if (avgFreq <= 3 && avgDur >= 60) return "transition";
    return "early";
  })();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Timer className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Contraction Timer</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Timer */}
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
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 text-lg hover:scale-105"
                >
                  <Play className="w-5 h-5" /> Start Contraction
                </button>
              ) : (
                <>
                  <button
                    onClick={endContraction}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 text-lg hover:scale-105"
                  >
                    <Square className="w-5 h-5" /> End Contraction
                  </button>

                  <button
                    onClick={resetTimer}
                    className="bg-gray-500 text-white px-6 py-4 rounded-2xl font-semibold flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Labor status */}
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
                ? "Contractions are irregular, 5–30 minutes apart."
                : laborStatus === "active"
                ? "Contractions are 3–5 minutes apart, lasting 45–60 seconds."
                : "Contractions are 2–3 minutes apart, lasting 60–90 seconds."}
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
              <p className="text-gray-500 text-center py-8">
                No contractions recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {contractions.slice(0, 10).map((c, idx) => (
                  <div
                    key={c.id ?? c.tempId ?? idx}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <div className="font-semibold text-gray-800">
                        {formatTime(c.duration)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(c.startTime)}
                      </div>
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
            <h4 className="font-semibold text-blue-800 mb-3">
              When to Go to Hospital
            </h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• 5-1-1 rule: 5 min apart, 1 min long, for 1 hour</li>
              <li>• Water breaking</li>
              <li>• Decreased fetal movement</li>
              <li>• Heavy bleeding</li>
              <li>• Severe abdominal pain</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractionTimer;