import React, { useEffect, useState } from "react";
import { Plus, Stethoscope, Calendar, User, FileText, Pill, Trash2, Edit3, Save, X } from "lucide-react";
import { bbtoolsService, CreateDoctorVisitRequest, DoctorVisitLog } from "../../../services/BBToolsService";

interface PediatricVisitLocal {
  id: string;
  date: string;
  doctor: string;
  reason: string;
  weight: number;
  height: number;
  headCircumference: number;
  diagnosis: string;
  prescriptions: string;
  notes: string;
  nextVisit?: string;
}

const PediatricVisitNotes: React.FC<{ doctorVisits?: DoctorVisitLog[]; onRefresh?: () => void }> = ({ doctorVisits = [], onRefresh }) => {
  const [visits, setVisits] = useState<PediatricVisitLocal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    doctor: '',
    reason: '',
    weight: '',
    height: '',
    headCircumference: '',
    diagnosis: '',
    prescriptions: '',
    notes: '',
    nextVisit: ''
  });

  useEffect(() => {
    const mapped = (doctorVisits || []).map((d) => ({
      id: String(d.id),
      date: d.visitDate || '',
      doctor: d.doctor || '',
      reason: d.reason || '',
      weight: d.weight || 0,
      height: d.height || 0,
      headCircumference: d.headCircumference || 0,
      diagnosis: d.diagnosis || '',
      prescriptions: d.prescriptions || '',
      notes: d.notes || '',
      nextVisit: d.nextVisit || '',
    }));
    setVisits(mapped);
  }, [doctorVisits]);

  const addVisit = async () => {
    if (!formData.date || !formData.doctor || !formData.reason) return;

    const payload: CreateDoctorVisitRequest = {
      visitDate: formData.date,
      reason: formData.reason,
      doctor: formData.doctor,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      headCircumference: formData.headCircumference ? parseFloat(formData.headCircumference) : undefined,
      diagnosis: formData.diagnosis,
      prescriptions: formData.prescriptions,
      notes: formData.notes,
      nextVisit: formData.nextVisit || undefined,
    };

    const tempId = Date.now().toString();
    const optimistic: PediatricVisitLocal = {
      id: tempId,
      date: payload.visitDate,
      doctor: formData.doctor,
      reason: formData.reason,
      weight: Number(payload.weight || 0),
      height: Number(payload.height || 0),
      headCircumference: Number(payload.headCircumference || 0),
      diagnosis: payload.diagnosis || '',
      prescriptions: payload.prescriptions || '',
      notes: payload.notes || '',
      nextVisit: payload.nextVisit,
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
    if (!editingId || !formData.date || !formData.doctor || !formData.reason) return;

    const payload: Partial<CreateDoctorVisitRequest> = {
      visitDate: formData.date,
      reason: formData.reason,
      doctor: formData.doctor,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      headCircumference: formData.headCircumference ? parseFloat(formData.headCircumference) : undefined,
      diagnosis: formData.diagnosis,
      prescriptions: formData.prescriptions,
      notes: formData.notes,
      nextVisit: formData.nextVisit || undefined,
    };

    const snapshot = visits;
    setVisits((prev) => prev.map((v) => v.id === editingId ? { ...v, date: payload.visitDate!, doctor: payload.doctor!, reason: payload.reason!, weight: Number(payload.weight || 0), height: Number(payload.height || 0), headCircumference: Number(payload.headCircumference || 0), diagnosis: payload.diagnosis || '', prescriptions: payload.prescriptions || '', notes: payload.notes || '', nextVisit: payload.nextVisit } : v));

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
      doctor: visit.doctor,
      reason: visit.reason,
      weight: String(visit.weight || ''),
      height: String(visit.height || ''),
      headCircumference: String(visit.headCircumference || ''),
      diagnosis: visit.diagnosis,
      prescriptions: visit.prescriptions,
      notes: visit.notes,
      nextVisit: visit.nextVisit || ''
    });
    setEditingId(visit.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ date: '', doctor: '', reason: '', weight: '', height: '', headCircumference: '', diagnosis: '', prescriptions: '', notes: '', nextVisit: '' });
    setShowForm(false);
    setEditingId(null);
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
                    <div className="font-semibold text-blue-800">{new Date(visit.nextVisit!).toLocaleDateString()}</div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visit Date</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                  <input type="text" value={formData.doctor} onChange={(e) => setFormData({...formData, doctor: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Dr. Name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                  <input type="text" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Well-baby checkup, etc." />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="3.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                    <input type="number" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Head (cm)</label>
                    <input type="number" step="0.1" value={formData.headCircumference} onChange={(e) => setFormData({...formData, headCircumference: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="35" />
                  </div>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Visit Date</label>
                  <input type="date" value={formData.nextVisit} onChange={(e) => setFormData({...formData, nextVisit: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>

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
                        <div className="font-semibold text-gray-800 text-lg">{new Date(visit.date).toLocaleDateString()}</div>
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
                            {visit.nextVisit && (<div><strong>Next Visit:</strong> {new Date(visit.nextVisit).toLocaleDateString()}</div>)}
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
                          <h5 className="font-semibold text-gray-700 mb-2">Measurements</h5>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-center p-2 bg-white rounded-lg border"><div className="font-semibold text-gray-800">{visit.weight} kg</div><div className="text-gray-600">Weight</div></div>
                            <div className="text-center p-2 bg-white rounded-lg border"><div className="font-semibold text-gray-800">{visit.height} cm</div><div className="text-gray-600">Height</div></div>
                            <div className="text-center p-2 bg-white rounded-lg border"><div className="font-semibold text-gray-800">{visit.headCircumference} cm</div><div className="text-gray-600">Head</div></div>
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