import React, { useState } from "react";
import { Calendar, Baby, Clock, CheckCircle, Circle, Sunrise, AlertCircle } from "lucide-react";

const DeliveryTimeline: React.FC = () => {
  const [dueDate, setDueDate] = useState("");
  const [currentWeek, setCurrentWeek] = useState(0);

  const calculateTimeline = () => {
    if (!dueDate) return;

    const dueDateObj = new Date(dueDate);
    const today = new Date();
    const diffTime = Math.abs(dueDateObj.getTime() - today.getTime());
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    setCurrentWeek(40 - diffWeeks);
  };

  const getTrimester = (week: number) => {
    if (week < 14) return 1;
    if (week < 28) return 2;
    return 3;
  };

  const timelineEvents = [
    { week: 4, event: "Positive pregnancy test", completed: true },
    { week: 8, event: "First prenatal appointment", completed: true },
    { week: 12, event: "First trimester screening", completed: true },
    { week: 20, event: "Anatomy ultrasound scan", completed: currentWeek >= 20 },
    { week: 24, event: "Glucose screening test", completed: currentWeek >= 24 },
    { week: 28, event: "Third trimester begins", completed: currentWeek >= 28 },
    { week: 32, event: "Bi-weekly appointments start", completed: currentWeek >= 32 },
    { week: 36, event: "Weekly appointments begin", completed: currentWeek >= 36 },
    { week: 37, event: "Baby is full term", completed: currentWeek >= 37 },
    { week: 40, event: "Due date", completed: currentWeek >= 40 },
  ];

  const babyDevelopment = [
    { week: 12, development: "All organs formed, can make fists" },
    { week: 20, development: "Can hear sounds, developing taste buds" },
    { week: 24, development: "Viable if born, practicing breathing" },
    { week: 28, development: "Eyes open, recognizes your voice" },
    { week: 32, development: "Rapid weight gain, storing fat" },
    { week: 36, development: "Positioning for birth, lungs mature" },
    { week: 40, development: "Ready for birth!" },
  ];

  const currentDevelopment = babyDevelopment
    .filter(dev => dev.week <= currentWeek)
    .slice(-1)[0];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Sunrise className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Pregnancy Timeline</h3>
      </div>

      {/* Due Date Input */}
      <div className="bg-white rounded-2xl border border-pink-200 p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Your Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={calculateTimeline}
              className="w-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Generate Timeline
            </button>
          </div>
        </div>
      </div>

      {currentWeek > 0 && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Overview */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-blue-200 p-6">
              <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <Baby className="w-5 h-5" />
                Current Progress
              </h4>
              
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-bloomPink mb-1">{currentWeek}</div>
                <div className="text-lg text-gray-600">Weeks Pregnant</div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-blue-700">Trimester</span>
                  <span className="font-semibold text-blue-800">#{getTrimester(currentWeek)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Weeks to go</span>
                  <span className="font-semibold text-blue-800">{40 - currentWeek}</span>
                </div>
              </div>
            </div>

            {/* Current Development */}
            {currentDevelopment && (
              <div className="bg-green-50 rounded-2xl border border-green-200 p-6">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Baby className="w-5 h-5" />
                  Baby's Development
                </h4>
                <p className="text-sm text-green-700">{currentDevelopment.development}</p>
              </div>
            )}

            {/* Next Appointment */}
            <div className="bg-purple-50 rounded-2xl border border-purple-200 p-6">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Next Milestone
              </h4>
              {timelineEvents
                .filter(event => !event.completed)
                .slice(0, 1)
                .map((event, index) => (
                  <div key={index}>
                    <div className="font-semibold text-purple-700">Week {event.week}</div>
                    <div className="text-sm text-purple-600">{event.event}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-800 mb-6">Pregnancy Timeline</h4>
              
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      event.completed 
                        ? 'bg-green-100 text-green-600' 
                        : currentWeek >= event.week
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {event.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : currentWeek >= event.week ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className={`flex-1 pb-4 ${
                      index < timelineEvents.length - 1 ? 'border-l-2 border-gray-200' : ''
                    } pl-4`}>
                      <div className={`font-semibold ${
                        event.completed ? 'text-green-700' : 
                        currentWeek >= event.week ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        Week {event.week}
                      </div>
                      <div className={`text-sm ${
                        event.completed ? 'text-green-600' : 
                        currentWeek >= event.week ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {event.event}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!currentWeek && dueDate && (
        <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-8 text-center">
          <Calendar className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h4 className="font-semibold text-yellow-800 mb-2">Calculate Your Timeline</h4>
          <p className="text-yellow-700">Click "Generate Timeline" to see your pregnancy progress</p>
        </div>
      )}

      {!dueDate && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
          <Baby className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-700 mb-2">Start Your Timeline</h4>
          <p className="text-gray-500">Enter your due date to generate your personalized pregnancy timeline</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryTimeline;