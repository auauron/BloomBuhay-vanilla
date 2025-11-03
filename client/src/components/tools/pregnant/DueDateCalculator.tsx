import React, { useState } from "react";
import { Calendar, Calculator, Baby, Clock } from "lucide-react";

const DueDateCalculator: React.FC = () => {
  const [lastPeriod, setLastPeriod] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [weeksPregnant, setWeeksPregnant] = useState(0);

  const calculateDueDate = () => {
    if (!lastPeriod) return;

    const lastPeriodDate = new Date(lastPeriod);
    const dueDate = new Date(lastPeriodDate);
    dueDate.setDate(dueDate.getDate() + 280); // 40 weeks from last period

    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastPeriodDate.getTime());
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

    setDueDate(dueDate.toLocaleDateString());
    setWeeksPregnant(diffWeeks);
  };

  const getTrimester = (weeks: number) => {
    if (weeks < 14) return "First Trimester";
    if (weeks < 28) return "Second Trimester";
    return "Third Trimester";
  };

  const getMilestones = (weeks: number) => {
    const milestones = [];
    if (weeks < 8) milestones.push("Heartbeat begins");
    if (weeks >= 12) milestones.push("First trimester screening");
    if (weeks >= 20) milestones.push("Anatomy scan");
    if (weeks >= 28) milestones.push("Third trimester begins");
    if (weeks >= 36) milestones.push("Full term reached");
    return milestones;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Due Date Calculator</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Calculate Your Due Date</h4>
            </div>
            <p className="text-sm text-blue-700 mb-4">
              Enter the first day of your last menstrual period to calculate your estimated due date.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Day of Last Menstrual Period
                </label>
                <input
                  type="date"
                  value={lastPeriod}
                  onChange={(e) => setLastPeriod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
                />
              </div>

              <button
                onClick={calculateDueDate}
                className="w-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calculate Due Date
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {dueDate && (
            <>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <h4 className="font-semibold text-green-800 text-lg">Estimated Due Date</h4>
                </div>
                <p className="text-3xl font-bold text-green-600 mb-2">{dueDate}</p>
                <p className="text-sm text-green-700">Based on 40-week pregnancy calculation</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <Baby className="w-6 h-6 text-blue-600" />
                  <h4 className="font-semibold text-blue-800 text-lg">Current Progress</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-1">{weeksPregnant} weeks pregnant</p>
                <p className="text-lg font-semibold text-blue-700 mb-2">
                  {getTrimester(weeksPregnant)}
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span>{40 - weeksPregnant} weeks to go</span>
                </div>
              </div>

              <div className="bg-pink-50 rounded-2xl p-6 border border-pink-200">
                <h4 className="font-semibold text-pink-800 text-lg mb-3">Pregnancy Milestones</h4>
                <ul className="space-y-2">
                  {getMilestones(weeksPregnant).map((milestone, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-pink-700">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      {milestone}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DueDateCalculator;