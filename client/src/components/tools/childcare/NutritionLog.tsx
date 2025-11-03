import React, { useState } from "react";
import { Plus, Trash2, Edit3, Check, Utensils} from "lucide-react";

interface NutritionEntry {
  id: string;
  date: string;
  time: string;
  food: string;
  amount: string;
  notes: string;
}

const NutritionLog: React.FC = () => {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    food: "",
    amount: "",
    notes: ""
  });

  const handleAddEntry = () => {
    if (!formData.food.trim()) return;

    const newEntry: NutritionEntry = {
      id: Date.now().toString(),
      ...formData
    };

    setEntries([newEntry, ...entries]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      food: "",
      amount: "",
      notes: ""
    });
    setIsAdding(false);
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

  const handleUpdateEntry = () => {
    if (!formData.food.trim() || !editingId) return;

    setEntries(entries.map(entry => 
      entry.id === editingId ? { ...entry, ...formData } : entry
    ));
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      food: "",
      amount: "",
      notes: ""
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      food: "",
      amount: "",
      notes: ""
    });
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
            className="flex items-center gap-2 bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-4 py-2 rounded-lg hover:shadow-lg transition hover:scale-105"
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={editingId ? handleUpdateEntry : handleAddEntry}
              disabled={!formData.food.trim()}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Check className="w-4 h-4" />
              {editingId ? "Update" : "Save"}
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {entries.length === 0 ? (
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
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
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