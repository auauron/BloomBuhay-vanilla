import React, { useState } from "react";
import { Plus, Clock, Droplets, Utensils, Trash2, Edit3, Save, X } from "lucide-react";

interface FeedingSession {
  id: string;
  type: 'breast' | 'bottle' | 'pump';
  side?: 'left' | 'right' | 'both';
  amount?: number;
  unit?: 'ml' | 'oz';
  startTime: string;
  endTime: string;
  duration: number;
  notes: string;
}

const FeedingLog: React.FC = () => {
  const [sessions, setSessions] = useState<FeedingSession[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'breast' as 'breast' | 'bottle' | 'pump',
    side: 'left' as 'left' | 'right' | 'both',
    amount: '',
    unit: 'ml' as 'ml' | 'oz',
    startTime: '',
    endTime: '',
    notes: ''
  });

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);
    return Math.round((endDate.getTime() - startDate.getTime()) / 60000); // minutes
  };

  const addSession = () => {
    if (!formData.startTime || !formData.endTime) return;

    const duration = calculateDuration(formData.startTime, formData.endTime);
    const session: FeedingSession = {
      id: Date.now().toString(),
      type: formData.type,
      side: formData.type === 'breast' ? formData.side : undefined,
      amount: formData.amount ? parseInt(formData.amount) : undefined,
      unit: formData.type !== 'breast' ? formData.unit : undefined,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration,
      notes: formData.notes
    };

    setSessions(prev => [session, ...prev]);
    resetForm();
  };

  const updateSession = () => {
    if (!editingId || !formData.startTime || !formData.endTime) return;

    const duration = calculateDuration(formData.startTime, formData.endTime);
    const updatedSession: FeedingSession = {
      id: editingId,
      type: formData.type,
      side: formData.type === 'breast' ? formData.side : undefined,
      amount: formData.amount ? parseInt(formData.amount) : undefined,
      unit: formData.type !== 'breast' ? formData.unit : undefined,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration,
      notes: formData.notes
    };

    setSessions(prev => prev.map(s => s.id === editingId ? updatedSession : s));
    setEditingId(null);
    resetForm();
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const editSession = (session: FeedingSession) => {
    setFormData({
      type: session.type,
      side: session.side || 'left',
      amount: session.amount?.toString() || '',
      unit: session.unit || 'ml',
      startTime: session.startTime,
      endTime: session.endTime,
      notes: session.notes
    });
    setEditingId(session.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'breast',
      side: 'left',
      amount: '',
      unit: 'ml',
      startTime: '',
      endTime: '',
      notes: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getTotalFeedings = () => {
    return sessions.length;
  };

  const getTotalDuration = () => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  };

  const getTodaySessions = () => {
    const today = new Date().toDateString();
    return sessions.filter(session => {
      // In a real app, you'd store actual dates
      return true; // Simplified for demo
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Utensils className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Feeding Log</h3>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stats & Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-blue-200 p-6">
            <h4 className="font-semibold text-blue-800 mb-4">Today's Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{getTodaySessions().length}</div>
                <div className="text-sm text-blue-700">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{getTotalDuration()}</div>
                <div className="text-sm text-blue-700">Minutes</div>
              </div>
            </div>
          </div>

          {/* Feeding Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">
                {editingId ? 'Edit Session' : 'New Feeding Session'}
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
                Log Feeding
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feeding Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="breast">Breastfeeding</option>
                    <option value="bottle">Bottle Feeding</option>
                    <option value="pump">Pumping</option>
                  </select>
                </div>

                {formData.type === 'breast' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Side
                    </label>
                    <select
                      value={formData.side}
                      onChange={(e) => setFormData({...formData, side: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                )}

                {(formData.type === 'bottle' || formData.type === 'pump') && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="ml">ml</option>
                        <option value="oz">oz</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                    placeholder="Any observations..."
                  />
                </div>

                <button
                  onClick={editingId ? updateSession : addSession}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
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
            <h4 className="font-semibold text-gray-800 mb-4">Recent Feeding Sessions</h4>
            
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Utensils className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No feeding sessions recorded yet</p>
                <p className="text-sm">Log your first feeding session to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        session.type === 'breast' ? 'bg-pink-100 text-pink-600' :
                        session.type === 'bottle' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {session.type === 'breast' && <Droplets className="w-4 h-4" />}
                        {session.type === 'bottle' && <Utensils className="w-4 h-4" />}
                        {session.type === 'pump' && <Droplets className="w-4 h-4" />}
                      </div>
                      
                      <div>
                        <div className="font-semibold text-gray-800 capitalize">
                          {session.type} {session.side && `(${session.side})`}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.startTime} - {session.endTime}
                          </span>
                          <span>{session.duration} min</span>
                          {session.amount && (
                            <span>{session.amount} {session.unit}</span>
                          )}
                        </div>
                        {session.notes && (
                          <p className="text-sm text-gray-700 mt-1">{session.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => editSession(session)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-blue-600"
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

export default FeedingLog;