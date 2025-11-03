import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, Clock, AlertCircle, Plus, Trash2, Syringe} from "lucide-react";

interface Vaccination {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
  notes: string;
}

const VaccinationReminders: React.FC = () => {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(() => {
    // Default vaccination schedule for first year
    const defaultVaccinations: Vaccination[] = [
      {
        id: "1",
        name: "Hepatitis B (1st dose)",
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        completed: false,
        notes: "Usually given at birth"
      },
      {
        id: "2",
        name: "DTaP (1st dose)",
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 months
        completed: false,
        notes: "Diphtheria, Tetanus, Pertussis"
      },
      {
        id: "3",
        name: "Hib (1st dose)",
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 months
        completed: false,
        notes: "Haemophilus influenzae type b"
      },
      {
        id: "4",
        name: "IPV (1st dose)",
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 months
        completed: false,
        notes: "Polio"
      },
      {
        id: "5",
        name: "PCV13 (1st dose)",
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 months
        completed: false,
        notes: "Pneumococcal conjugate"
      },
      {
        id: "6",
        name: "RV (1st dose)",
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 months
        completed: false,
        notes: "Rotavirus"
      }
    ];
    return defaultVaccinations;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newVaccination, setNewVaccination] = useState({
    name: "",
    dueDate: "",
    notes: ""
  });

  const getStatus = (vaccination: Vaccination) => {
    if (vaccination.completed) return "completed";
    const dueDate = new Date(vaccination.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) return "overdue";
    if (dueDate.getTime() === today.getTime()) return "dueToday";
    if ((dueDate.getTime() - today.getTime()) <= 7 * 24 * 60 * 60 * 1000) return "dueSoon";
    return "upcoming";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "dueToday":
        return <Bell className="w-5 h-5 text-orange-500" />;
      case "dueSoon":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "overdue":
        return "Overdue";
      case "dueToday":
        return "Due Today";
      case "dueSoon":
        return "Due Soon";
      default:
        return "Upcoming";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "overdue":
        return "bg-red-50 border-red-200";
      case "dueToday":
        return "bg-orange-50 border-orange-200";
      case "dueSoon":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const toggleCompletion = (id: string) => {
    setVaccinations(vaccinations.map(vaccination => 
      vaccination.id === id 
        ? { 
            ...vaccination, 
            completed: !vaccination.completed,
            completedDate: !vaccination.completed ? new Date().toISOString().split('T')[0] : undefined
          }
        : vaccination
    ));
  };

  const addVaccination = () => {
    if (!newVaccination.name.trim() || !newVaccination.dueDate) return;

    const vaccination: Vaccination = {
      id: Date.now().toString(),
      name: newVaccination.name,
      dueDate: newVaccination.dueDate,
      completed: false,
      notes: newVaccination.notes
    };

    setVaccinations([...vaccinations, vaccination]);
    setNewVaccination({ name: "", dueDate: "", notes: "" });
    setIsAdding(false);
  };

  const deleteVaccination = (id: string) => {
    setVaccinations(vaccinations.filter(v => v.id !== id));
  };

  const upcomingVaccinations = vaccinations.filter(v => !v.completed);
  const completedVaccinations = vaccinations.filter(v => v.completed);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Syringe className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">Vaccination Reminders</h3>
      </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-4 py-2 rounded-lg hover:shadow-lg transition hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add Vaccination
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <h4 className="font-medium text-green-800 mb-4">Add New Vaccination</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vaccination Name *</label>
              <input
                type="text"
                value={newVaccination.name}
                onChange={(e) => setNewVaccination({ ...newVaccination, name: e.target.value })}
                placeholder="e.g., MMR, Chickenpox, Flu shot"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
              <input
                type="date"
                value={newVaccination.dueDate}
                onChange={(e) => setNewVaccination({ ...newVaccination, dueDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={newVaccination.notes}
                onChange={(e) => setNewVaccination({ ...newVaccination, notes: e.target.value })}
                placeholder="Additional information..."
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addVaccination}
                disabled={!newVaccination.name.trim() || !newVaccination.dueDate}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Vaccination
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewVaccination({ name: "", dueDate: "", notes: "" });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Vaccinations */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-bloomBlack mb-4">Upcoming Vaccinations</h4>
        {upcomingVaccinations.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
            <p className="text-gray-600">All vaccinations are completed! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingVaccinations.map((vaccination) => {
              const status = getStatus(vaccination);
              return (
                <div
                  key={vaccination.id}
                  className={`border rounded-xl p-4 ${getStatusColor(status)} transition-all hover:shadow-md`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(status)}
                      <div>
                        <h5 className="font-semibold text-gray-800">{vaccination.name}</h5>
                        <p className="text-sm text-gray-600">
                          Due: {new Date(vaccination.dueDate).toLocaleDateString()}
                        </p>
                        {vaccination.notes && (
                          <p className="text-sm text-gray-700 mt-1">{vaccination.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        status === "overdue" ? "bg-red-100 text-red-800" :
                        status === "dueToday" ? "bg-orange-100 text-orange-800" :
                        status === "dueSoon" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {getStatusText(status)}
                      </span>
                      <button
                        onClick={() => toggleCompletion(vaccination.id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Mark as completed"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteVaccination(vaccination.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Vaccinations */}
      {completedVaccinations.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Completed Vaccinations</h4>
          <div className="space-y-3">
            {completedVaccinations.map((vaccination) => (
              <div
                key={vaccination.id}
                className="bg-green-50 border border-green-200 rounded-xl p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-800">{vaccination.name}</h5>
                      <p className="text-sm text-gray-600">
                        Completed: {vaccination.completedDate ? new Date(vaccination.completedDate).toLocaleDateString() : 'N/A'}
                      </p>
                      {vaccination.notes && (
                        <p className="text-sm text-gray-700 mt-1">{vaccination.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Completed
                    </span>
                    <button
                      onClick={() => toggleCompletion(vaccination.id)}
                      className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                      title="Mark as incomplete"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteVaccination(vaccination.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationReminders;