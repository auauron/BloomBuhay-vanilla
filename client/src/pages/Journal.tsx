import React, { useState, useMemo, useCallback, useEffect } from "react";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import PhotoAlbums from "../components/journal/PhotoAlbums";
import NotesList from "../components/journal/NotesList";
import AddAlbumModal from "../components/journal/AddAlbumModal";
import AddNoteModal from "../components/journal/AddNoteModal";
import { Camera, Search, BookImage, NotebookPen, Plus } from "lucide-react";
import { Note, Album, Photo } from "../components/journal/types";
import { motion } from "framer-motion";
import { journalService } from "../services/journalService";

  // Memoized Search Bar Component to prevent unnecessary re-renders
  const GradientSearchBar = React.memo(({
    searchQuery,
    setSearchQuery,
    hasNoResults,
    activeTab
  }: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    hasNoResults: boolean;
    activeTab: "albums" | "notes";
  }) => {
    const [focused, setFocused] = useState(false);

    const placeholderText = activeTab === "albums"
      ? "Search albums, photos, notes..."
      : "Search notes, titles, tags...";

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    }, [setSearchQuery]);

    const clearSearch = useCallback(() => {
      setSearchQuery("");
    }, [setSearchQuery]);

    return (
      <div className="w-full max-w-2xl mx-auto mb-8 px-4">
        <div
          className={`w-full rounded-full p-[2px] transition-all duration-300 ${focused
              ? "bg-bloomWhite shadow-[0_0_12px_rgba(248,117,170,0.4)]"
              : "bg-gradient-to-r from-bloomPink to-bloomYellow"
            }`}
        >
          <div className="bg-white rounded-full relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bloomPink text-lg">
              <Search />
            </span>

            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={placeholderText}
              className="w-full rounded-full py-3 pl-12 pr-12 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
            />

            {hasNoResults && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-bloomPink transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  });

  GradientSearchBar.displayName = 'GradientSearchBar';

  export default function Journal() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"albums" | "notes">("albums");
    const [showAddAlbum, setShowAddAlbum] = useState(false);
    const [showAddNote, setShowAddNote] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Use useCallback for state setters to maintain reference stability
    const setSearchQueryMemoized = useCallback((query: string) => {
      setSearchQuery(query);
    }, []);

    const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
    const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
    const setActiveTabMemoized = useCallback((tab: "albums" | "notes") => setActiveTab(tab), []);

    // Helper function to convert File to base64
    const fileToBase64 = useCallback((file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    }, []);

    const [albums, setAlbums] = useState<Album[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data from backend on mount
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [albumsResponse, notesResponse] = await Promise.all([
            journalService.getAlbums(),
            journalService.getNotes(),
          ]);

          if (albumsResponse.success && albumsResponse.data) {
            setAlbums(albumsResponse.data);
          }

          if (notesResponse.success && notesResponse.data) {
            setNotes(notesResponse.data);
          }
        } catch (error) {
          console.error("Failed to fetch journal data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);

    // Optimized search with debouncing-like behavior using useMemo
    const filteredAlbums = useMemo(() => {
      if (!searchQuery.trim()) return albums;

      const query = searchQuery.toLowerCase();
      return albums.filter(album =>
        album.title.toLowerCase().includes(query) ||
        album.description.toLowerCase().includes(query) ||
        album.photos.some(photo =>
          (photo.name || "").toLowerCase().includes(query) ||
          (photo.notes || "").toLowerCase().includes(query)
        )
      );
    }, [albums, searchQuery]);

    const filteredNotes = useMemo(() => {
      if (!searchQuery.trim()) return notes;

      const query = searchQuery.toLowerCase();
      return notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (note.mood && note.mood.toLowerCase().includes(query))
      );
    }, [notes, searchQuery]);

    const hasNoResults = searchQuery.trim() !== "" &&
      ((activeTab === "albums" && filteredAlbums.length === 0) ||
        (activeTab === "notes" && filteredNotes.length === 0));

    // Memoized event handlers
    const addAlbum = useCallback(async (albumData: any) => {
      let coverPhoto = albumData.coverPhoto;

      if (albumData.coverPhoto instanceof File) {
        coverPhoto = await fileToBase64(albumData.coverPhoto);
      }

      const response = await journalService.createAlbum({
        title: albumData.title,
        coverPhoto,
        description: albumData.description,
      });

      if (response.success && response.data) {
        setAlbums(prev => [response.data!, ...prev]);
        return true; // Return success
      }
      return false; // Return failure
    }, [fileToBase64]);

    const addNote = useCallback(async (noteData: any) => {
      let photo = noteData.photo;

      if (noteData.photo instanceof File) {
        photo = await fileToBase64(noteData.photo);
      }

      const response = await journalService.createNote({
        title: noteData.title,
        content: noteData.content,
        photo,
        tags: noteData.tags,
        mood: noteData.mood,
      });

      if (response.success && response.data) {
        setNotes(prev => [response.data!, ...prev]);
        return true; // return success
      }
      return false; // return false on failure
    }, [fileToBase64]);

    const updateNote = useCallback(async (updatedNote: Note) => {
      const response = await journalService.updateNote(updatedNote.id, {
        title: updatedNote.title,
        content: updatedNote.content,
        photo: updatedNote.photo,
        tags: updatedNote.tags,
        mood: updatedNote.mood,
      });

      if (response.success && response.data) {
        setNotes(prev => prev.map(note =>
          note.id === updatedNote.id ? response.data! : note
        ));
        return true;
      }
      return false;
    }, []);

    const deleteNote = useCallback(async (id: string) => {
      const response = await journalService.deleteNote(id);
      if (response.success) {
        setNotes(prev => prev.filter(note => note.id !== id));
      }
    }, []);

    const updateAlbum = useCallback(async (updatedAlbum: Album) => {
      const response = await journalService.updateAlbum(updatedAlbum.id, {
        title: updatedAlbum.title,
        coverPhoto: updatedAlbum.coverPhoto,
        description: updatedAlbum.description,
      });

      if (response.success && response.data) {
        setAlbums(prev => prev.map(album =>
          album.id === updatedAlbum.id ? response.data! : album
        ));
        return true;
      }
      return false;
    }, []);

    const deleteAlbum = useCallback(async (id: string) => {


      if (window.confirm('Are you sure you want to delete this album?')) {
        setAlbums(prev => {
          const newAlbums = prev.filter(album => album.id !== id);

          return newAlbums;
        });

        try {
          const response = await journalService.deleteAlbum(id);


          if (!response.success) {
            console.warn('Server deletion failed, but album removed from local state:', response.error);
          }
        } catch (error) {
          console.warn('Network error during server deletion, but album removed from local state:', error);
        }
      }
    }, []);

  const addPhotosToAlbum = useCallback(async (albumId: string, photoFiles: File[]) => {
    console.log('Starting photo upload for album:', albumId);
    
    const photosData = await Promise.all(
      photoFiles.map(async (file) => ({
        fileUrl: await fileToBase64(file),
        name: file.name.split('.')[0],
        notes: "",
      }))
    );

    console.log('Calling API with photos data');
    const response = await journalService.addPhotosToAlbum(albumId, photosData);
    console.log('API response:', response);

    if (response.success && response.data) {
      console.log('Updating albums state with new data');
      setAlbums(prev => {
        const newAlbums = prev.map(album =>
          album.id === albumId ? response.data! : album
        );
        console.log('New albums state:', newAlbums);
        return newAlbums;
      });
      return true;
    }
    return false;
  }, [fileToBase64]);

    const updatePhotoInAlbum = useCallback(async (albumId: string, updatedPhoto: Photo) => {
      const response = await journalService.updatePhoto(updatedPhoto.id, {
        name: updatedPhoto.name,
        notes: updatedPhoto.notes,
      });

      if (response.success) {
        setAlbums(prev => prev.map(album =>
          album.id === albumId
            ? {
              ...album,
              photos: album.photos.map(photo =>
                photo.id === updatedPhoto.id ? updatedPhoto : photo
              ),
            }
            : album
        ));
      }
    }, []);

    const deletePhotoFromAlbum = useCallback(async (albumId: string, photoId: string) => {
      const response = await journalService.deletePhoto(photoId);

      if (response.success) {
        setAlbums(prev => prev.map(album =>
          album.id === albumId
            ? {
              ...album,
              photos: album.photos.filter(photo => photo.id !== photoId),
            }
            : album
        ));
      }
    }, []);
    // Memoized modal handlers
    const handleShowAddAlbum = useCallback(() => setShowAddAlbum(true), []);
    const handleShowAddNote = useCallback(() => setShowAddNote(true), []);
    const handleCloseAddAlbum = useCallback(() => setShowAddAlbum(false), []);
    const handleCloseAddNote = useCallback(() => setShowAddNote(false), []);

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col h-screen font-poppins bg-bloomWhite">
          <Header onMenuClick={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

          {isLoading ? (
            // Loading State
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloomPink mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your memories...</p>
              </div>
            </div>
          ) : (
            // Main Content
            <div className="flex-1 overflow-y-auto min-h-0">
              {/* Page Header */}
              <div className="text-center py-8 px-4">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-2xl shadow-lg">
                    <BookImage className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-clip-text text-bloomPink">
                    Memory Journal
                  </h1>
                </div>
                <p className="text-bloomBlack font-rubik text-lg font-light max-w-2xl mx-auto">
                  Preserve your precious moments, thoughts, and milestones with your little one
                </p>
              </div>

              {/* Search Bar */}
              <GradientSearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQueryMemoized}
                hasNoResults={hasNoResults}
                activeTab={activeTab}
              />

              {/* Tab Navigation */}
              <div className="flex justify-center mb-8 px-4">
                <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTabMemoized("albums")}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === "albums"
                          ? "bg-gradient-to-r from-bloomPink to-bloomYellow text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <Camera className="w-5 h-5" />
                      <span className="font-medium">Photo Albums</span>
                    </button>
                    <button
                      onClick={() => setActiveTabMemoized("notes")}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === "notes"
                          ? "bg-gradient-to-r from-bloomPink to-bloomYellow text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <NotebookPen className="w-5 h-5" />
                      <span className="font-medium">Notes</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Add New Button */}
              <div className="flex justify-center mb-8 px-4">
                {activeTab === "albums" ? (
                  <button
                    onClick={handleShowAddAlbum}
                    className="group bg-bloomPink/90 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gradient-to-r from-bloomPink to-bloomYellow hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-lg"
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Create New Album</span>
                  </button>
                ) : (
                  <button
                    onClick={handleShowAddNote}
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
                    albums={filteredAlbums}
                    onUpdateAlbum={updateAlbum}
                    onDeleteAlbum={deleteAlbum}
                    onAddPhotos={addPhotosToAlbum}
                    onUpdatePhoto={updatePhotoInAlbum}
                    onDeletePhoto={deletePhotoFromAlbum}
                  />
                ) : (
                  <NotesList
                    notes={filteredNotes}
                    onUpdateNote={updateNote}
                    onDeleteNote={deleteNote}
                  />
                )}
              </div>
            </div>
          )}

          {/* Modals */}
          {showAddAlbum && (
            <AddAlbumModal
              onClose={handleCloseAddAlbum}
              onAdd={addAlbum} 
            />
          )}

          {showAddNote && (
            <AddNoteModal
              onClose={handleCloseAddNote}
              onAdd={addNote}
            />
          )}
        </div>
      </motion.div>
    );
  }