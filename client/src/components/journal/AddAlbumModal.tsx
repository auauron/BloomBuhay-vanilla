import React, { useState, useRef } from "react";
import { X, Camera, Upload, Loader } from "lucide-react"; // Add Loader icon
import { Album } from "./types";

interface AddAlbumModalProps {
  onClose: () => void;
  onAdd: (album: Omit<Album, 'id' | 'photos' | 'createdAt' | 'lastUpdated'>) => Promise<boolean>; // Change to async
}

const AddAlbumModal: React.FC<AddAlbumModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverPhoto(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || isLoading) return;

    setIsLoading(true);
    
    try {
      const success = await onAdd({
        ...formData,
        coverPhoto: coverPhoto || "/assets/albumCovers/cover1.png" // Default cover
      });
      
      if (success) {
        onClose(); // Only close on success
      }
      // If failed, the modal stays open and user can try again
    } catch (error) {
      console.error("Failed to create album:", error);
      // Modal stays open on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isLoading ? "Creating Album..." : "Create New Album"}
          </h2>
          {!isLoading && ( // Only show close button when not loading
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          )}
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
              placeholder="e.g., Baby's First Month"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bloomPink focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isLoading} // Disable during loading
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Photo
            </label>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-bloomPink hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent"
                disabled={isLoading} // Disable during loading
              >
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-gray-600">
                  {coverPhoto ? coverPhoto.name : 'Click to upload cover photo'}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isLoading} // Disable during loading
              />
              {coverPhoto && (
                <div className="w-full h-32 bg-gray-200 rounded-xl overflow-hidden">
                  <img 
                    src={URL.createObjectURL(coverPhoto)} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave empty for a default cover photo
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this album..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bloomPink focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading} // Disable during loading
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={!formData.title.trim() || isLoading}
              className="flex-1 bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Album"
              )}
            </button>
            {!isLoading && ( // Only show cancel button when not loading
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAlbumModal;