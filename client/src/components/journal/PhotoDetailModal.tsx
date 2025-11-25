import React, { useState } from "react";
import { X, Edit3, Trash2, Calendar, Clock, Save } from "lucide-react";
import { Photo } from "./types";

interface PhotoDetailModalProps {
  photo: Photo;
  albumId: string;
  onClose: () => void;
  onUpdate: (albumId: string, photo: Photo) => void;
  onDelete: (albumId: string, photoId: string) => void;
}

const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  photo,
  albumId,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: photo.name || '',
    notes: photo.notes || ''
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(albumId, {
        ...photo,
        name: formData.name,
        notes: formData.notes
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      onDelete(albumId, photo.id);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Photo name"
                className="text-xl font-semibold border-b border-gray-300 focus:border-bloomPink focus:outline-none"
              />
            ) : (
              <h2 className="text-xl font-semibold text-gray-800">
                {photo.name || 'Unnamed Photo'}
              </h2>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isSaving}
              className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Photo */}
          <div className="flex justify-center">
            <img
              src={typeof photo.file === 'string' ? photo.file : URL.createObjectURL(photo.file)}
              alt={photo.name || 'Photo'}
              className="max-w-full max-h-96 object-contain rounded-xl shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Dates */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Photo Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {formatDate(photo.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Uploaded: {formatDate(photo.uploadedAt)} at {formatTime(photo.uploadedAt)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Notes</h3>
              {isEditing ? (
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add notes about this photo..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bloomPink focus:border-transparent resize-none"
                  disabled={isSaving}
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-line">
                  {photo.notes || 'No notes added yet.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailModal;