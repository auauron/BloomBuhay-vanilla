import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Edit3, Trash2, Calendar, Clock, Plus, Loader } from "lucide-react";
import { Album, Photo } from "./types";
import PhotoDetailModal from "./PhotoDetailModal";

interface AlbumDetailProps {
  album: Album;
  onClose: () => void;
  onAddPhotos: (albumId: string, photos: File[]) => Promise<boolean>;
  onUpdatePhoto: (albumId: string, photo: Photo) => void;
  onDeletePhoto: (albumId: string, photoId: string) => void;
  onUpdateAlbum: (album: Album) => void;
  onUploadComplete?: () => void;
}

const AlbumDetail: React.FC<AlbumDetailProps> = ({
  album,
  onClose,
  onAddPhotos,
  onUpdatePhoto,
  onDeletePhoto,
  onUpdateAlbum,
  onUploadComplete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  useEffect(() => {
    if (showEditSuccess) {
      const timer = setTimeout(() => setShowEditSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showEditSuccess]);

  useEffect(() => {
    if (showDeleteSuccess) {
      const timer = setTimeout(() => setShowDeleteSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showDeleteSuccess]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setIsUploading(true);
      try {
        const success = await onAddPhotos(album.id, files);
        
        if (success) {
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          onClose();
          if (onUploadComplete) {
            onUploadComplete();
          }
        }
      } catch (error) {
        console.error("Failed to upload photos:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleUpdatePhoto = async (albumId: string, updatedPhoto: Photo) => {
    await onUpdatePhoto(albumId, updatedPhoto);
  };

  const handleDeletePhoto = async (albumId: string, photoId: string) => {
    await onDeletePhoto(albumId, photoId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{album.title}</h2>
            <p className="text-gray-600 mt-1">{album.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isUploading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Created: {formatDate(album.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Updated: {formatDate(album.lastUpdated)} at {formatTime(album.lastUpdated)}</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Photos ({album.photos.length})
              {isUploading && (
                <span className="ml-2 text-sm text-bloomPink font-normal">
                  <Loader className="w-4 h-4 inline animate-spin mr-1" />
                  Uploading...
                </span>
              )}
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isUploading ? "Uploading..." : "Add Photos"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </div>
        </div>

        <div className="p-6">
          {album.photos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No photos yet</h3>
              <p className="text-gray-500">Add your first photo to this album</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {album.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={typeof photo.file === 'string' ? photo.file : URL.createObjectURL(photo.file)}
                    alt={photo.name || 'Photo'}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                      <Edit3 className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-sm">View & Edit</span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h4 className="font-medium text-gray-800 truncate">
                      {photo.name || 'Unnamed Photo'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(photo.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <PhotoDetailModal
          photo={selectedPhoto}
          albumId={album.id}
          onClose={() => setSelectedPhoto(null)}
          onUpdate={handleUpdatePhoto}
          onDelete={handleDeletePhoto}
          onEditComplete={() => {
            setShowEditSuccess(true);
            onClose(); 
          }}
          onDeleteComplete={() => {
            setShowDeleteSuccess(true);
            onClose(); 
          }}
        />
      )}

      {showEditSuccess && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Changes saved successfully!</span>
          </div>
        </div>
      )}

      {showDeleteSuccess && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Photo deleted successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumDetail;