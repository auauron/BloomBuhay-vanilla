import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Check, Moon, Sun, Activity, Bed, Utensils, Clock } from "lucide-react";
import { bbtoolsService, ScheduleEntry, CreateScheduleRequest } from "../../../services/BBToolsService";

const SleepActivitySchedule: React.FC = () => {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: "",
    endTime: "",
    type: "sleep" as "sleep" | "activity" | "feeding",
    description: "",
    notes: ""
  });

  // Load schedule entries from backend
  useEffect(() => {
    loadScheduleEntries();
  }, []);

  const loadScheduleEntries = async () => {
    setLoading(true);
    try {
      const response = await bbtoolsService.getScheduleEntries();
      if (response.success && response.data) {
        setEntries(response.data);
      } else {
        console.error("Failed to load schedule entries:", response.error);
      }
    } catch (error) {
      console.error("Error loading schedule entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sleep":
        return <Moon className="w-4 h-4" />;
      case "activity":
        return <Activity className="w-4 h-4" />;
      case "feeding":
        return <Utensils className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "sleep":
        return "bg-blue-100 text-blue-800";
      case "activity":
        return "bg-green-100 text-green-800";
      case "feeding":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);
    const diff = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleAddEntry = async () => {
    if (!formData.startTime || !formData.endTime || !formData.description) return;

    setLoading(true);
    try {


      const response = await bbtoolsService.addSchedule(formData as CreateScheduleRequest);



      if (response.success && response.data) {
        setEntries([response.data, ...entries].sort((a, b) => {
          if (a.date === b.date) {
            return a.startTime.localeCompare(b.startTime);
          }
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }));
        resetForm();
        setIsAdding(false);
      } else {
        console.error("Failed to add schedule entry - Full response:", response);
        alert(`Failed to save schedule entry: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error adding schedule entry:", error);
      alert("Network error saving schedule entry. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setFormData({
        date: entry.date,
        startTime: entry.startTime,
        endTime: entry.endTime,
        type: entry.type,
        description: entry.description,
        notes: entry.notes
      });
      setEditingId(id);
      setIsAdding(true);
    }
  };

  const handleUpdateEntry = async () => {
    if (!formData.startTime || !formData.endTime || !formData.description || !editingId) return;

    setLoading(true);
    try {
      const response = await bbtoolsService.updateSchedule(editingId, formData);
      if (response.success && response.data) {
        setEntries(entries.map(entry =>
          entry.id === editingId ? { ...entry, ...response.data } : entry
        ));
        resetForm();
        setEditingId(null);
        setIsAdding(false);
      } else {
        console.error("Failed to update schedule entry:", response.error);
        alert("Failed to update schedule entry. Please try again.");
      }
    } catch (error) {
      console.error("Error updating schedule entry:", error);
      alert("Error updating schedule entry. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this schedule entry?")) return;

    setLoading(true);
    try {
      const response = await bbtoolsService.deleteSchedule(id);
      if (response.success) {
        setEntries(entries.filter(entry => entry.id !== id));
      } else {
        console.error("Failed to delete schedule entry:", response.error);
        alert("Failed to delete schedule entry. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting schedule entry:", error);
      alert("Error deleting schedule entry. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      startTime: "",
      endTime: "",
      type: "sleep",
      description: "",
      notes: ""
    });
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const getStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = entries.filter(entry => entry.date === today);

    const totalSleep = todayEntries
      .filter(entry => entry.type === "sleep")
      .reduce((total, entry) => {
        const start = new Date(`2000-01-01T${entry.startTime}`);
        const end = new Date(`2000-01-01T${entry.endTime}`);
        return total + (end.getTime() - start.getTime());
      }, 0);

    const sleepHours = Math.floor(totalSleep / (1000 * 60 * 60));
    const sleepMinutes = Math.floor((totalSleep % (1000 * 60 * 60)) / (1000 * 60));

    return {
      totalActivities: todayEntries.filter(entry => entry.type === "activity").length,
      totalFeedings: todayEntries.filter(entry => entry.type === "feeding").length,
      totalSleep: sleepHours > 0 ? `${sleepHours}h ${sleepMinutes}m` : `${sleepMinutes}m`
    };
  };

  const stats = getStats();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
            <Bed className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-bloomBlack">Sleep & Activity Schedule</h3>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-4 py-2 rounded-lg hover:shadow-lg transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        )}
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <Moon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-blue-800">{stats.totalSleep}</div>
          <div className="text-sm text-blue-600">Total Sleep</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <Activity className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-800">{stats.totalActivities}</div>
          <div className="text-sm text-green-600">Activities</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <Utensils className="w-6 h-6 mx-auto mb-2 text-orange-600" />
          <div className="text-2xl font-bold text-orange-800">{stats.totalFeedings}</div>
          <div className="text-sm text-orange-600">Feedings</div>
        </div>
      </div>

      {isAdding && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <h4 className="font-medium text-green-800 mb-4">
            {editingId ? "Edit Schedule Entry" : "New Schedule Entry"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="sleep">Sleep</option>
                <option value="activity">Activity</option>
                <option value="feeding">Feeding</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Nap time, Tummy time, Morning feeding"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any observations..."
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={editingId ? handleUpdateEntry : handleAddEntry}
              disabled={!formData.startTime || !formData.endTime || !formData.description || loading}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Check className="w-4 h-4" />
              {loading ? "Saving..." : (editingId ? "Update" : "Save")}
            </button>
            <button
              onClick={cancelEdit}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loading && entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloomPink mx-auto mb-3"></div>
            <p>Loading schedule entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No schedule entries yet. Add your first entry to get started!</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(entry.type)}`}>
                    {getTypeIcon(entry.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{entry.description}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString()} • {entry.startTime} - {entry.endTime}
                      <span className="ml-2 font-medium">
                        ({calculateDuration(entry.startTime, entry.endTime)})
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry.id)}
                    disabled={loading}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={loading}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {entry.notes && (
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">{entry.notes}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SleepActivitySchedule;