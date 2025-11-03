import React, { useState } from "react";
import { Plus, Droplets, Trash2, Edit3, Save, X, Baby, TrendingUp } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPoop } from "@fortawesome/free-solid-svg-icons";

interface DiaperChange {
  id: string;
  type: 'wet' | 'dirty' | 'both';
  time: string;
  notes: string;
  color?: 'yellow' | 'green' | 'brown' | 'black';
  consistency?: 'seedy' | 'pasty' | 'watery';
}

const DiaperTracker: React.FC = () => {
  const [changes, setChanges] = useState<DiaperChange[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'wet' as 'wet' | 'dirty' | 'both',
    time: '',
    notes: '',
    color: 'yellow' as 'yellow' | 'green' | 'brown' | 'black',
    consistency: 'seedy' as 'seedy' | 'pasty' | 'watery'
  });

  const addChange = () => {
    if (!formData.time) return;

    const change: DiaperChange = {
      id: Date.now().toString(),
      type: formData.type,
      time: formData.time,
      notes: formData.notes,
      color: formData.type !== 'wet' ? formData.color : undefined,
      consistency: formData.type !== 'wet' ? formData.consistency : undefined
    };

    setChanges(prev => [change, ...prev]);
    resetForm();
  };

  const updateChange = () => {
    if (!editingId || !formData.time) return;

    const updatedChange: DiaperChange = {
      id: editingId,
      type: formData.type,
      time: formData.time,
      notes: formData.notes,
      color: formData.type !== 'wet' ? formData.color : undefined,
      consistency: formData.type !== 'wet' ? formData.consistency : undefined
    };

    setChanges(prev => prev.map(c => c.id === editingId ? updatedChange : c));
    setEditingId(null);
    resetForm();
  };

  const deleteChange = (id: string) => {
    setChanges(prev => prev.filter(c => c.id !== id));
  };

  const editChange = (change: DiaperChange) => {
    setFormData({
      type: change.type,
      time: change.time,
      notes: change.notes,
      color: change.color || 'yellow',
      consistency: change.consistency || 'seedy'
    });
    setEditingId(change.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'wet',
      time: '',
      notes: '',
      color: 'yellow',
      consistency: 'seedy'
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getTodayChanges = () => {
    return changes; // Simplified - in real app filter by date
  };

  const getWetCount = () => {
    return changes.filter(change => change.type === 'wet' || change.type === 'both').length;
  };

  const getDirtyCount = () => {
    return changes.filter(change => change.type === 'dirty' || change.type === 'both').length;
  };

  const getHealthStatus = () => {
    const wetCount = getWetCount();
    const dirtyCount = getDirtyCount();
    
    if (wetCount >= 6 && dirtyCount >= 1) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    if (wetCount >= 4 && dirtyCount >= 1) return { status: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (wetCount >= 3) return { status: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { status: 'Monitor', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const healthStatus = getHealthStatus();

  const getDiaperIcon = (type: string) => {
    switch (type) {
      case 'wet': return <Droplets className="w-4 h-4" />;
      case 'dirty': return <FontAwesomeIcon icon={faPoop} style={{color: "#ffffff", width: 4, height: 4}} />
    //   <Poop className="w-4 h-4" />;
      case 'both': return <><Droplets className="w-4 h-4" /><FontAwesomeIcon icon={faPoop} style={{color: "#ffffff", width: 4, height: 4}} /></>;
      default: return <Droplets className="w-4 h-4" />;
    }
  };

  const getDiaperColor = (type: string) => {
    switch (type) {
      case 'wet': return 'bg-blue-100 text-blue-600';
      case 'dirty': return 'bg-amber-100 text-amber-600';
      case 'both': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Baby className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Diaper Tracker</h3>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stats & Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Health Status */}
          <div className={`rounded-2xl p-6 border ${healthStatus.bg} ${healthStatus.border}`}>
            <h4 className="font-semibold text-gray-800 mb-3">Today's Summary</h4>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{getWetCount()}</div>
                <div className="text-sm text-blue-700">Wet Diapers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{getDirtyCount()}</div>
                <div className="text-sm text-amber-700">Dirty Diapers</div>
              </div>
            </div>
            <div className="text-center">
              <div className={`font-semibold ${healthStatus.color}`}>{healthStatus.status}</div>
              <div className="text-xs text-gray-600">Hydration Status</div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
            <h4 className="font-semibold text-blue-800 mb-3">Healthy Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• 6+ wet diapers daily indicates good hydration</li>
              <li>• 1+ dirty diaper daily for breastfed babies</li>
              <li>• 1+ dirty diaper every 1-2 days for formula-fed</li>
              <li>• Contact doctor for: no wet diapers in 6+ hours</li>
            </ul>
          </div>

          {/* Diaper Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">
                {editingId ? 'Edit Diaper Change' : 'New Diaper Change'}
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
                Log Diaper Change
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diaper Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="wet">Wet Only</option>
                    <option value="dirty">Dirty Only</option>
                    <option value="both">Wet & Dirty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {formData.type !== 'wet' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stool Color
                      </label>
                      <select
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="yellow">Yellow (Normal)</option>
                        <option value="green">Green</option>
                        <option value="brown">Brown</option>
                        <option value="black">Black</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consistency
                      </label>
                      <select
                        value={formData.consistency}
                        onChange={(e) => setFormData({...formData, consistency: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="seedy">Seedy (Normal BF)</option>
                        <option value="pasty">Pasty (Normal FF)</option>
                        <option value="watery">Watery</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    rows={2}
                    placeholder="Any observations, rash, etc."
                  />
                </div>

                <button
                  onClick={editingId ? updateChange : addChange}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-400 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update Change' : 'Save Change'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Changes List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Diaper Change History</h4>
            
            {changes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Droplets className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No diaper changes recorded yet</p>
                <p className="text-sm">Log your first diaper change to track patterns</p>
              </div>
            ) : (
              <div className="space-y-3">
                {changes.map((change) => (
                  <div key={change.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${getDiaperColor(change.type)}`}>
                        {getDiaperIcon(change.type)}
                      </div>
                      
                      <div>
                        <div className="font-semibold text-gray-800 capitalize">
                          {change.type} Diaper
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{change.time}</span>
                          {change.color && (
                            <span className="capitalize">Color: {change.color}</span>
                          )}
                          {change.consistency && (
                            <span className="capitalize">Consistency: {change.consistency}</span>
                          )}
                        </div>
                        {change.notes && (
                          <p className="text-sm text-gray-700 mt-1">{change.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => editChange(change)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-amber-600"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteChange(change.id)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaperTracker;