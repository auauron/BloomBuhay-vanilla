import React, { useEffect, useState } from "react";
import { Plus, Droplets, Trash2, Edit3, Save, X, Baby } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPoop } from "@fortawesome/free-solid-svg-icons";
import { bbtoolsService, CreateDiaperRequest, DiaperLog } from "../../../services/BBToolsService";

interface DiaperChange {
  id: string;
  type: 'wet' | 'dirty' | 'both';
  time: string;
  notes: string;
  color?: 'yellow' | 'green' | 'brown' | 'black';
  consistency?: 'seedy' | 'pasty' | 'watery';
}

const DiaperTracker: React.FC<{ diapers?: DiaperLog[]; onRefresh?: () => void }> = ({ diapers = [], onRefresh }) => {
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

  // Map server logs to local view
  useEffect(() => {
    const mapped = (diapers || []).map((d) => ({
      id: String(d.id),
      type: (d.diaperType || 'wet') as 'wet' | 'dirty' | 'both',
      time: d.occurredAt ? new Date(d.occurredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      notes: d.notes || '',
      color: d.color,
      consistency: d.consistency,
    }));
    setChanges(mapped);
  }, [diapers]);

  const addChange = async () => {
    if (!formData.time) return;
    // Build occurredAt today + time
    const [hh, mm] = formData.time.split(":");
    const occurredAt = new Date();
    occurredAt.setHours(parseInt(hh), parseInt(mm), 0, 0);

    const payload: CreateDiaperRequest = {
      diaperType: formData.type,
      occurredAt: occurredAt.toISOString(),
      color: formData.type !== 'wet' ? formData.color : undefined,
      consistency: formData.type !== 'wet' ? (formData.consistency as any) : undefined,
      notes: formData.notes,
    };

    // optimistic
    const tempId = Date.now().toString();
    const optimistic: DiaperChange = {
      id: tempId,
      type: formData.type,
      time: formData.time,
      notes: formData.notes,
      color: payload.color,
      consistency: payload.consistency as any,
    };
    setChanges((prev) => [optimistic, ...prev]);

    const res = await bbtoolsService.addDiaper(payload);
    if (!res.success) {
      // rollback
      setChanges((prev) => prev.filter((c) => c.id !== tempId));
      console.error('Failed to add diaper log', res.error);
      return;
    }
    if (onRefresh) onRefresh();
    resetForm();
  };

  const updateChange = async () => {
    if (!editingId || !formData.time) return;

    const [hh, mm] = formData.time.split(":");
    const occurredAt = new Date();
    occurredAt.setHours(parseInt(hh), parseInt(mm), 0, 0);

    const payload: Partial<CreateDiaperRequest> = {
      diaperType: formData.type,
      occurredAt: occurredAt.toISOString(),
      color: formData.type !== 'wet' ? formData.color : undefined,
      consistency: formData.type !== 'wet' ? (formData.consistency as any) : undefined,
      notes: formData.notes,
    };

    // optimistic
    const prevSnapshot = changes;
    setChanges((prev) => prev.map((c) => c.id === editingId ? { ...c, type: formData.type, time: formData.time, notes: formData.notes, color: payload.color, consistency: payload.consistency as any } : c));

    const res = await bbtoolsService.updateDiaper(editingId, payload);
    if (!res.success) {
      setChanges(prevSnapshot);
      console.error('Failed to update diaper log', res.error);
      return;
    }
    setEditingId(null);
    resetForm();
    if (onRefresh) onRefresh();
  };

  const deleteChange = async (id: string) => {
    const prevSnapshot = changes;
    setChanges((prev) => prev.filter((c) => c.id !== id));
    const res = await bbtoolsService.deleteDiaper(id);
    if (!res.success) {
      setChanges(prevSnapshot);
      console.error('Failed to delete diaper log', res.error);
    } else {
      if (onRefresh) onRefresh();
    }
  };

  const editChange = (change: DiaperChange) => {
    setFormData({
      type: change.type,
      time: change.time,
      notes: change.notes,
      color: change.color || 'yellow',
      consistency: (change.consistency || 'seedy') as any,
    });
    setEditingId(change.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ type: 'wet', time: '', notes: '', color: 'yellow', consistency: 'seedy' });
    setShowForm(false);
    setEditingId(null);
  };

  const getTodayChanges = () => changes; // backend already returns recent list
  const getWetCount = () => changes.filter((c) => c.type === 'wet' || c.type === 'both').length;
  const getDirtyCount = () => changes.filter((c) => c.type === 'dirty' || c.type === 'both').length;

  const getDiaperIcon = (type: string) => {
    switch (type) {
      case 'wet':
        return <Droplets className="flex w-4 h-4" />;
      case 'dirty':
        return <FontAwesomeIcon icon={faPoop} className="flex w-4 h-4 text-white" />;
      case 'both':
        return (
          <div className="flex items-center justify-center gap-1 w-8 h-4">
            <Droplets className="flex w-4 h-4" />
            <FontAwesomeIcon icon={faPoop} className="flex w-4 h-4 text-white" />
          </div>
        );
      default:
        return <Droplets className="flex w-4 h-4" />;
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
          <div className={`rounded-2xl p-6 border bg-blue-50 border-blue-200`}>
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
              <div className={`font-semibold text-blue-700`}>Hydration Monitor</div>
              <div className="text-xs text-gray-600">Track patterns over time</div>
            </div>
          </div>

          {/* Diaper Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">
                {editingId ? 'Edit Diaper Change' : 'New Diaper Change'}
              </h4>
              {showForm && (
                <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>

            {!showForm ? (
              <button onClick={() => setShowForm(true)} className="w-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Log Diaper Change
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diaper Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option value="wet">Wet Only</option>
                    <option value="dirty">Dirty Only</option>
                    <option value="both">Wet & Dirty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>

                {formData.type !== 'wet' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stool Color</label>
                      <select value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                        <option value="yellow">Yellow (Normal)</option>
                        <option value="green">Green</option>
                        <option value="brown">Brown</option>
                        <option value="black">Black</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Consistency</label>
                      <select value={formData.consistency} onChange={(e) => setFormData({...formData, consistency: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                        <option value="seedy">Seedy (Normal BF)</option>
                        <option value="pasty">Pasty (Normal FF)</option>
                        <option value="watery">Watery</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" rows={2} placeholder="Any observations, rash, etc." />
                </div>

                <button onClick={editingId ? updateChange : addChange} className="w-full bg-gradient-to-r from-amber-500 to-orange-400 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
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
                      <button onClick={() => editChange(change)} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-amber-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteChange(change.id)} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-red-600">
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