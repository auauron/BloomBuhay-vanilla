import React, { useState, useEffect } from "react";
import { Play, Square, RotateCcw, Clock, Timer, AlertCircle } from "lucide-react";

interface Contraction {
  startTime: Date;
  endTime?: Date;
  duration?: number;
  frequency?: number;
}

const ContractionTimer: React.FC = () => {
  const [isTiming, setIsTiming] = useState(false);
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [currentStart, setCurrentStart] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval:  ReturnType<typeof setInterval> | undefined;
    if (isTiming) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTiming]);

  const startContraction = () => {
    const startTime = new Date();
    setIsTiming(true);
    setCurrentStart(startTime);
    setElapsedTime(0);
  };

  const endContraction = () => {
    if (currentStart) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - currentStart.getTime()) / 1000);
      
      const newContraction: Contraction = {
        startTime: currentStart,
        endTime,
        duration
      };

      // Calculate frequency if there are previous contractions
      if (contractions.length > 0) {
        const lastContraction = contractions[0];
        const frequency = Math.floor((currentStart.getTime() - lastContraction.startTime.getTime()) / 60000);
        newContraction.frequency = frequency;
      }

      setContractions(prev => [newContraction, ...prev]);
      setIsTiming(false);
      setCurrentStart(null);
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getLaborStatus = () => {
    if (contractions.length < 3) return "early";
    
    const recentContractions = contractions.slice(0, 3);
    const avgFrequency = recentContractions.reduce((sum, c) => sum + (c.frequency || 0), 0) / recentContractions.length;
    const avgDuration = recentContractions.reduce((sum, c) => sum + (c.duration || 0), 0) / recentContractions.length;

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
        {/* Timer Section */}
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
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 text-lg"
                >
                  <Play className="w-5 h-5" />
                  Start Contraction
                </button>
              ) : (
                <>
                  <button
                    onClick={endContraction}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 text-lg"
                  >
                    <Square className="w-5 h-5" />
                    End Contraction
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

          {/* Labor Status */}
          <div className={`rounded-2xl p-6 border ${
            laborStatus === "early" ? "bg-blue-50 border-blue-200" :
            laborStatus === "active" ? "bg-yellow-50 border-yellow-200" :
            "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className={`w-6 h-6 ${
                laborStatus === "early" ? "text-blue-600" :
                laborStatus === "active" ? "text-yellow-600" :
                "text-red-600"
              }`} />
              <h4 className="font-semibold text-lg">
                {laborStatus === "early" ? "Early Labor" :
                 laborStatus === "active" ? "Active Labor" :
                 "Transition Phase"}
              </h4>
            </div>
            <p className="text-sm">
              {laborStatus === "early" ? "Contractions are irregular, 5-30 minutes apart" :
               laborStatus === "active" ? "Contractions are 3-5 minutes apart, lasting 45-60 seconds" :
               "Contractions are 2-3 minutes apart, lasting 60-90 seconds"}
            </p>
          </div>
        </div>

        {/* History Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Contraction History
            </h4>
            
            {contractions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No contractions recorded yet</p>
            ) : (
              <div className="space-y-3">
                {contractions.slice(0, 5).map((contraction, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-semibold text-gray-800">
                        {formatTime(contraction.duration || 0)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {contraction.startTime.toLocaleTimeString()}
                      </div>
                    </div>
                    {contraction.frequency && (
                      <div className="text-right">
                        <div className="font-semibold text-bloomPink">
                          {contraction.frequency} min
                        </div>
                        <div className="text-sm text-gray-500">since last</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">When to Go to Hospital</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Contractions 5-1-1 pattern: 5 min apart, 1 min long, for 1 hour</li>
              <li>• Water breaks or leaking fluid</li>
              <li>• Decreased fetal movement</li>
              <li>• Bleeding heavier than period</li>
              <li>• Severe abdominal pain</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractionTimer;