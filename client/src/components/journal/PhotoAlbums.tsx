import React, { useState } from "react";
import { Edit3, Trash2, Image, Calendar, Clock, Eye } from "lucide-react";
import EditAlbumModal from "./EditAlbumModal";
import AlbumDetail from "./AlbumDetail";
import { Album } from "./types";

interface PhotoAlbumsProps {
  albums: Album[];
  onUpdateAlbum: (album: Album) => void;
  onDeleteAlbum: (id: string) => void;
  onAddPhotos: (albumId: string, photos: File[]) => Promise<boolean>; // change to async
  onUpdatePhoto: (albumId: string, photo: any) => void;
  onDeletePhoto: (albumId: string, photoId: string) => void;
}
const PhotoAlbums: React.FC<PhotoAlbumsProps> = ({
  albums,
  onUpdateAlbum,
  onDeleteAlbum,
  onAddPhotos,
  onUpdatePhoto,
  onDeletePhoto
}) => {
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [viewingAlbum, setViewingAlbum] = useState<Album | null>(null);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false); // bag o

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to get the current album from albums state
  const getCurrentAlbum = (albumId: string) => {
    return albums.find(album => album.id === albumId) || null;
  };

  if (albums.length === 0) {
    return (
      <div className="text-center py-12">
        <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No albums yet</h3>
        <p className="text-gray-500">Create your first album to start preserving memories</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <div 
            key={album.id} 
            className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
          >
            {/* Cover Photo  */}
            <div 
              className="relative h-48 bg-gray-200 overflow-hidden cursor-pointer flex-shrink-0"
              onClick={() => setViewingAlbum(getCurrentAlbum(album.id))}
            >
              {album.coverPhoto ? (
                <img 
                  src={album.coverPhoto} 
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-bloomPink/20 to-bloomYellow/20 flex items-center justify-center">
                  <Image className="w-12 h-12 text-gray-400" />
                  <span className="sr-only">No cover photo</span>
                </div>
              )}
              <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                <Image className="w-3 h-3 inline mr-1" />
                {album.photos.length}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <Eye className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Album Info*/}
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2 flex-shrink-0">
                <h3 className="font-semibold text-gray-800 text-lg truncate flex-1 mr-2">{album.title}</h3>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingAlbum(getCurrentAlbum(album.id));
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete "${album.title}"? This action cannot be undone.`)) {
                        onDeleteAlbum(album.id);
                      }
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="mb-3 flex-1 min-h-[3rem]">
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {album.description || "No description"}
                </p>
              </div>

              {/* Dates*/}
              <div className="space-y-1 text-xs text-gray-500 border-t border-gray-100 pt-3 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Created: {formatDate(album.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Updated: {formatDate(album.lastUpdated)}</span>
                </div>
              </div>

              {/* View Album Button */}
              <button
                onClick={() => setViewingAlbum(getCurrentAlbum(album.id))}
                className="w-full mt-3 bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex-shrink-0"
              >
                View Album
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Album Modal */}
      {editingAlbum && (
        <EditAlbumModal
          album={editingAlbum}
          onClose={() => setEditingAlbum(null)}
          onUpdate={onUpdateAlbum}
        />
      )}

      {/* Album Detail Modal */}
      {viewingAlbum && (
        <AlbumDetail
          key={viewingAlbum.id + viewingAlbum.photos.length}
          album={viewingAlbum}
          onClose={() => setViewingAlbum(null)}
          onAddPhotos={onAddPhotos}
          onUpdatePhoto={onUpdatePhoto}
          onDeletePhoto={onDeletePhoto}
          onUpdateAlbum={onUpdateAlbum}
          onUploadComplete={() => setShowUploadSuccess(true)}
        />
      )}

      {/* Success Message Popup */}
      {showUploadSuccess && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Photos uploaded successfully!</span>
          </div>
          <button 
            onClick={() => setShowUploadSuccess(false)}
            className="absolute top-1 right-1 text-white hover:text-gray-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};


export default PhotoAlbums;