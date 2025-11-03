import React, { useState, useEffect } from "react";
import { Play, Square, RotateCcw, Footprints, Clock, AlertTriangle } from "lucide-react";

const KickCounter: React.FC = () => {
  const [isCounting, setIsCounting] = useState(false);
  const [kickCount, setKickCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<Array<{date: string, kicks: number, time: number}>>([]);

  useEffect(() => {
    let interval:  ReturnType<typeof setInterval> | undefined;
    if (isCounting) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCounting]);

  const startCounting = () => {
    setIsCounting(true);
    setStartTime(new Date());
    setKickCount(0);
    setElapsedTime(0);
  };

  const stopCounting = () => {
    setIsCounting(false);
    if (startTime && kickCount > 0) {
      const session = {
        date: new Date().toLocaleDateString(),
        kicks: kickCount,
        time: elapsedTime
      };
      setSessionHistory(prev => [session, ...prev.slice(0, 4)]);
    }
  };

  const resetCounter = () => {
    setIsCounting(false);
    setKickCount(0);
    setElapsedTime(0);
    setStartTime(null);
  };

  const addKick = () => {
    if (isCounting) {
      setKickCount(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                    <Footprints className="w-4 h-4" />
                    Add Kick
                  </button>
                  <button
                    onClick={stopCounting}
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
          </div>

          {/* Status Indicator */}
          {isCounting && status !== "normal" && (
            <div className={`rounded-2xl p-4 border ${
              status === "low" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"
            }`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${status === "low" ? "text-red-600" : "text-yellow-600"}`} />
                <span className={`font-semibold ${status === "low" ? "text-red-800" : "text-yellow-800"}`}>
                  {status === "low" ? "Low Kick Count" : "Monitor Closely"}
                </span>
              </div>
              <p className={`text-sm mt-1 ${status === "low" ? "text-red-700" : "text-yellow-700"}`}>
                {status === "low" 
                  ? "Contact your healthcare provider if you notice decreased movement"
                  : "Continue monitoring - aim for 10 kicks in 2 hours"
                }
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

          {sessionHistory.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Recent Sessions</h4>
              <div className="space-y-2">
                {sessionHistory.map((session, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{session.date}</span>
                    <span className="font-semibold text-bloomPink">{session.kicks} kicks</span>
                    <span className="text-gray-500">{formatTime(session.time)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KickCounter;