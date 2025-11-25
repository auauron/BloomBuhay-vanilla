import React, { useEffect, useState } from "react";
import { Calendar, Baby, Clock, CheckCircle, Circle, Sunrise, AlertCircle } from "lucide-react";
import { bbtoolsService, BBMetric, CreateBBMetricRequest } from "../../../services/BBToolsService";

const LOCAL_KEY = "delivery_timeline_v1";

const DeliveryTimeline: React.FC = () => {
  const [dueDate, setDueDate] = useState<string>("");
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [savedTimelines, setSavedTimelines] = useState<BBMetric[]>([]);
  const [loadingSaved, setLoadingSaved] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const computeCurrentWeek = (dueDateStr: string) => {
    const dueDateObj = new Date(dueDateStr);
    const today = new Date();
    const diffTime = Math.abs(dueDateObj.getTime() - today.getTime());
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return 40 - diffWeeks;
  };

  const calculateTimeline = async (save: boolean = true) => {
    if (!dueDate) return;
    setError(null);
    const cw = computeCurrentWeek(dueDate);
    setCurrentWeek(cw);

    if (save) await saveTimeline(dueDate, cw);
  };

  const saveTimeline = async (dueDateStr: string, week: number) => {
    setSaving(true);
    const payload: CreateBBMetricRequest = {
      title: "DeliveryTimeline",
      value: String(week),
      unit: "week",
      notes: JSON.stringify({ dueDate: dueDateStr, currentWeek: week, savedAt: new Date().toISOString() }),
    };

    try {
      const res = await bbtoolsService.createMetric(payload);
      if (res.success && res.data) {
        setSavedTimelines((prev) => [res.data as BBMetric, ...prev]);
      } else {
        saveLocal(dueDateStr, week);
      }
    } catch {
      saveLocal(dueDateStr, week);
    } finally {
      setSaving(false);
    }
  };

  const saveLocal = (dueDateStr: string, week: number) => {
    const existing = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    const entry = {
      id: `local_${Date.now()}`,
      title: "DeliveryTimeline",
      value: String(week),
      unit: "week",
      notes: JSON.stringify({ dueDate: dueDateStr, currentWeek: week, savedAt: new Date().toISOString() }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [entry, ...existing];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    setSavedTimelines((prev) => [entry as unknown as BBMetric, ...prev]);
  };

  useEffect(() => {
    let mounted = true;
    const loadSaved = async () => {
      setLoadingSaved(true);
      try {
        const res = await bbtoolsService.getAll();
        let timelines: BBMetric[] = [];
        if (res.success && res.data?.metrics) {
          timelines = (res.data.metrics as BBMetric[]).filter((m) => m.title === "DeliveryTimeline");
          timelines.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        } else {
          const localData = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
          timelines = localData;
        }

        if (mounted) {
          setSavedTimelines(timelines);
          if (!dueDate && timelines.length > 0) {
            try {
              const firstNotes = JSON.parse(timelines[0].notes || "{}");
              setDueDate(firstNotes.dueDate || "");
              setCurrentWeek(Number(firstNotes.currentWeek ?? timelines[0].value ?? 0));
            } catch {}
          }
        }
      } catch {
        const localData = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
        if (mounted) setSavedTimelines(localData);
      } finally {
        if (mounted) setLoadingSaved(false);
      }
    };

    loadSaved();
    return () => { mounted = false; };
  }, [dueDate]);

  const deleteTimeline = async (metric: BBMetric) => {
    setSavedTimelines((prev) => prev.filter((m) => m !== metric));
    if (typeof metric.id === "number") {
      await bbtoolsService.deleteMetric(String(metric.id));
    } else {
      const localData = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
      localStorage.setItem(LOCAL_KEY, JSON.stringify(localData.filter((m: any) => m.id !== metric.id)));
    }
  };

  const restoreTimeline = (metric: BBMetric) => {
    try {
      const notes = JSON.parse(metric.notes || "{}");
      setDueDate(notes.dueDate || "");
      setCurrentWeek(Number(notes.currentWeek ?? metric.value ?? 0));
    } catch {
      setCurrentWeek(Number(metric.value ?? 0));
    }
  };

  const getTrimester = (week: number) => (week < 14 ? 1 : week < 28 ? 2 : 3);

  const timelineEvents = [
    { week: 4, event: "Positive pregnancy test" },
    { week: 8, event: "First prenatal appointment" },
    { week: 12, event: "First trimester screening" },
    { week: 20, event: "Anatomy ultrasound scan" },
    { week: 24, event: "Glucose screening test" },
    { week: 28, event: "Third trimester begins" },
    { week: 32, event: "Bi-weekly appointments start" },
    { week: 36, event: "Weekly appointments begin" },
    { week: 37, event: "Baby is full term" },
    { week: 40, event: "Due date" },
  ].map(e => ({ ...e, completed: currentWeek >= e.week }));

  const babyDevelopment = [
    { week: 12, development: "All organs formed, can make fists" },
    { week: 20, development: "Can hear sounds, developing taste buds" },
    { week: 24, development: "Viable if born, practicing breathing" },
    { week: 28, development: "Eyes open, recognizes your voice" },
    { week: 32, development: "Rapid weight gain, storing fat" },
    { week: 36, development: "Positioning for birth, lungs mature" },
    { week: 40, development: "Ready for birth!" },
  ];

  const currentDevelopment = babyDevelopment.filter(d => d.week <= currentWeek).slice(-1)[0];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Sunrise className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Pregnancy Timeline</h3>
      </div>

      <div className="bg-white rounded-2xl border border-pink-200 p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Your Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
            />
          </div>
          <div className="flex items-end gap-3">
            <button
              onClick={() => calculateTimeline(true)}
              className="w-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {saving ? "Saving..." : "Generate Timeline"}
            </button>
            <button
              onClick={() => { setDueDate(""); setCurrentWeek(0); }}
              className="px-4 py-3 rounded-2xl border border-gray-200"
            >
              Clear
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
                <Baby className="w-5 h-5" /> Current Progress
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

            {currentDevelopment && (
              <div className="bg-green-50 rounded-2xl border border-green-200 p-6">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Baby className="w-5 h-5" /> Baby's Development
                </h4>
                <p className="text-sm text-green-700">{currentDevelopment.development}</p>
              </div>
            )}
          </div>

          {/* Timeline + Saved Timelines */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-800 mb-6">Pregnancy Timeline</h4>
              <div className="space-y-4">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      event.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {event.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </div>
                    <div className={`flex-1 pb-4 ${idx < timelineEvents.length - 1 ? 'border-l-2 border-gray-200' : ''} pl-4`}>
                      <div className={`font-semibold ${event.completed ? 'text-green-700' : 'text-gray-500'}`}>Week {event.week}</div>
                      <div className={`text-sm ${event.completed ? 'text-green-600' : 'text-gray-400'}`}>{event.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Saved Timelines</h4>
                {loadingSaved ? <div className="text-sm text-gray-500">Loading...</div> : <div className="text-sm text-gray-500">{savedTimelines.length} saved</div>}
              </div>

              {savedTimelines.length === 0 ? (
                <p className="text-sm text-gray-500">No saved timelines yet.</p>
              ) : (
                <ul className="space-y-3">
                  {savedTimelines.map((m) => {
                    let notes: any = {};
                    try { notes = m.notes ? JSON.parse(m.notes) : {}; } catch {}
                    return (
                      <li key={m.id ?? `${m.value}-${m.createdAt}`} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="text-sm font-semibold">{notes.dueDate ? new Date(notes.dueDate).toLocaleDateString() : `Week ${notes.currentWeek ?? m.value}`}</div>
                          <div className="text-xs text-gray-500">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => restoreTimeline(m)} className="px-3 py-1 text-sm rounded-xl border hover:bg-gray-50">Restore</button>
                          <button onClick={() => deleteTimeline(m)} className="px-3 py-1 text-sm rounded-xl border border-red-200 text-red-600 hover:bg-red-50">Delete</button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
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