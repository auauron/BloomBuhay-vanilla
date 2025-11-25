import React, { useState, useEffect } from "react";
import { X, Camera, Upload, Image } from "lucide-react";
import { Album } from "./types";

interface EditAlbumModalProps {
  album: Album;
  onClose: () => void;
  onUpdate: (album: Album) => void;
}

const EditAlbumModal: React.FC<EditAlbumModalProps> = ({ album, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });
  const [coverPhoto, setCoverPhoto] = useState<string>("");

  useEffect(() => {
    setFormData({
      title: album.title,
      description: album.description
    });
    setCoverPhoto(album.coverPhoto);
  }, [album]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onUpdate({
      ...album,
      ...formData,
      coverPhoto: coverPhoto 
    });
    onClose();
  };

  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverPhoto = () => {
    // Set to empty string to use default cover
    setCoverPhoto("");
  };

  const isUsingDefaultCover = coverPhoto === "";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-bloomPink">Edit Album</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Album Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Album Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
              placeholder="Enter album title"
              required
            />
          </div>

          {/* Cover Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cover Photo
            </label>
            
            {/* Current Cover Photo Preview */}
            {!isUsingDefaultCover && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Cover:</p>
                <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                  <img 
                    src={coverPhoto} 
                    alt="Current cover" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-bloomPink transition-colors bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center">
                {!isUsingDefaultCover ? (
                  <Image className="w-10 h-10 text-bloomPink mb-2" />
                ) : (
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                )}
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {!isUsingDefaultCover ? 'Change Cover Photo' : 'Upload Cover Photo'}
                </p>
                <p className="text-xs text-gray-500 text-center">
                  Click to browse images<br />
                  <span className="text-gray-400">PNG, JPG, JPEG up to 5MB</span>
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleCoverPhotoUpload}
              />
            </label>

            {/* Remove Photo Button - ALWAYS SHOW IF THERE'S A COVER PHOTO */}
            {!isUsingDefaultCover && (
              <button
                type="button"
                onClick={removeCoverPhoto}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Remove Cover Photo
              </button>
            )}

            {/* Default Cover State */}
            {isUsingDefaultCover && (
              <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 mt-3">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-medium">Using Default Cover</p>
                <p className="text-xs text-gray-500 mt-1">
                  Upload a photo to set a custom cover
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
              placeholder="Add a description for your album..."
            />
          </div>

          {/* Action Buttons */}
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