import React, { useState } from "react";
import { Plus, Moon, Sun, Clock, Trash2, Edit3, Save, X, Bed } from "lucide-react";

interface SleepSession {
  id: string;
  type: 'nap' | 'night';
  startTime: string;
  endTime: string;
  duration: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string;
}

const SleepTracker: React.FC = () => {
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'nap' as 'nap' | 'night',
    startTime: '',
    endTime: '',
    quality: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    notes: ''
  });

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);
    let duration = Math.round((endDate.getTime() - startDate.getTime()) / 60000); // minutes
    
    // Handle overnight sleep
    if (duration < 0) {
      duration += 24 * 60; // Add 24 hours
    }
    
    return duration;
  };

  const addSession = () => {
    if (!formData.startTime || !formData.endTime) return;

    const duration = calculateDuration(formData.startTime, formData.endTime);
    const session: SleepSession = {
      id: Date.now().toString(),
      type: formData.type,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration,
      quality: formData.quality,
      notes: formData.notes
    };

    setSessions(prev => [session, ...prev]);
    resetForm();
  };

  const updateSession = () => {
    if (!editingId || !formData.startTime || !formData.endTime) return;

    const duration = calculateDuration(formData.startTime, formData.endTime);
    const updatedSession: SleepSession = {
      id: editingId,
      type: formData.type,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration,
      quality: formData.quality,
      notes: formData.notes
    };

    setSessions(prev => prev.map(s => s.id === editingId ? updatedSession : s));
    setEditingId(null);
    resetForm();
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const editSession = (session: SleepSession) => {
    setFormData({
      type: session.type,
      startTime: session.startTime,
      endTime: session.endTime,
      quality: session.quality,
      notes: session.notes
    });
    setEditingId(session.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'nap',
      startTime: '',
      endTime: '',
      quality: 'good',
      notes: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getTotalSleep = () => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  };

  const getTodaySleep = () => {
    const todaySessions = sessions; // Simplified - in real app filter by date
    return todaySessions.reduce((total, session) => total + session.duration, 0);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getSleepQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Moon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Baby Sleep Tracker</h3>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stats & Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Sleep Stats */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <h4 className="font-semibold text-purple-800 mb-4">Sleep Summary</h4>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatDuration(getTodaySleep())}</div>
                <div className="text-sm text-purple-700">Today's Sleep</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{sessions.length}</div>
                <div className="text-sm text-purple-700">Total Sessions</div>
              </div>
            </div>
          </div>

          {/* Sleep Recommendations */}
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
            <h4 className="font-semibold text-blue-800 mb-3">Sleep Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Newborns: 14-17 hours daily</li>
              <li>• 1-4 months: 12-16 hours daily</li>
              <li>• 4-12 months: 12-16 hours daily</li>
              <li>• Watch for sleep cues: yawning, eye rubbing</li>
              <li>• Consistent bedtime routine helps</li>
            </ul>
          </div>

          {/* Sleep Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">
                {editingId ? 'Edit Sleep Session' : 'New Sleep Session'}
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
                Log Sleep
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sleep Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="nap">Nap</option>
                    <option value="night">Night Sleep</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sleep Quality
                  </label>
                  <select
                    value={formData.quality}
                    onChange={(e) => setFormData({...formData, quality: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
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
                    placeholder="Wake-ups, soothing methods, etc."
                  />
                </div>

                <button
                  onClick={editingId ? updateSession : addSession}
                  className="w-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update Session' : 'Save Session'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sessions List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Sleep History</h4>
            
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bed className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No sleep sessions recorded yet</p>
                <p className="text-sm">Log your baby's first sleep session to track patterns</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        session.type === 'nap' ? 'bg-yellow-100 text-yellow-600' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        {session.type === 'nap' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </div>
                      
                      <div>
                        <div className="font-semibold text-gray-800 capitalize">
                          {session.type} Sleep
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.startTime} - {session.endTime}
                          </span>
                          <span>{formatDuration(session.duration)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSleepQualityColor(session.quality)}`}>
                            {session.quality}
                          </span>
                        </div>
                        {session.notes && (
                          <p className="text-sm text-gray-700 mt-1">{session.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => editSession(session)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-purple-600"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSession(session.id)}
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

export default SleepTracker;