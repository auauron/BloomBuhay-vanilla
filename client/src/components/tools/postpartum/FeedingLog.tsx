import React, { useState, useEffect } from "react";
import { Plus, Clock, Droplets, Utensils, Trash2, Edit3, Save, X } from "lucide-react";
import {
  bbtoolsService,
  FeedingLogProps,
  FeedingSessionForm,
  CreateFeedingRequest,
  FeedingLog as FeedingLogType,
  LocalFeedingSession
} from "../../../services/BBToolsService";
import DateTimePicker from "../../ui/DateTimePicker";

interface ExtendedFeedingSession extends LocalFeedingSession {
  date: string;
  time: string;
  side?: 'left' | 'right' | 'both';
}

const FeedingLog: React.FC<FeedingLogProps> = ({ feedings = [], onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FeedingSessionForm & { date: string; time: string }>({
    type: 'breast',
    side: 'left',
    amount: undefined,
    duration: undefined,
    notes: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  });
  const [localSessions, setLocalSessions] = useState<ExtendedFeedingSession[]>([]);

  useEffect(() => {
    setLocalSessions(feedings.map(convertToLocalSession));
  }, [feedings]);

  const convertToLocalSession = (feeding: FeedingLogType): ExtendedFeedingSession => {
    const timestamp = feeding.occurredAt || feeding.createdAt || new Date().toISOString();
    const date = new Date(timestamp);
    
    let duration = 0;
    let side: 'left' | 'right' | 'both' | undefined;
    let cleanNotes = feeding.notes || '';

    // Extract duration
    const durationPrefix = "(Duration: ";
    const durationSuffix = " minutes)";
    const durationStartIndex = cleanNotes.indexOf(durationPrefix);

    if (durationStartIndex !== -1) {
      const durationEndIndex = cleanNotes.indexOf(durationSuffix, durationStartIndex);
      if (durationEndIndex !== -1) {
        const durationText = cleanNotes.substring(
          durationStartIndex + durationPrefix.length,
          durationEndIndex
        );
        duration = parseInt(durationText) || 0;

        // Remove duration from notes
        const beforeDuration = cleanNotes.substring(0, durationStartIndex).trim();
        const afterDuration = cleanNotes.substring(durationEndIndex + durationSuffix.length).trim();
        cleanNotes = [beforeDuration, afterDuration].filter(Boolean).join(' ').trim();
      }
    }

    // Extract side information for breastfeeding
    if (feeding.method === 'breast') {
      const sidePrefix = "Side: ";
      const sideStartIndex = cleanNotes.indexOf(sidePrefix);

      if (sideStartIndex !== -1) {
        const afterSide = cleanNotes.substring(sideStartIndex + sidePrefix.length);
        const commaIndex = afterSide.indexOf(',');
        const sideValue = commaIndex !== -1
          ? afterSide.substring(0, commaIndex).trim()
          : afterSide.trim();

        // Validate and cast side value
        if (sideValue.toLowerCase() === 'left' || sideValue.toLowerCase() === 'right' || sideValue.toLowerCase() === 'both') {
          side = sideValue.toLowerCase() as 'left' | 'right' | 'both';
        }

        const beforeSide = cleanNotes.substring(0, sideStartIndex).trim();
        let afterSideInfo = commaIndex !== -1
          ? afterSide.substring(commaIndex + 1).trim()
          : '';

        cleanNotes = [beforeSide, afterSideInfo].filter(Boolean).join(' ').trim();
      }
    }

    const endTime = duration > 0
      ? new Date(date.getTime() + duration * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Unknown';

    return {
      id: feeding.id.toString(),
      type: (feeding.method as 'breast' | 'formula' | 'solid') || 'breast',
      amount: feeding.amount,
      startTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime,
      duration,
      notes: cleanNotes,
      rawTimestamp: timestamp,
      side: side,
      date: date.toISOString().split('T')[0],
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    };
  };

  const sessions: ExtendedFeedingSession[] = localSessions;

  const addSession = async () => {
    if (!formData.type || !formData.date || !formData.time) return;

    // Combine date and time into ISO string
    const occurredAt = new Date(`${formData.date}T${formData.time}`).toISOString();
    const duration = formData.duration || 0;

    // Build notes with side information for breastfeeding
    let notes = formData.notes;
    if (formData.type === 'breast' && formData.side) {
      notes = `Side: ${formData.side}${notes ? `, ${notes}` : ''}`;
    }
    if (duration > 0) {
      notes = `${notes}${notes ? ' ' : ''}(Duration: ${duration} minutes)`;
    }

    const feedingData: CreateFeedingRequest = {
      amount: formData.amount,
      method: formData.type,
      notes: notes,
      occurredAt: occurredAt
    };

    const result = await bbtoolsService.addFeeding(feedingData);
    if (result.success && onRefresh) {
      onRefresh();
      resetForm();
    } else {
      console.error('Failed to add feeding:', result.error);
    }
  };

  const updateSession = async () => {
    if (!editingId || !formData.date || !formData.time) return;

    // Combine date and time into ISO string
    const occurredAt = new Date(`${formData.date}T${formData.time}`).toISOString();
    const duration = formData.duration || 0;

    // Build notes with side information for breastfeeding
    let notes = formData.notes;
    if (formData.type === 'breast' && formData.side) {
      notes = `Side: ${formData.side}${notes ? `, ${notes}` : ''}`;
    }
    if (duration > 0) {
      notes = `${notes}${notes ? ' ' : ''}(Duration: ${duration} minutes)`;
    }

    const feedingData: CreateFeedingRequest = {
      amount: formData.amount,
      method: formData.type,
      notes: notes,
      occurredAt: occurredAt
    };

    const result = await bbtoolsService.updateFeeding(editingId, feedingData);
    if (result.success && onRefresh) {
      onRefresh();
      setEditingId(null);
      resetForm();
    }
  };

  const deleteSession = async (id: string) => {
    const result = await bbtoolsService.deleteFeeding(id);
    if (result.success) {
      setLocalSessions(prev => prev.filter(s => s.id !== id));
      if (onRefresh) onRefresh();
    } else {
      console.error('Failed to delete feeding:', result.error || 'Unknown error');
    }
  };

  const editSession = (session: ExtendedFeedingSession) => {
    setFormData({
      type: session.type,
      amount: session.amount,
      duration: session.duration > 0 ? session.duration : undefined,
      notes: session.notes,
      side: session.side || 'left',
      date: session.date,
      time: session.time
    });
    setEditingId(session.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'breast',
      side: 'left',
      amount: undefined,
      duration: undefined,
      notes: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
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
      const sessionDate = new Date(session.rawTimestamp).toDateString();
      return sessionDate === today;
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
                {/* DateTime Picker */}
                <DateTimePicker
                  date={formData.date}
                  time={formData.time}
                  onDateChange={(date) => setFormData({...formData, date})}
                  onTimeChange={(time) => setFormData({...formData, time})}
                  dateLabel="Feeding Date"
                  timeLabel="Feeding Time"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feeding Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="breast">Breastfeeding</option>
                    <option value="formula">Formula</option>
                    <option value="solid">Solid Food</option>
                  </select>
                </div>

                {formData.type === 'breast' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Side
                    </label>
                    <select
                      value={formData.side}
                      onChange={(e) => setFormData({ ...formData, side: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                )}

                {(formData.type === 'formula' || formData.type === 'solid') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (ml)
                    </label>
                    <input
                      type="number"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="15"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                    placeholder="Any observations..."
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
                      <div className={`p-2 rounded-lg ${session.type === 'breast' ? 'bg-pink-100 text-pink-600' :
                          session.type === 'formula' ? 'bg-blue-100 text-blue-600' :
                            'bg-green-100 text-green-600'
                        }`}>
                        {session.type === 'breast' && <Droplets className="w-4 h-4" />}
                        {session.type === 'formula' && <Utensils className="w-4 h-4" />}
                        {session.type === 'solid' && <Utensils className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 capitalize">
                          {session.type} {session.side && `(${session.side})`}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                          <span>{new Date(session.date).toLocaleDateString()} at {session.startTime}</span>
                          {session.duration > 0 && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                              {session.duration} min
                            </span>
                          )}
                          {session.amount && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                              {session.amount} ml
                            </span>
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