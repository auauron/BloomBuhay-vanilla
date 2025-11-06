import React, { useState, useRef } from "react";
import { X, Upload, Camera, Loader } from "lucide-react";

interface AddPhotoModalProps {
  onClose: () => void;
  onAdd: (photos: Array<{ file: File; name: string; notes: string }>) => void;
}

const AddPhotoModal: React.FC<AddPhotoModalProps> = ({ onClose, onAdd }) => {
  const [selectedFiles, setSelectedFiles] = useState<Array<{
    file: File;
    name: string;
    notes: string;
    preview: string;
  }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    const newPhotos = files.map(file => ({
      file,
      name: file.name.split('.')[0], // Use filename without extension as default name
      notes: "",
      preview: URL.createObjectURL(file)
    }));

    setSelectedFiles(prev => [...prev, ...newPhotos]);
    
    // Reset file input to allow selecting same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updatePhoto = (index: number, updates: Partial<{ name: string; notes: string }>) => {
    setSelectedFiles(prev => 
      prev.map((photo, i) => 
        i === index ? { ...photo, ...updates } : photo
      )
    );
  };

  const removePhoto = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview); // Clean up memory
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    onAdd(selectedFiles.map(({ file, name, notes }) => ({
      file,
      name,
      notes
    })));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Photos ({selectedFiles.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Upload Section */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-3 w-full p-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-bloomPink hover:bg-pink-50 transition-colors group"
            >
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3 group-hover:text-bloomPink transition-colors" />
                <div className="text-gray-600">
                  <p className="font-semibold text-lg">Click to select photos</p>
                  <p className="text-sm mt-1">or drag and drop files here</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Supports JPG, PNG, HEIC - Max 10MB per photo
                </p>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,image/heic,image/heif"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Selected Photos Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-800 text-lg">
                Selected Photos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                {selectedFiles.map((photo, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    {/* Photo Preview */}
                    <div className="flex gap-4 mb-3">
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={photo.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Photo Info Form */}
                      <div className="flex-1 space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Photo Name
                          </label>
                          <input
                            type="text"
                            value={photo.name}
                            onChange={(e) => updatePhoto(index, { name: e.target.value })}
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloomPink focus:border-transparent"
                            placeholder="Enter photo name..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Notes
                          </label>
                          <textarea
                            value={photo.notes}
                            onChange={(e) => updatePhoto(index, { notes: e.target.value })}
                            rows={2}
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloomPink focus:border-transparent resize-none"
                            placeholder="Add notes about this photo..."
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {photo.file.name} • {(photo.file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={selectedFiles.length === 0}
              className="flex-1 bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Upload {selectedFiles.length} Photo{selectedFiles.length !== 1 ? 's' : ''}
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

export default AddPhotoModal;