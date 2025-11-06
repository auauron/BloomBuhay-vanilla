import React, { useState } from "react";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import PhotoAlbums from "../components/journal/PhotoAlbums";
import NotesList from "../components/journal/NotesList";
import AddAlbumModal from "../components/journal/AddAlbumModal";
import AddNoteModal from "../components/journal/AddNoteModal";
import { Camera, BookOpen, Plus } from "lucide-react";
import { Note, Album, Photo } from "../components/journal/types";

export default function Journal() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"albums" | "notes">("albums");
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  
  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const [albums, setAlbums] = useState<Album[]>([
    {
      id: "1",
      title: "First Ultrasound",
      coverPhoto: "/assets/albumCovers/ultrasound.png",
      photos: [
        {
          id: "1-1",
          file: "/assets/albumCovers/ultrasound.png",
          name: "First Glimpse",
          notes: "Our first ultrasound at 8 weeks!",
          createdAt: "2024-01-15T10:30:00",
          uploadedAt: "2024-01-15T10:30:00"
        }
      ],
      createdAt: "2024-01-15T10:30:00",
      lastUpdated: "2024-01-20T14:25:00",
      description: "Our first glimpse of our little one 💕"
    },
    
  ]);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "First Kick Feeling",
      content: "Felt the first kicks today! It was the most amazing sensation. Little one was very active around 8 PM after dinner. So excited to meet you baby! 💫",
      createdAt: "2024-01-25T20:30:00",
      lastUpdated: "2024-01-25T20:30:00",
      tags: ["milestone", "excited"],
      mood: "happy"
    }
  ]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const addAlbum = async (albumData: any) => {
    let coverPhoto = albumData.coverPhoto;
    
    // If cover photo is a File object, convert to base64
    if (albumData.coverPhoto instanceof File) {
      coverPhoto = await fileToBase64(albumData.coverPhoto);
    }

    const newAlbum: Album = {
      ...albumData,
      id: Date.now().toString(),
      coverPhoto,
      photos: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    setAlbums([newAlbum, ...albums]);
  };

  const addNote = async (noteData: any) => {
    let photo = noteData.photo;
    
    // If photo is a File object, convert to base64
    if (noteData.photo instanceof File) {
      photo = await fileToBase64(noteData.photo);
    }

    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      photo,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
  };

  const updateNote = async (updatedNote: Note) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, lastUpdated: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const updateAlbum = (updatedAlbum: Album) => {
    setAlbums(albums.map(album => 
      album.id === updatedAlbum.id 
        ? { ...updatedAlbum, lastUpdated: new Date().toISOString() }
        : album
    ));
  };

  const deleteAlbum = (id: string) => {
    setAlbums(albums.filter(album => album.id !== id));
  };

  // Add photos to album
  const addPhotosToAlbum = async (albumId: string, photoFiles: File[]) => {
    const newPhotos: Photo[] = await Promise.all(
      photoFiles.map(async (file) => ({
        id: `${albumId}-${Date.now()}-${Math.random()}`,
        file: await fileToBase64(file),
        name: file.name.split('.')[0], // Use filename without extension as default name
        notes: "",
        createdAt: new Date().toISOString(),
        uploadedAt: new Date().toISOString()
      }))
    );

    setAlbums(albums.map(album => 
      album.id === albumId 
        ? { 
            ...album, 
            photos: [...album.photos, ...newPhotos],
            lastUpdated: new Date().toISOString()
          }
        : album
    ));
  };

  // Update photo in album
  const updatePhotoInAlbum = (albumId: string, updatedPhoto: Photo) => {
    setAlbums(albums.map(album => 
      album.id === albumId 
        ? {
            ...album,
            photos: album.photos.map(photo =>
              photo.id === updatedPhoto.id ? updatedPhoto : photo
            ),
            lastUpdated: new Date().toISOString()
          }
        : album
    ));
  };

  // Delete photo from album
  const deletePhotoFromAlbum = (albumId: string, photoId: string) => {
    setAlbums(albums.map(album => 
      album.id === albumId 
        ? {
            ...album,
            photos: album.photos.filter(photo => photo.id !== photoId),
            lastUpdated: new Date().toISOString()
          }
        : album
    ));
  };

  return (
    <div className="flex flex-col h-screen font-poppins bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Page Header */}
        <div className="text-center py-8 px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-2xl shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-bloomPink to-bloomYellow">
              Memory Journal
            </h1>
          </div>
          <p className="text-bloomBlack font-rubik text-lg font-light max-w-2xl mx-auto">
            Preserve your precious moments, thoughts, and milestones with your little one
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("albums")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === "albums"
                    ? "bg-gradient-to-r from-bloomPink to-bloomYellow text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Camera className="w-5 h-5" />
                <span className="font-medium">Photo Albums</span>
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === "notes"
                    ? "bg-gradient-to-r from-bloomPink to-bloomYellow text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Notes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add New Button */}
        <div className="flex justify-center mb-8 px-4">
          {activeTab === "albums" ? (
            <button
              onClick={() => setShowAddAlbum(true)}
              className="group bg-bloomPink/90 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gradient-to-r from-bloomPink to-bloomYellow hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-lg"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Create New Album</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddNote(true)}
              className="group bg-bloomPink/90 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gradient-to-r from-bloomPink to-bloomYellow hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-lg"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Write New Note</span>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="px-4 pb-12 max-w-7xl mx-auto">
          {activeTab === "albums" ? (
            <PhotoAlbums 
              albums={albums}
              onUpdateAlbum={updateAlbum}
              onDeleteAlbum={deleteAlbum}
              onAddPhotos={addPhotosToAlbum}
              onUpdatePhoto={updatePhotoInAlbum}
              onDeletePhoto={deletePhotoFromAlbum}
            />
          ) : (
            <NotesList 
              notes={notes}
              onUpdateNote={updateNote}
              onDeleteNote={deleteNote}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddAlbum && (
        <AddAlbumModal 
          onClose={() => setShowAddAlbum(false)}
          onAdd={addAlbum}
        />
      )}

      {showAddNote && (
        <AddNoteModal 
          onClose={() => setShowAddNote(false)}
          onAdd={addNote}
        />
      )}
    </div>
  );
}