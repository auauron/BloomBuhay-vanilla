import React, { useEffect, useState } from "react";
import { Plus, Syringe, Calendar, CheckCircle, Clock, AlertTriangle, Trash2, Edit3, Save, X } from "lucide-react";
import { bbtoolsService, CreateVaccinationLogRequest, VaccinationLog } from "../../../services/BBToolsService";

interface VaccineLocal {
  id: string;
  name: string;
  scheduledDate: string;
  administeredDate?: string;
  status: 'scheduled' | 'completed' | 'overdue';
  notes: string;
  dose: string;
}

const VaccinationTracker: React.FC<{ vaccinations?: VaccinationLog[]; onRefresh?: () => void }> = ({ vaccinations = [], onRefresh }) => {
  const [vaccines, setVaccines] = useState<VaccineLocal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    scheduledDate: '',
    administeredDate: '',
    status: 'scheduled' as 'scheduled' | 'completed' | 'overdue',
    notes: '',
    dose: ''
  });

  useEffect(() => {
    const mapped = (vaccinations || []).map((v) => ({
      id: String(v.id),
      name: v.vaccineName || '',
      scheduledDate: v.date || '',
      administeredDate: v.administeredDate || undefined,
      status: (v.status || 'scheduled') as any,
      notes: v.notes || '',
      dose: v.dose || '',
    }));
    setVaccines(mapped);
  }, [vaccinations]);

  const commonVaccines = [
    { name: 'Hepatitis B', doses: ['Birth', '1-2 months', '6-18 months'] },
    { name: 'DTaP', doses: ['2 months', '4 months', '6 months', '15-18 months', '4-6 years'] },
    { name: 'IPV', doses: ['2 months', '4 months', '6-18 months', '4-6 years'] },
    { name: 'Hib', doses: ['2 months', '4 months', '6 months', '12-15 months'] },
    { name: 'PCV13', doses: ['2 months', '4 months', '6 months', '12-15 months'] },
    { name: 'RV', doses: ['2 months', '4 months', '6 months'] },
    { name: 'MMR', doses: ['12-15 months', '4-6 years'] },
    { name: 'Varicella', doses: ['12-15 months', '4-6 years'] },
  ];

  const addVaccine = async () => {
    if (!formData.name || !formData.scheduledDate) return;

    const payload: CreateVaccinationLogRequest = {
      vaccineName: formData.name,
      dose: formData.dose,
      date: formData.scheduledDate,
      administeredDate: formData.status === 'completed' ? (formData.administeredDate || new Date().toISOString().split('T')[0]) : undefined,
      status: formData.status,
      notes: formData.notes,
    };

    // optimistic
    const tempId = Date.now().toString();
    const optimistic: VaccineLocal = { id: tempId, name: formData.name, scheduledDate: formData.scheduledDate, administeredDate: payload.administeredDate, status: formData.status, notes: formData.notes, dose: formData.dose };
    setVaccines((prev) => [optimistic, ...prev]);

    const res = await bbtoolsService.addVaccination(payload);
    if (!res.success) {
      setVaccines((prev) => prev.filter((v) => v.id !== tempId));
      console.error('Failed to add vaccination', res.error);
      return;
    }
    if (onRefresh) onRefresh();
    resetForm();
  };

  const updateVaccine = async () => {
    if (!editingId || !formData.name || !formData.scheduledDate) return;
    const payload: Partial<CreateVaccinationLogRequest> = {
      vaccineName: formData.name,
      dose: formData.dose,
      date: formData.scheduledDate,
      administeredDate: formData.status === 'completed' ? (formData.administeredDate || new Date().toISOString().split('T')[0]) : undefined,
      status: formData.status,
      notes: formData.notes,
    };

    const snapshot = vaccines;
    setVaccines((prev) => prev.map((v) => v.id === editingId ? { ...v, name: formData.name, scheduledDate: formData.scheduledDate, administeredDate: payload.administeredDate, status: formData.status, notes: formData.notes, dose: formData.dose } : v));
    const res = await bbtoolsService.updateVaccination(editingId, payload);
    if (!res.success) {
      setVaccines(snapshot);
      console.error('Failed to update vaccination', res.error);
      return;
    }
    setEditingId(null);
    resetForm();
    if (onRefresh) onRefresh();
  };

  const deleteVaccine = async (id: string) => {
    const snapshot = vaccines;
    setVaccines((prev) => prev.filter((v) => v.id !== id));
    const res = await bbtoolsService.deleteVaccination(id);
    if (!res.success) {
      setVaccines(snapshot);
      console.error('Failed to delete vaccination', res.error);
    } else {
      if (onRefresh) onRefresh();
    }
  };

  const editVaccine = (vaccine: VaccineLocal) => {
    setFormData({ name: vaccine.name, scheduledDate: vaccine.scheduledDate, administeredDate: vaccine.administeredDate || '', status: vaccine.status, notes: vaccine.notes, dose: vaccine.dose });
    setEditingId(vaccine.id);
    setShowForm(true);
  };

  const markAsCompleted = (id: string) => {
    setVaccines(prev => prev.map(v => 
      v.id === id ? { ...v, status: 'completed', administeredDate: new Date().toISOString().split('T')[0] } : v
    ));
  };

  const resetForm = () => {
    setFormData({ name: '', scheduledDate: '', administeredDate: '', status: 'scheduled', notes: '', dose: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getCardClasses = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 border-green-200';
      case 'overdue': return 'bg-red-50 border-red-200';
      default: return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getIconWrapper = (status: string) => {
    switch (status) {
      case 'completed': return 'p-2 bg-green-100 text-green-600 rounded-lg';
      case 'overdue': return 'p-2 bg-red-100 text-red-600 rounded-lg';
      default: return 'p-2 bg-yellow-100 text-yellow-600 rounded-lg';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const upcomingVaccines = vaccines.filter(v => v.status === 'scheduled');
  const completedVaccines = vaccines.filter(v => v.status === 'completed');
  const overdueVaccines = vaccines.filter(v => v.status === 'overdue');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Syringe className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Vaccination Tracker</h3>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stats & Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-2xl border border-green-200 p-6">
            <h4 className="font-semibold text-green-800 mb-4">Vaccination Summary</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedVaccines.length}</div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{upcomingVaccines.length}</div>
                <div className="text-sm text-yellow-700">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{overdueVaccines.length}</div>
                <div className="text-sm text-red-700">Overdue</div>
              </div>
            </div>
          </div>

          {/* Vaccine Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">
                {editingId ? 'Edit Vaccine' : 'Add Vaccine'}
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
                Add Vaccine
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vaccine Name</label>
                  <select value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Select Vaccine</option>
                    {commonVaccines.map(vaccine => (
                      <option key={vaccine.name} value={vaccine.name}>{vaccine.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dose</label>
                  <select value={formData.dose} onChange={(e) => setFormData({...formData, dose: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Select Dose</option>
                    {commonVaccines.find(v => v.name === formData.name)?.doses.map(dose => (
                      <option key={dose} value={dose}>{dose}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                  <input type="date" value={formData.scheduledDate} onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                {formData.status === 'completed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Administered Date</label>
                    <input type="date" value={formData.administeredDate} onChange={(e) => setFormData({...formData, administeredDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none" rows={2} placeholder="Reactions, doctor notes, etc." />
                </div>

                <button onClick={editingId ? updateVaccine : addVaccine} className="w-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update Vaccine' : 'Save Vaccine'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Vaccines List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Vaccines */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-600" />
              Upcoming Vaccinations
            </h4>
            {upcomingVaccines.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming vaccinations</p>
            ) : (
              <div className="space-y-3">
                {upcomingVaccines.map((vaccine) => (
                  <div key={vaccine.id} className={`flex items-center justify-between p-4 rounded-xl border ${getCardClasses(vaccine.status)}`}>
                    <div className="flex items-center gap-4">
                      <div className={getIconWrapper(vaccine.status)}>
                        {getStatusIcon(vaccine.status)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 flex items-center gap-2">
                          {vaccine.name}
                        </div>
                        <div className="text-sm text-gray-600">Dose: {vaccine.dose} • Scheduled: {new Date(vaccine.scheduledDate).toLocaleDateString()}</div>
                        {vaccine.notes && <p className="text-sm text-gray-700 mt-1">{vaccine.notes}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editVaccine(vaccine)} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-green-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteVaccine(vaccine.id)} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overdue Vaccines */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Overdue Vaccinations
            </h4>
            {overdueVaccines.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No overdue vaccinations</p>
            ) : (
              <div className="space-y-3">
                {overdueVaccines.map((vaccine) => (
                  <div key={vaccine.id} className={`flex items-center justify-between p-4 rounded-xl border ${getCardClasses(vaccine.status)}`}>
                    <div className="flex items-center gap-4">
                      <div className={getIconWrapper(vaccine.status)}>
                        {getStatusIcon(vaccine.status)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 flex items-center gap-2">
                          {vaccine.name}
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">Overdue</span>
                        </div>
                        <div className="text-sm text-gray-600">Dose: {vaccine.dose} • Scheduled: {new Date(vaccine.scheduledDate).toLocaleDateString()}</div>
                        {vaccine.notes && <p className="text-sm text-gray-700 mt-1">{vaccine.notes}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editVaccine(vaccine)} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-green-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteVaccine(vaccine.id)} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Vaccines */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Completed Vaccinations
            </h4>
            {completedVaccines.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No completed vaccinations</p>
            ) : (
              <div className="space-y-3">
                {completedVaccines.map((vaccine) => (
                  <div key={vaccine.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{vaccine.name}</div>
                        <div className="text-sm text-gray-600">Dose: {vaccine.dose} • Completed: {new Date(vaccine.administeredDate!).toLocaleDateString()}</div>
                        {vaccine.notes && <p className="text-sm text-gray-700 mt-1">{vaccine.notes}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editVaccine(vaccine)} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-green-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteVaccine(vaccine.id)} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-red-600">
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

export default VaccinationTracker;