import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Check, Utensils } from "lucide-react";
import { bbtoolsService, NutritionEntry, CreateNutritionRequest } from "../../../services/BBToolsService";

const NutritionLog: React.FC = () => {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    food: "",
    amount: "",
    notes: ""
  });

  // Load nutrition entries from backend
  useEffect(() => {
    loadNutritionEntries();
  }, []);

  const loadNutritionEntries = async () => {
    setLoading(true);
    try {
      const response = await bbtoolsService.getNutritionLogs();
      if (response.success && response.data) {
        setEntries(response.data);
      } else {
        console.error("Failed to load nutrition entries:", response.error);
      }
    } catch (error) {
      console.error("Error loading nutrition entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!formData.food.trim()) return;

    setLoading(true);
    try {
      const response = await bbtoolsService.addNutrition(formData as CreateNutritionRequest);
      if (response.success && response.data) {
        setEntries([response.data, ...entries]);
        resetForm();
        setIsAdding(false);
      } else {
        console.error("Failed to add nutrition entry:", response.error);
        alert("Failed to save nutrition entry. Please try again.");
      }
    } catch (error) {
      console.error("Error adding nutrition entry:", error);
      alert("Error saving nutrition entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setFormData({
        date: entry.date,
        time: entry.time,
        food: entry.food,
        amount: entry.amount,
        notes: entry.notes
      });
      setEditingId(id);
      setIsAdding(true);
    }
  };

  const handleUpdateEntry = async () => {
    if (!formData.food.trim() || !editingId) return;

    setLoading(true);
    try {
      const response = await bbtoolsService.updateNutrition(editingId, formData);
      if (response.success && response.data) {
        setEntries(entries.map(entry => 
          entry.id === editingId ? { ...entry, ...response.data } : entry
        ));
        resetForm();
        setEditingId(null);
        setIsAdding(false);
      } else {
        console.error("Failed to update nutrition entry:", response.error);
        alert("Failed to update nutrition entry. Please try again.");
      }
    } catch (error) {
      console.error("Error updating nutrition entry:", error);
      alert("Error updating nutrition entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this nutrition entry?")) return;

    setLoading(true);
    try {
      const response = await bbtoolsService.deleteNutrition(id);
      if (response.success) {
        setEntries(entries.filter(entry => entry.id !== id));
      } else {
        console.error("Failed to delete nutrition entry:", response.error);
        alert("Failed to delete nutrition entry. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting nutrition entry:", error);
      alert("Error deleting nutrition entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      food: "",
      amount: "",
      notes: ""
    });
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-bloomBlack">Nutrition Log</h3>
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

      {isAdding && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <h4 className="font-medium text-green-800 mb-4">
            {editingId ? "Edit Entry" : "New Nutrition Entry"}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Food Item *</label>
              <input
                type="text"
                value={formData.food}
                onChange={(e) => setFormData({ ...formData, food: e.target.value })}
                placeholder="e.g., Breast milk, Banana, Rice cereal"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="text"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g., 4 oz, 1/2 cup, 2 tbsp"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any observations or reactions..."
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={editingId ? handleUpdateEntry : handleAddEntry}
              disabled={!formData.food.trim() || loading}
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
            <p>Loading nutrition entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Utensils className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No nutrition entries yet. Add your first entry to get started!</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{entry.food}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(entry.date).toLocaleDateString()} at {entry.time}
                    {entry.amount && ` • ${entry.amount}`}
                  </p>
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

export default NutritionLog;