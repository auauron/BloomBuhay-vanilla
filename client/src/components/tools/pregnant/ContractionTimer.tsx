import React, { useState, useEffect, useRef } from "react";
import { Play, Square, RotateCcw, Clock, Timer, AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { bbtoolsService } from "../../../services/BBToolsService";

interface Contraction {
  id?: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  frequency?: number;
  tempId?: string;
}

interface LaborPhase {
  name: string;
  description: string;
  frequency: string;
  duration: string;
  color: string;
  icon: React.ReactNode;
  action: string;
  warning?: string;
}

const parseContraction = (c: any): Contraction => {
  const toDate = (d: any) => {
    if (!d) return undefined;
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  };

  const startTime = toDate(c.startTime) ?? new Date();
  const endTime = toDate(c.endTime);
  
  let duration = c.duration;
  if (typeof duration === 'string') {
    duration = parseInt(duration, 10);
  }
  if (isNaN(duration) || duration === undefined) {
    duration = undefined;
  }

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

  const laborPhases: LaborPhase[] = [
    {
      name: "Early Labor",
      description: "Your body is preparing for active labor",
      frequency: "5-30 minutes apart",
      duration: "30-45 seconds",
      color: "white",
      icon: <Info className="w-5 h-5 text-red-400" />,
      action: "Rest, hydrate, and time contractions"
    },
    {
      name: "Active Labor",
      description: "Labor is progressing steadily",
      frequency: "3-5 minutes apart",
      duration: "45-60 seconds",
      color: "from-yellow-500 to-orange-500",
      icon: <AlertCircle className="w-5 h-5" />,
      action: "Contact your healthcare provider",
      warning: "Time to head to hospital/birth center"
    },
    {
      name: "Transition Phase",
      description: "Final stage before pushing",
      frequency: "2-3 minutes apart",
      duration: "60-90 seconds",
      color: "from-red-500 to-pink-500",
      icon: <AlertTriangle className="w-5 h-5" />,
      action: "You're in active labor - get medical support",
      warning: "URGENT: Go to hospital immediately if not already there"
    },
    {
      name: "5-1-1 Rule Met",
      description: "Standard indicator for hospital admission",
      frequency: "5 minutes apart",
      duration: "1 minute long",
      color: "from-purple-500 to-indigo-500",
      icon: <AlertTriangle className="w-5 h-5" />,
      action: "Go to hospital/birth center now",
      warning: "HOSPITAL TIME: Contractions are 5-1-1 pattern"
    }
  ];

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

    const optimistic: Contraction = {
      tempId,
      startTime: new Date(currentStart),
      endTime: new Date(endTime),
      duration: duration,
      frequency,
    };

    setContractions((prev) => [optimistic, ...prev]);
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

  const getLaborStatus = () => {
    if (contractions.length < 3) return laborPhases[0];

    const last3 = contractions.slice(0, 3);
    const avgFreq = last3.reduce((s, c) => s + (c.frequency || 0), 0) / 3;
    const avgDur = last3.reduce((s, c) => s + (c.duration || 0), 0) / 3;

    // Check for 5-1-1 rule first (most important)
    if (avgFreq <= 5 && avgDur >= 60) {
      return laborPhases[3]; // 5-1-1 Rule Met
    }
    
    if (avgFreq <= 3 && avgDur >= 60) {
      return laborPhases[2]; // Transition
    }
    
    if (avgFreq <= 5 && avgDur >= 45) {
      return laborPhases[1]; // Active Labor
    }
    
    return laborPhases[0]; // Early Labor
  };

  const laborStatus = getLaborStatus();
  const isWarningPhase = laborStatus.warning !== undefined;

  // Check if current contraction is getting long (over 90 seconds)
  const isLongContraction = elapsedTime > 90;
  const isVeryLongContraction = elapsedTime > 120;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Timer className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Contraction Timer</h3>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Timer & Current Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timer Card */}
          <div className={`bg-white rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
            isLongContraction ? 'border-orange-300 bg-orange-50' : 
            isVeryLongContraction ? 'border-red-300 bg-red-50' : 'border-pink-200'
          }`}>
            <div className={`text-5xl font-bold mb-4 font-mono transition-colors ${
              isLongContraction ? 'text-orange-600' : 
              isVeryLongContraction ? 'text-red-600' : 'text-bloomPink'
            }`}>
              {formatTime(elapsedTime)}
            </div>
            
            <p className="text-gray-600 mb-2">Current Contraction Duration</p>
            
            {/* Long contraction warnings */}
            {isLongContraction && (
              <div className="mb-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  isVeryLongContraction 
                    ? 'bg-red-100 text-red-700 border border-red-300' 
                    : 'bg-orange-100 text-orange-700 border border-orange-300'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                  {isVeryLongContraction 
                    ? 'Long contraction - contact provider if pattern continues' 
                    : 'Contraction getting long - monitor pattern'}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              {!isTiming ? (
                <button
                  onClick={startContraction}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 text-lg hover:scale-105 transition-transform"
                >
                  <Play className="w-5 h-5" /> Start Contraction
                </button>
              ) : (
                <>
                  <button
                    onClick={endContraction}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 text-lg hover:scale-105 transition-transform"
                  >
                    <Square className="w-5 h-5" /> End Contraction
                  </button>

                  <button
                    onClick={resetTimer}
                    className="bg-gray-500 text-white px-6 py-4 rounded-2xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Labor Status with Warning */}
          <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
            isWarningPhase 
              ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow-lg animate-pulse' 
              : `bg-gradient-to-r ${laborStatus.color.replace('from-', 'from-').replace('to-', 'to-')}/10 border-${laborStatus.color.split('-')[1]}-200`
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${laborStatus.color} text-white`}>
                {laborStatus.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-xl text-gray-800">{laborStatus.name}</h4>
                  {isWarningPhase && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      ALERT
                    </div>
                  )}
                </div>
                
                <p className="text-gray-700 mb-3">{laborStatus.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Frequency</div>
                    <div className="font-semibold text-gray-800">{laborStatus.frequency}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-semibold text-gray-800">{laborStatus.duration}</div>
                  </div>
                </div>

                <div className={`p-3 rounded-xl ${
                  isWarningPhase 
                    ? 'bg-red-100 border border-red-300 text-red-800' 
                    : 'bg-blue-100 border border-blue-300 text-blue-800'
                }`}>
                  <div className="font-semibold mb-1">
                    {isWarningPhase ? '🚨 Action Required:' : '💡 Recommended Action:'}
                  </div>
                  <div>{laborStatus.action}</div>
                  {laborStatus.warning && (
                    <div className="font-bold mt-2 text-red-700">{laborStatus.warning}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" /> Labor Phase Guide
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {laborPhases.map((phase, index) => (
                <div key={phase.name} className={`p-4 rounded-xl border-2 ${
                  laborStatus.name === phase.name 
                    ? 'border-bloomPink bg-pink-50' 
                    : 'border-gray-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${phase.color} text-white`}>
                      {phase.icon}
                    </div>
                    <h5 className="font-semibold text-gray-800">{phase.name}</h5>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>⏱️ {phase.frequency}</div>
                    <div>⏳ {phase.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* History & Emergency Info */}
        <div className="space-y-6">
          {/* History */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" /> Recent Contractions
            </h4>

            {contractions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No contractions recorded yet.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {contractions.slice(0, 8).map((c, idx) => (
                  <div
                    key={c.id ?? c.tempId ?? idx}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
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
                      {c.frequency !== undefined && c.frequency > 0 && (
                        <div className="text-right">
                          <div className="font-semibold text-bloomPink">{c.frequency} min</div>
                          <div className="text-sm text-gray-500">apart</div>
                        </div>
                      )}

                      <button
                        onClick={() => deleteContraction(c)}
                        className="px-3 py-1 text-sm rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emergency Info */}
          <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
            <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Go to Hospital Immediately If:
            </h4>
            <ul className="text-sm text-red-700 space-y-2">
              <li className="flex items-start gap-2">
                <div className="bg-red-500 text-white rounded-full p-1 mt-0.5">!</div>
                <span><strong>5-1-1 Rule:</strong> Contractions 5 min apart, 1 min long, for 1 hour</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-red-500 text-white rounded-full p-1 mt-0.5">!</div>
                <span><strong>Water breaks</strong> (clear fluid gushing or leaking)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-red-500 text-white rounded-full p-1 mt-0.5">!</div>
                <span><strong>Heavy bleeding</strong> (more than menstrual period)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-red-500 text-white rounded-full p-1 mt-0.5">!</div>
                <span><strong>Decreased fetal movement</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-red-500 text-white rounded-full p-1 mt-0.5">!</div>
                <span><strong>Severe constant abdominal pain</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-red-500 text-white rounded-full p-1 mt-0.5">!</div>
                <span><strong>Fever over 100.4°F (38°C)</strong></span>
              </li>
            </ul>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default ContractionTimer;