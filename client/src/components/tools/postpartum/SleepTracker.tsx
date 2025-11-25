import React, { useState, useEffect } from "react";
import { Plus, Moon, Sun, Clock, Trash2, Edit3, Save, X, Bed } from "lucide-react";
import { bbtoolsService, SleepTrackerProps, SleepSessionForm, SleepLog, LocalSleepSession, CreateSleepRequest } from "../../../services/BBToolsService";

const SleepTracker: React.FC<SleepTrackerProps> = ({ sleeps = [], onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SleepSessionForm>({
    startTime: '',
    endTime: '',
    notes: ''
  });
  
  const [localSessions, setLocalSessions] = useState<LocalSleepSession[]>([]);
  useEffect(() => {
    setLocalSessions(sleeps.map(convertToLocalSession));
  }, [sleeps]);

  // Convert database SleepLog to local display format
  const convertToLocalSession = (sleep: SleepLog) => {
    const startDate = new Date(sleep.startAt);
    const endDate = sleep.endAt ? new Date(sleep.endAt) : null;
    
    // Determine sleep type based on time of day
    const hour = startDate.getHours();
    const type = (hour >= 6 && hour < 18) ? 'nap' : 'night';
    
    // Format times for display (am/pm)
    const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const endTime = endDate ? endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Ongoing';

    // Calculate duration (use stored or calculate)
    const duration = sleep.durationMinutes || 
      (endDate ? Math.round((endDate.getTime() - startDate.getTime()) / 60000) : 0);
    
    // Simple quality based on duration
    let quality: 'excellent' | 'good' | 'fair' | 'poor' = 'good';
    if (duration > 180) quality = 'excellent';
    else if (duration > 120) quality = 'good';
    else if (duration > 60) quality = 'fair';
    else quality = 'poor';

    return {
      id: sleep.id.toString(),
      type,
      startTime,
      endTime,
      duration,
      quality,
      notes: sleep.notes || '',
      rawStartAt: sleep.startAt,
      rawEndAt: sleep.endAt
    };
  };

  const sessions = localSessions; // replace direct mapping usage

  // Convert time string "HH:MM" to full ISO date string for the database
  const timeToISODate = (timeString: string): string => {
    if (!timeString) return '';
    
    const today = new Date();
    const [hours, minutes] = timeString.split(':').map(Number);
    
    const date = new Date(today);
    date.setHours(hours, minutes, 0, 0);
    
    return date.toISOString();
  };

  // Convert ISO date string to time string "HH:MM" for form inputs
  const ISODateToTime = (isoString: string): string => {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  };

  const addSession = async () => {
    if (!formData.startTime || !formData.endTime) return;

    const sleepData: CreateSleepRequest = {
      startAt: timeToISODate(formData.startTime),
      endAt: timeToISODate(formData.endTime),
      notes: formData.notes
    };

    const result = await bbtoolsService.addSleep(sleepData);
    if (result.success && onRefresh) {
      onRefresh();
      resetForm();
    }
  };

  const updateSession = async () => {
    if (!editingId) return;

    const sleepData: CreateSleepRequest = {
      startAt: timeToISODate(formData.startTime),
      endAt: timeToISODate(formData.endTime),
      notes: formData.notes
    };

    const result = await bbtoolsService.updateSleep(editingId, sleepData);
    if (result.success && onRefresh) {
      onRefresh();
      setEditingId(null);
      resetForm();
    }
  };

  const deleteSession = async (id: string) => {
    // optimistic removal first
    setLocalSessions(prev => prev.filter(s => s.id !== id));
    const result = await bbtoolsService.deleteSleep(id);
    if (!result.success) {
      console.error('Failed to delete sleep log:', result.error);
      // revert if failed
      if (onRefresh) onRefresh();
    } else {
      if (onRefresh) onRefresh();
    }
  };

  const editSession = (session: any) => {
    const originalSleep = sleeps.find(s => s.id.toString() === session.id);
    if (originalSleep) {
      setFormData({
        startTime: ISODateToTime(originalSleep.startAt),
        endTime: originalSleep.endAt ? ISODateToTime(originalSleep.endAt) : '',
        notes: originalSleep.notes || ''
      });
      setEditingId(session.id);
      setShowForm(true);
    }
  };

  const resetForm = () => {
    setFormData({
      startTime: '',
      endTime: '',
      notes: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getTotalSleep = () => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  };

  const getTodaySleep = () => {
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(session => {
      const sessionDate = new Date(session.rawStartAt).toDateString();
      return sessionDate === today;
    });
    return todaySessions.reduce((total, session) => total + session.duration, 0);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
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