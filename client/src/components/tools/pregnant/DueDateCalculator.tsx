// src/components/DueDateCalculator.tsx
import React, { useState, useEffect } from "react";
import { Calendar, Calculator, Baby, Clock } from "lucide-react";
import { authService } from "../../../services/authService";
import { bbtoolsService, DueDateLog } from "../../../services/BBToolsService";

const STORAGE_KEY = "dueDateCalculatorData";

const DueDateCalculator: React.FC = () => {
  const [lastPeriod, setLastPeriod] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [weeksPregnant, setWeeksPregnant] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------- Load from backend or fallback ----------------
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const token = authService.getToken();
      if (!token) {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          setLastPeriod(data.lastPeriod || "");
          setDueDate(data.dueDate || "");
          setWeeksPregnant(data.weeksPregnant || 0);
        }
        setLoading(false);
        return;
      }

      try {
        const res = await bbtoolsService.getDueDate();
        if (res.success && res.data) {
          const log: DueDateLog = res.data;
          setLastPeriod(log.lmpDate.slice(0, 10));
          setWeeksPregnant(log.weeksPregnant);
          const due = new Date(log.lmpDate);
          due.setDate(due.getDate() + 280);
          setDueDate(due.toLocaleDateString());
        } else {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const data = JSON.parse(saved);
            setLastPeriod(data.lastPeriod || "");
            setDueDate(data.dueDate || "");
            setWeeksPregnant(data.weeksPregnant || 0);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch due date data:", err);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          setLastPeriod(data.lastPeriod || "");
          setDueDate(data.dueDate || "");
          setWeeksPregnant(data.weeksPregnant || 0);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ---------------- Local storage helper ----------------
  const saveLocally = (lp: string, dd: string, weeks: number) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lastPeriod: lp, dueDate: dd, weeksPregnant: weeks }));
  };

  // ---------------- Save to backend ----------------
  const saveToDb = async (lmpIso: string, weeks: number) => {
    const token = authService.getToken();
    if (!token) {
      saveLocally(lmpIso.slice(0, 10), new Date(lmpIso).toLocaleDateString(), weeks);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await bbtoolsService.saveDueDate({
        lmpDate: lmpIso,
        weeksPregnant: weeks,
      });

      saveLocally(lmpIso.slice(0, 10), new Date(lmpIso).toLocaleDateString(), weeks);
    } catch (err: any) {
      console.error("Failed to save due date:", err);
      setError("Failed to save to server. Data saved locally.");
      saveLocally(lmpIso.slice(0, 10), new Date(lmpIso).toLocaleDateString(), weeks);
    } finally {
      setSaving(false);
    }
  };

  // ---------------- Calculate due date ----------------
  const calculateDueDate = async () => {
    if (!lastPeriod) return;
    setError(null);

    const [y, m, d] = lastPeriod.split("-").map(Number);
    const lastPeriodDate = new Date(y, m - 1, d);

    const due = new Date(lastPeriodDate);
    due.setDate(due.getDate() + 280);

    const today = new Date();
    const diffWeeks = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24 * 7));

    setDueDate(due.toLocaleDateString());
    setWeeksPregnant(diffWeeks);

    const lmpIso = new Date(lastPeriodDate.getTime() - lastPeriodDate.getTimezoneOffset() * 60000).toISOString();
    await saveToDb(lmpIso, diffWeeks);
  };

  const getTrimester = (weeks: number) =>
    weeks < 14 ? "First Trimester" : weeks < 28 ? "Second Trimester" : "Third Trimester";

  const getMilestones = (weeks: number) => {
    const milestones: string[] = [];
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
        {/* Input */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Calculate Your Due Date</h4>
            </div>
            <p className="text-sm text-blue-700 mb-4">Enter the first day of your last menstrual period.</p>
            <input
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-bloomPink focus:border-transparent mb-4"
            />
            <button
              onClick={calculateDueDate}
              disabled={loading || saving}
              className={`w-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 ${
                loading || saving ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <Calculator className="w-5 h-5" />
              {saving ? "Saving..." : "Calculate Due Date"}
            </button>
            {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
          </div>
        </div>

        {/* Results */}
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
                <p className="text-lg font-semibold text-blue-700 mb-2">{getTrimester(weeksPregnant)}</p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span>{40 - weeksPregnant} weeks to go</span>
                </div>
              </div>

              <div className="bg-pink-50 rounded-2xl p-6 border border-pink-200">
                <h4 className="font-semibold text-pink-800 text-lg mb-3">Pregnancy Milestones</h4>
                <ul className="space-y-2">
                  {getMilestones(weeksPregnant).map((milestone, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-pink-700">
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