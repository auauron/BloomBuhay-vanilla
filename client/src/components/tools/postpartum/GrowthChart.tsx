import React, { useState } from "react";
import { Plus, TrendingUp, Ruler, Scale, Brain, Trash2, Edit3, Save, X, ChartBar } from "lucide-react";

interface GrowthRecord {
  id: string;
  date: string;
  age: number; // in months
  weight: number; // in kg
  height: number; // in cm
  headCircumference: number; // in cm
  notes: string;
}

const GrowthChart: React.FC = () => {
  const [records, setRecords] = useState<GrowthRecord[]>([
    {
      id: '1',
      date: '2024-01-15',
      age: 0,
      weight: 3.2,
      height: 50,
      headCircumference: 35,
      notes: 'Birth measurements'
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    age: '',
    weight: '',
    height: '',
    headCircumference: '',
    notes: ''
  });

  // WHO Growth Chart Percentiles (simplified)
  const whoPercentiles = {
    weight: {
      0: { p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.9, p97: 4.3 },
      1: { p3: 3.4, p15: 3.8, p50: 4.5, p85: 5.1, p97: 5.6 },
      2: { p3: 4.4, p15: 4.9, p50: 5.6, p85: 6.3, p97: 6.9 },
      3: { p3: 5.1, p15: 5.6, p50: 6.4, p85: 7.2, p97: 7.8 },
      6: { p3: 6.4, p15: 7.0, p50: 7.9, p85: 8.8, p97: 9.5 },
      9: { p3: 7.2, p15: 7.9, p50: 8.9, p85: 9.9, p97: 10.7 },
      12: { p3: 7.8, p15: 8.6, p50: 9.6, p85: 10.7, p97: 11.6 }
    },
    height: {
      0: { p3: 46, p15: 47, p50: 49, p85: 51, p97: 52 },
      1: { p3: 51, p15: 52, p50: 54, p85: 56, p97: 57 },
      2: { p3: 55, p15: 56, p50: 58, p85: 60, p97: 61 },
      3: { p3: 58, p15: 59, p50: 61, p85: 63, p97: 64 },
      6: { p3: 64, p15: 65, p50: 67, p85: 69, p97: 70 },
      9: { p3: 68, p15: 69, p50: 71, p85: 73, p97: 74 },
      12: { p3: 71, p15: 72, p50: 74, p85: 76, p97: 77 }
    }
  };

  const addRecord = () => {
    if (!formData.date || !formData.weight || !formData.height || !formData.headCircumference) return;

    const record: GrowthRecord = {
      id: Date.now().toString(),
      date: formData.date,
      age: parseInt(formData.age) || 0,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      headCircumference: parseFloat(formData.headCircumference),
      notes: formData.notes
    };

    setRecords(prev => [record, ...prev]);
    resetForm();
  };

  const updateRecord = () => {
    if (!editingId || !formData.date || !formData.weight || !formData.height || !formData.headCircumference) return;

    const updatedRecord: GrowthRecord = {
      id: editingId,
      date: formData.date,
      age: parseInt(formData.age) || 0,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      headCircumference: parseFloat(formData.headCircumference),
      notes: formData.notes
    };

    setRecords(prev => prev.map(r => r.id === editingId ? updatedRecord : r));
    setEditingId(null);
    resetForm();
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const editRecord = (record: GrowthRecord) => {
    setFormData({
      date: record.date,
      age: record.age.toString(),
      weight: record.weight.toString(),
      height: record.height.toString(),
      headCircumference: record.headCircumference.toString(),
      notes: record.notes
    });
    setEditingId(record.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      date: '',
      age: '',
      weight: '',
      height: '',
      headCircumference: '',
      notes: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getPercentile = (age: number, measurement: number, type: 'weight' | 'height') => {
    const percentiles = whoPercentiles[type][age as keyof typeof whoPercentiles.weight];
    if (!percentiles) return 'Unknown';

    if (measurement <= percentiles.p3) return '3rd';
    if (measurement <= percentiles.p15) return '15th';
    if (measurement <= percentiles.p50) return '50th';
    if (measurement <= percentiles.p85) return '85th';
    if (measurement <= percentiles.p97) return '97th';
    return 'Above 97th';
  };

  const getPercentileColor = (percentile: string) => {
    switch (percentile) {
      case '3rd': return 'text-red-600 bg-red-100';
      case '15th': return 'text-orange-600 bg-orange-100';
      case '50th': return 'text-green-600 bg-green-100';
      case '85th': return 'text-blue-600 bg-blue-100';
      case '97th': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const latestRecord = records[0];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Growth Chart</h3>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stats & Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Current Stats */}
          {latestRecord && (
            <div className="bg-white rounded-2xl border border-purple-200 p-6">
              <h4 className="font-semibold text-purple-800 mb-4">Current Measurements</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Weight</span>
                  <span className="font-semibold text-gray-800">{latestRecord.weight} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Height</span>
                  <span className="font-semibold text-gray-800">{latestRecord.height} cm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Head Circ.</span>
                  <span className="font-semibold text-gray-800">{latestRecord.headCircumference} cm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Age</span>
                  <span className="font-semibold text-gray-800">{latestRecord.age} months</span>
                </div>
              </div>
            </div>
          )}

          {/* Growth Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">
                {editingId ? 'Edit Measurement' : 'New Measurement'}
              </h4>
              {showForm && (
                <button
                  onClick={resetForm}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>

            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Measurement
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age (months)
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    max="36"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="3.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Head Circumference (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.headCircumference}
                    onChange={(e) => setFormData({...formData, headCircumference: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="35"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={2}
                    placeholder="Doctor's observations, concerns..."
                  />
                </div>

                <button
                  onClick={editingId ? updateRecord : addRecord}
                  className="w-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update Measurement' : 'Save Measurement'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Growth History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Growth History</h4>
            
            {records.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ChartBar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No growth measurements recorded yet</p>
                <p className="text-sm">Add your baby's first measurement to start tracking growth</p>
              </div>
            ) : (
              <div className="space-y-4">
                {records.map((record) => {
                  const weightPercentile = getPercentile(record.age, record.weight, 'weight');
                  const heightPercentile = getPercentile(record.age, record.height, 'height');
                  
                  return (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-gray-800">
                          {new Date(record.date).toLocaleDateString()} • {record.age} months
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editRecord(record)}
                            className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-purple-600"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteRecord(record.id)}
                            className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Scale className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-800">{record.weight} kg</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPercentileColor(weightPercentile)}`}>
                            {weightPercentile} percentile
                          </span>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Ruler className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-gray-800">{record.height} cm</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPercentileColor(heightPercentile)}`}>
                            {heightPercentile} percentile
                          </span>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Brain className="w-4 h-4 text-purple-600" />
                            <span className="font-semibold text-gray-800">{record.headCircumference} cm</span>
                          </div>
                          <span className="text-xs text-gray-500">Head Circ.</span>
                        </div>
                      </div>

                      {record.notes && (
                        <p className="text-sm text-gray-700 mt-3 border-t border-gray-200 pt-3">
                          {record.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthChart;