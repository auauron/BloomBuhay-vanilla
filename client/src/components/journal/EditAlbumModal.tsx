import React, { useState, useEffect } from "react";
import { X, Camera } from "lucide-react";
import { Album } from "./types";


// interface Album {
//   id: string;
//   title: string;
//   coverPhoto: string;
//   description: string;
// }

interface EditAlbumModalProps {
  album: Album;
  onClose: () => void;
  onUpdate: (album: Album) => void;
}

const EditAlbumModal: React.FC<EditAlbumModalProps> = ({ album, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    coverPhoto: "",
    description: ""
  });

  useEffect(() => {
    setFormData({
      title: album.title,
      coverPhoto: album.coverPhoto,
      description: album.description
    });
  }, [album]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onUpdate({
      ...album,
      ...formData
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit Album</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Album Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Photo URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={formData.coverPhoto}
                onChange={(e) => setFormData({ ...formData, coverPhoto: e.target.value })}
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
              />
              {formData.coverPhoto && (
                <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
                  <img 
                    src={formData.coverPhoto} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={!formData.title.trim()}
              className="flex-1 bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Update Album
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAlbumModal;