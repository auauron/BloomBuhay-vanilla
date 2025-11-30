import React, { useEffect, useState } from "react";
import { Plus, Stethoscope, Calendar, User, FileText, Pill, Trash2, Edit3, Save, X, Clock } from "lucide-react";
import { bbtoolsService, CreateDoctorVisitRequest, DoctorVisitLog } from "../../../services/BBToolsService";
import DateTimePicker from "../../ui/DateTimePicker";

interface PediatricVisitLocal {
  id: string;
  date: string;
  time: string;
  doctor: string;
  reason: string;
  diagnosis: string;
  prescriptions: string;
  notes: string;
  nextVisit?: string;
  nextVisitTime?: string;
}

const PediatricVisitNotes: React.FC<{ doctorVisits?: DoctorVisitLog[]; onRefresh?: () => void }> = ({ doctorVisits = [], onRefresh }) => {
  const [visits, setVisits] = useState<PediatricVisitLocal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    doctor: '',
    reason: '',
    diagnosis: '',
    prescriptions: '',
    notes: '',
    nextVisit: '',
    nextVisitTime: ''
  });

  useEffect(() => {
    const mapped = (doctorVisits || []).map((d) => {
      // Parse visit date/time
      const visitDate = d.visitDate ? new Date(d.visitDate) : new Date();
      const nextVisitDate = d.nextVisit ? new Date(d.nextVisit) : undefined;
      
      return {
        id: String(d.id),
        date: visitDate.toISOString().split('T')[0],
        time: visitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        doctor: d.doctor || '',
        reason: d.reason || '',
        diagnosis: d.diagnosis || '',
        prescriptions: d.prescriptions || '',
        notes: d.notes || '',
        nextVisit: nextVisitDate ? nextVisitDate.toISOString().split('T')[0] : '',
        nextVisitTime: nextVisitDate ? nextVisitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
      };
    });
    setVisits(mapped);
  }, [doctorVisits]);

  const addVisit = async () => {
    if (!formData.date || !formData.time || !formData.doctor || !formData.reason) return;

    // Combine visit date and time
    const visitDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
    
    // Combine next visit date and time if provided
    let nextVisitDateTime = undefined;
    if (formData.nextVisit && formData.nextVisitTime) {
      nextVisitDateTime = new Date(`${formData.nextVisit}T${formData.nextVisitTime}`).toISOString();
    } else if (formData.nextVisit) {
      // Default to start of day if no time provided
      nextVisitDateTime = new Date(`${formData.nextVisit}T00:00:00`).toISOString();
    }

    const payload: CreateDoctorVisitRequest = {
      visitDate: visitDateTime,
      reason: formData.reason,
      doctor: formData.doctor,
      diagnosis: formData.diagnosis,
      prescriptions: formData.prescriptions,
      notes: formData.notes,
      nextVisit: nextVisitDateTime,
    };

    const tempId = Date.now().toString();
    const optimistic: PediatricVisitLocal = {
      id: tempId,
      date: formData.date,
      time: formData.time,
      doctor: formData.doctor,
      reason: formData.reason,
      diagnosis: payload.diagnosis || '',
      prescriptions: payload.prescriptions || '',
      notes: payload.notes || '',
      nextVisit: formData.nextVisit,
      nextVisitTime: formData.nextVisitTime,
    };
    setVisits((prev) => [optimistic, ...prev]);

    const res = await bbtoolsService.addDoctorVisit(payload);
    if (!res.success) {
      setVisits((prev) => prev.filter((v) => v.id !== tempId));
      console.error('Failed to add doctor visit', res.error);
      return;
    }
    if (onRefresh) onRefresh();
    resetForm();
  };

  const updateVisit = async () => {
    if (!editingId || !formData.date || !formData.time || !formData.doctor || !formData.reason) return;

    // Combine visit date and time
    const visitDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
    
    // Combine next visit date and time if provided
    let nextVisitDateTime = undefined;
    if (formData.nextVisit && formData.nextVisitTime) {
      nextVisitDateTime = new Date(`${formData.nextVisit}T${formData.nextVisitTime}`).toISOString();
    } else if (formData.nextVisit) {
      // Default to start of day if no time provided
      nextVisitDateTime = new Date(`${formData.nextVisit}T00:00:00`).toISOString();
    }

    const payload: Partial<CreateDoctorVisitRequest> = {
      visitDate: visitDateTime,
      reason: formData.reason,
      doctor: formData.doctor,
      diagnosis: formData.diagnosis,
      prescriptions: formData.prescriptions,
      notes: formData.notes,
      nextVisit: nextVisitDateTime,
    };

    const snapshot = visits;
    setVisits((prev) => prev.map((v) => v.id === editingId ? { 
      ...v, 
      date: formData.date,
      time: formData.time,
      doctor: formData.doctor, 
      reason: formData.reason, 
      diagnosis: payload.diagnosis || '', 
      prescriptions: payload.prescriptions || '', 
      notes: payload.notes || '', 
      nextVisit: formData.nextVisit,
      nextVisitTime: formData.nextVisitTime
    } : v));

    const res = await bbtoolsService.updateDoctorVisit(editingId, payload);
    if (!res.success) {
      setVisits(snapshot);
      console.error('Failed to update doctor visit', res.error);
      return;
    }
    setEditingId(null);
    resetForm();
    if (onRefresh) onRefresh();
  };

  const deleteVisit = async (id: string) => {
    const snapshot = visits;
    setVisits((prev) => prev.filter((v) => v.id !== id));
    const res = await bbtoolsService.deleteDoctorVisit(id);
    if (!res.success) {
      setVisits(snapshot);
      console.error('Failed to delete doctor visit', res.error);
    } else {
      if (onRefresh) onRefresh();
    }
  };

  const editVisit = (visit: PediatricVisitLocal) => {
    setFormData({
      date: visit.date,
      time: visit.time,
      doctor: visit.doctor,
      reason: visit.reason,
      diagnosis: visit.diagnosis,
      prescriptions: visit.prescriptions,
      notes: visit.notes,
      nextVisit: visit.nextVisit || '',
      nextVisitTime: visit.nextVisitTime || ''
    });
    setEditingId(visit.id);
    setShowForm(true);
  };

  const resetForm = () => {
    const now = new Date();
    setFormData({ 
      date: now.toISOString().split('T')[0], 
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      doctor: '', 
      reason: '', 
      diagnosis: '', 
      prescriptions: '', 
      notes: '', 
      nextVisit: '',
      nextVisitTime: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const upcomingVisits = visits.filter(v => v.nextVisit && new Date(v.nextVisit) > new Date());

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Pediatric Visit Notes</h3>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upcoming & Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upcoming Visits */}
          {upcomingVisits.length > 0 && (
            <div className="bg-white rounded-2xl border border-blue-200 p-6">
              <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Visits
              </h4>
              <div className="space-y-3">
                {upcomingVisits.map((visit) => (
                  <div key={visit.id} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="font-semibold text-blue-800">
                      {formatDateTime(visit.nextVisit!, visit.nextVisitTime || '00:00')}
                    </div>
                    <div className="text-sm text-blue-700">{visit.reason}</div>
                    <div className="text-xs text-blue-600">With {visit.doctor}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visit Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">{editingId ? 'Edit Visit' : 'New Visit'}</h4>
              {showForm && (
                <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>

            {!showForm ? (
              <button onClick={() => setShowForm(true)} className="w-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Add Visit
              </button>
            ) : (
              <div className="space-y-4">
                {/* Visit DateTime Picker */}
                <DateTimePicker
                  date={formData.date}
                  time={formData.time}
                  onDateChange={(date) => setFormData({...formData, date})}
                  onTimeChange={(time) => setFormData({...formData, time})}
                  dateLabel="Visit Date"
                  timeLabel="Visit Time"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                  <input type="text" value={formData.doctor} 
                  onChange={(e) => setFormData({...formData, doctor: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Dr. Name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                  <input type="text" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Well-baby checkup, etc." />
                </div>

                <div className="grid grid-cols-3 gap-2">
                
         
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                  <input type="text" value={formData.diagnosis} onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Healthy, common cold, etc." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prescriptions</label>
                  <textarea value={formData.prescriptions} onChange={(e) => setFormData({...formData, prescriptions: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" rows={2} placeholder="Medications, dosage, frequency..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor's Notes</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" rows={3} placeholder="Observations, recommendations, follow-up instructions..." />
                </div>

                {/* Next Visit DateTime Picker */}
                <DateTimePicker
                  date={formData.nextVisit}
                  time={formData.nextVisitTime}
                  onDateChange={(date) => setFormData({...formData, nextVisit: date})}
                  onTimeChange={(time) => setFormData({...formData, nextVisitTime: time})}
                  dateLabel="Next Visit Date"
                  timeLabel="Next Visit Time"
                />
              </div>
            )}
            
            {showForm && (
              <div className="mt-4">
                <button onClick={editingId ? updateVisit : addVisit} className="w-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update Visit' : 'Save Visit'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Visits List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Visit History</h4>
            {visits.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Stethoscope className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No pediatric visits recorded yet</p>
                <p className="text-sm">Add your first visit to keep track of medical records</p>
              </div>
            ) : (
              <div className="space-y-6">
                {visits.map((visit) => (
                  <div key={visit.id} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-semibold text-gray-800 text-lg">
                          {formatDateTime(visit.date, visit.time)}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <User className="w-4 h-4" />
                          {visit.doctor}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => editVisit(visit)} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-indigo-600">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteVisit(visit.id)} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Visit Details
                          </h5>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div><strong>Reason:</strong> {visit.reason}</div>
                            <div><strong>Diagnosis:</strong> {visit.diagnosis || 'Not specified'}</div>
                            {visit.nextVisit && (
                              <div>
                                <strong>Next Visit:</strong> {formatDateTime(visit.nextVisit, visit.nextVisitTime || '00:00')}
                              </div>
                            )}
                          </div>
                        </div>

                        {visit.prescriptions && (
                          <div>
                            <h5 className="font-semibold text-gray-700 mb-2">
                              <Pill className="w-4 h-4" />
                              Prescriptions
                            </h5>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{visit.prescriptions}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                          </div>
                        </div>

                        {visit.notes && (
                          <div>
                            <h5 className="font-semibold text-gray-700 mb-2">Notes</h5>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{visit.notes}</p>
                          </div>
                        )}
                      </div>
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

export default PediatricVisitNotes;