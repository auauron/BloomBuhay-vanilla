import { authService } from "./authService";
import { Note, Album, Photo } from "../components/journal/types";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/journal` || "http://localhost:3000/api/journal";

// TYPE DEFINITIONS

export interface ApiNote {
    id: number;
    motherId: number;
    title: string;
    content: string;
    photoUrl: string | null;
    tags: string[];
    mood: string | null;
    createdAt: string;
    lastUpdated: string;
}

export interface ApiAlbum{
    id: number;
    motherId: number;
    title: string;
    coverPhoto: string | null;
    description: string | null;
    createdAt: string;
    lastUpdated: string;
    photos: ApiPhoto[];
}

export interface ApiPhoto{
    id: number;
    albumId: number;
    fileUrl: string;
    name: string | null;
    notes: string | null;
    createdAt: string;
    uploadedAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string
}

// helper function

function convertApiNoteToNote(apiNote: ApiNote): Note {
    return {
        id: apiNote.id.toString(),
        title: apiNote.title,
        content: apiNote.content,
        photo: apiNote.photoUrl || undefined,
        createdAt: apiNote.createdAt,
        lastUpdated: apiNote.lastUpdated,
        tags: apiNote.tags || [],
        mood: apiNote.mood || "",
    }
}

function convertApiPhotoToPhoto(apiPhoto: ApiPhoto): Photo {
  return {
    id: apiPhoto.id.toString(),
    file: apiPhoto.fileUrl,
    name: apiPhoto.name || undefined,
    notes: apiPhoto.notes || undefined,
    createdAt: apiPhoto.createdAt,
    uploadedAt: apiPhoto.uploadedAt,
  };
}

function convertApiAlbumToAlbum(apiAlbum: ApiAlbum): Album {
  return {
    id: apiAlbum.id.toString(),
    title: apiAlbum.title,
    coverPhoto: apiAlbum.coverPhoto || "",
    photos: apiAlbum.photos.map(convertApiPhotoToPhoto),
    createdAt: apiAlbum.createdAt,
    lastUpdated: apiAlbum.lastUpdated,
    description: apiAlbum.description || "",
  };
}

// journal service

export const journalService = {
    async getNotes(): Promise<ApiResponse<Note[]>> {
        try {
            const token = authService.getToken();
            if(!token) {
                return { success: false, error: "Not authenticated"}
            }

            const response = await fetch(`${API_URL}/notes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });

            const result = await response.json();
            if (result.success && result.data) {
                result.data = result.data.map(convertApiNoteToNote);
            }
            return result;
        } catch (e) {
            console.error("Get notes error", e);
            return{success: false, error: "Failed to fetch notes"};
        }
    },

    async createNote(noteData:{
        title: string;
        content: string;
        photo?: string;
        tags?: string[],
        mood?: string;
    }): Promise<ApiResponse<Note>> {
        try {
            const token = authService.getToken();
            if (!token) {
                return { success: false, error: "Not authenticated"};
            }

            const response = await fetch(`${API_URL}/notes`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                title: noteData.title,
                content: noteData.content,
                photoUrl: noteData.photo || null,
                tags: noteData.tags || [],
                mood: noteData.mood || null,
                }),
            });

            const result = await response.json();
            if (result.success && result.data) {
                result.data = convertApiNoteToNote(result.data);
            }

            return result;
        } catch (e) {
            console.error("Create not error:", e);
            return { success: false, error: "Failed to create note"}
        }
    },

    async updateNote(
        noteId: string,
        noteData: Partial<{
        title: string;
        content: string;
        photo: string;
        tags: string[];
        mood: string;
        }>
    ): Promise<ApiResponse<Note>> {
        try {
        const token = authService.getToken();
        if (!token) {
            return { success: false, error: "Not authenticated" };
        }

        const response = await fetch(`${API_URL}/notes/${noteId}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
            title: noteData.title,
            content: noteData.content,
            photoUrl: noteData.photo,
            tags: noteData.tags,
            mood: noteData.mood,
            }),
        });

        const result = await response.json();
        if (result.success && result.data) {
            result.data = convertApiNoteToNote(result.data);
        }
        return result;
        } catch (error) {
        console.error("Update note error:", error);
        return { success: false, error: "Failed to update note" };
        }
    },

    async deleteNote(noteId: string): Promise<ApiResponse<void>> {
        try {
            const token = authService.getToken();
            if (!token) {
                return { success: false, error: "Not authenticated" };
            }

            const response = await fetch(`${API_URL}/notes/${noteId}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();
            return result;
        } catch (error) {
        console.error("Delete note error:", error);
        return { success: false, error: "Failed to delete note" };
        }
    },


    //  album API

    async getAlbums(): Promise<ApiResponse<Album[]>> {
        try {
        const token = authService.getToken();
        if (!token) {
            return { success: false, error: "Not authenticated" };
        }

        const response = await fetch(`${API_URL}/albums`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();
        if (result.success && result.data) {
            result.data = result.data.map(convertApiAlbumToAlbum);
        }
        return result;
        } catch (error) {
        console.error("Get albums error:", error);
        return { success: false, error: "Failed to fetch albums" };
        }
    },

    async createAlbum(albumData: {
        title: string;
        coverPhoto?: string;
        description?: string;
    }): Promise<ApiResponse<Album>> {
        try {
        const token = authService.getToken();
        if (!token) {
            return { success: false, error: "Not authenticated" };
        }

        const response = await fetch(`${API_URL}/albums`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
            title: albumData.title,
            coverPhoto: albumData.coverPhoto || null,
            description: albumData.description || null,
            }),
        });

        const result = await response.json();
        if (result.success && result.data) {
            result.data = convertApiAlbumToAlbum(result.data);
        }
        return result;
        } catch (error) {
        console.error("Create album error:", error);
        return { success: false, error: "Failed to create album" };
        }
    },

    async updateAlbum(
        albumId: string,
        albumData: Partial<{
        title: string;
        coverPhoto: string;
        description: string;
        }>
    ): Promise<ApiResponse<Album>> {
        try {
        const token = authService.getToken();
        if (!token) {
            return { success: false, error: "Not authenticated" };
        }

        const response = await fetch(`${API_URL}/albums/${albumId}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(albumData),
        });

        const result = await response.json();
        if (result.success && result.data) {
            result.data = convertApiAlbumToAlbum(result.data);
        }
        return result;
        } catch (error) {
        console.error("Update album error:", error);
        return { success: false, error: "Failed to update album" };
        }
    },

    async deleteAlbum(albumId: string): Promise<ApiResponse<void>> {
    try {
        const token = authService.getToken();
        if (!token) {
            return { success: false, error: "Not authenticated" };
        }

        console.log(`Deleting album ${albumId} from ${API_URL}/album/${albumId}`);
        
        const response = await fetch(`${API_URL}/album/${albumId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Delete response status:', response.status);

        if (response.status === 404) {
            return { success: false, error: "Album not found" };
        }

        if (!response.ok) {
            const errorText = await response.text();
            return { 
                success: false, 
                error: errorText || `HTTP error! status: ${response.status}`
            };
        }

        // Success case - no content expected
        return { success: true, data: undefined };

    } catch (error) {
        console.error("Delete album error:", error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Failed to delete album" 
        };
    }
},
    // PHOTOS API

    async addPhotosToAlbum(
        albumId: string,
        photos: Array<{ fileUrl: string; name?: string; notes?: string }>
    ): Promise<ApiResponse<Album>> {
        try {
        const token = authService.getToken();
        if (!token) {
            return { success: false, error: "Not authenticated" };
        }

        const response = await fetch(`${API_URL}/albums/${albumId}/photos`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ photos }),
        });

        const result = await response.json();
        if (result.success && result.data) {
            result.data = convertApiAlbumToAlbum(result.data);
        }
        return result;
        } catch (error) {
        console.error("Add photos error:", error);
        return { success: false, error: "Failed to add photos" };
        }
    },

    async updatePhoto(
        photoId: string,
        photoData: { name?: string; notes?: string }
    ): Promise<ApiResponse<Photo>> {
        try {
        const token = authService.getToken();
        if (!token) {
            return { success: false, error: "Not authenticated" };
        }

        const response = await fetch(`${API_URL}/photos/${photoId}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(photoData),
        });

        const result = await response.json();
        if (result.success && result.data) {
            result.data = convertApiPhotoToPhoto(result.data);
        }
        return result;
        } catch (error) {
        console.error("Update photo error:", error);
        return { success: false, error: "Failed to update photo" };
        }
    },

    async deletePhoto(photoId: string): Promise<ApiResponse<void>> {
        try {
        const token = authService.getToken();
        if (!token) {
            return { success: false, error: "Not authenticated" };
        }

        const response = await fetch(`${API_URL}/photos/${photoId}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();
        return result;
        } catch (error) {
        console.error("Delete photo error:", error);
        return { success: false, error: "Failed to delete photo" };
        }
    },

}