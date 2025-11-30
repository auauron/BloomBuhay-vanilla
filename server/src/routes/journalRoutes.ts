import { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";

const router = Router();
const db = new PrismaClient();

db.$connect()
  .then(() => {})
  .catch((err) => console.error("Database connection failed:", err));
// CRUD

// NOTES ROUTE
// this get all the user notes
router.get(
  "/notes",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const notes = await db.journalEntry.findMany({
        where: { motherId: userId },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json({ success: true, data: notes });
    } catch (error) {
      console.error("Get notes error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch notes" });
    }
  }
);

// this creates user notes
router.post(
  "/notes",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      const { title, content, photoUrl, tags, mood } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      if (!title || !title.trim()) {
        res.status(400).json({ success: false, error: "Title is required" });
        return;
      }

      if (!content || !content.trim()) {
        res.status(400).json({ success: false, error: "Content is required" });
        return;
      }

      const note = await db.journalEntry.create({
        data: {
          motherId: userId,
          title: title.trim(),
          content: content.trim(),
          photoUrl: photoUrl || null,
          tags: tags || [],
          mood: mood || null,
        },
      });
      res.status(201).json({ success: true, data: note });
    } catch (error) {
      // Improve error logging
      console.error("Get notes error details:", {
        error: error instanceof Error ? error.message : error,
        userId: req.userId,
        stack: error instanceof Error ? error.stack : undefined,
      });

      res.status(500).json({
        success: false,
        error: "Failed to fetch notes",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }
);

// this updates the notes
router.patch(
  "/notes/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      const noteId = parseInt(req.params.id);
      const { title, content, photoUrl, tags, mood } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      if (isNaN(noteId)) {
        res.status(400).json({ success: false, error: "Invalid note ID" });
        return;
      }

      const existingNote = await db.journalEntry.findFirst({
        where: { id: noteId, motherId: userId },
      });

      if (!existingNote) {
        res.status(404).json({ success: false, error: "Note not found" });
        return;
      }

      const note = await db.journalEntry.update({
        where: { id: noteId },
        data: {
          title: title?.trim || existingNote.title,
          content: content?.trim || existingNote.content,
          photoUrl: photoUrl !== undefined ? photoUrl : existingNote.photoUrl,
          tags: tags !== undefined ? tags : existingNote.tags,
          mood: mood !== undefined ? mood : existingNote.mood,
        },
      });

      res.status(200).json({ success: true, data: note });
    } catch (err) {
      console.error("Update note error:", err);
      res.status(500).json({ success: false, error: "Update note failed" });
    }
  }
);

// this deletes the user's note
router.delete(
  "/notes/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      const noteId = parseInt(req.params.id);

      if (!userId) {
        res.status(401).json({ success: false, errro: "Unauthorized" });
        return;
      }

      if (isNaN(noteId)) {
        res.status(400).json({ success: false, error: "Invalid note" });
        return;
      }

      const existingNote = await db.journalEntry.findFirst({
        where: { id: noteId, motherId: userId },
      });

      if (!existingNote) {
        res.status(404).json({ success: false, error: "Note not found" });
        return;
      }

      await db.journalEntry.delete({ where: { id: noteId } });

      res
        .status(200)
        .json({ success: true, message: "Note deleted successfuly" });
    } catch (e) {
      console.error("Delete note error:", e);
      res.status(500).json({ succes: false, error: "Delete note failed" });
    }
  }
);

// ALBUM ROUTE

// this gets the user's album

router.get(
  "/albums",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const albums = await db.album.findMany({
        where: { motherId: userId },
        include: { photos: true },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json({ success: true, data: albums });
    } catch (e) {
      console.error("Get albums error:", e);
      res.status(500).json({ success: false, error: "Failed to fetch albums" });
    }
  }
);

// this creates album
router.post(
  "/albums",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      const { title, coverPhoto, description } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      if (!title || !title.trim()) {
        res.status(400).json({ success: false, error: "Title is required" });
        return;
      }

      const album = await db.album.create({
        data: {
          motherId: userId,
          title: title.trim(),
          coverPhoto: coverPhoto || null,
          description: description?.trim() || null,
        },
        include: { photos: true },
      });

      res.status(201).json({ success: true, data: album });
    } catch (e) {
      console.error("Create album error:", e);
      res.status(500).json({ success: false, error: "Failed to create album" });
    }
  }
);

// this updates the album
router.patch(
  "/albums/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      const albumId = parseInt(req.params.id);
      const { title, coverPhoto, description } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const existingAlbum = await db.album.findFirst({
        where: { id: albumId, motherId: userId },
      });

      if (!existingAlbum) {
        res.status(404).json({ success: false, error: "Album not" });
        return;
      }

      const album = await db.album.update({
        where: { id: albumId },
        data: {
          title: title?.trim() || existingAlbum.title,
          coverPhoto:
            coverPhoto !== undefined ? coverPhoto : existingAlbum.coverPhoto,
          description:
            description !== undefined
              ? description?.trim()
              : existingAlbum.description,
        },
        include: { photos: true },
      });

      res.status(200).json({ success: true, data: album });
    } catch (error) {
      console.error("Update album error", error);
      res.status(500).json({ success: false, error: "Failed to update album" });
    }
  }
);

router.delete(
  "/albums/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      const albumId = parseInt(req.params.id);

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      if (isNaN(albumId)) {
        res.status(400).json({ success: false, error: "Invalid album" });
        return;
      }

      const existingAlbum = await db.album.findFirst({
        where: { id: albumId, motherId: userId },
      });

      if (!existingAlbum) {
        res.status(404).json({ success: false, error: "Album not found" });
        return;
      }
      await db.album.delete({ where: { id: albumId } });

      res.status(200).json({ success: true, message: "Album deleted" });
    } catch (error) {
      console.error("Delete album error:", error);
      res.status(500).json({ success: false, error: "Failed to delete " });
    }
  }
);

// PHOTO ROUTES
router.post(
  "/albums/:albumId/photos",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      const albumId = parseInt(req.params.albumId);
      const { photos } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      if (isNaN(albumId)) {
        res.status(400).json({ success: false, error: "Invalid album" });
        return;
      }

      const existingAlbum = await db.album.findFirst({
        where: { id: albumId, motherId: userId },
      });

      if (!existingAlbum) {
        res.status(404).json({ success: false, error: "Album not found" });
        return;
      }

      if (!photos || !Array.isArray(photos) || photos.length == 0) {
        res
          .status(400)
          .json({ success: false, errror: "Photo array is required" });
        return;
      }

      // Create photos
      const createdPhotos = await db.photo.createMany({
        data: photos.map((photo: any) => ({
          albumId,
          fileUrl: photo.fileUrl,
          name: photo.name || null,
          notes: photo.notes || null,
        })),
      });

      // Fetch the album with all photos
      const updatedAlbum = await db.album.findUnique({
        where: { id: albumId },
        include: { photos: true },
      });

      res.status(201).json({ success: true, data: updatedAlbum });
    } catch (error) {
      console.error("Add photos error:", error);
      res.status(500).json({ success: false, error: "Failed to add photos" });
    }
  }
);

router.patch(
  "/photos/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      const photoId = parseInt(req.params.id);
      const { name, notes } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized " });
        return;
      }

      if (isNaN(photoId)) {
        res.status(400).json({ success: false, error: "Invalid photo ID" });
        return;
      }

      // very photo if belong to user
      const existingPhoto = await db.photo.findFirst({
        where: { id: photoId },
        include: { album: true },
      });

      if (!existingPhoto || existingPhoto.album.motherId !== userId) {
        res.status(404).json({ success: false, error: "Photo not found" });
        return;
      }

      const photo = await db.photo.update({
        where: { id: photoId },
        data: {
          name: name !== undefined ? name : existingPhoto.name,
          notes: notes !== undefined ? notes : existingPhoto.notes,
        },
      });

      res.status(200).json({ success: true, data: photo });
    } catch (error) {
      console.error("Update photo error:", error);
      res.status(500).json({ success: false, error: "Failed to update photo" });
    }
  }
);

router.delete(
  "/photos/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      const photoId = parseInt(req.params.id);

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized " });
        return;
      }

      if (isNaN(photoId)) {
        res.status(400).json({ success: false, error: "Invalid photo ID" });
        return;
      }

      const existingPhoto = await db.photo.findFirst({
        where: { id: photoId },
        include: { album: true },
      });

      if (!existingPhoto || existingPhoto.album.motherId !== userId) {
        res.status(404).json({ success: false, error: "Photo not found" });
        return;
      }

      await db.photo.delete({ where: { id: photoId } });

      res
        .status(200)
        .json({ success: true, message: "Photo deleted succesfully" });
    } catch (error) {
      console.error("Delete photo error:", error);
      res.status(500).json({ success: false, error: "Failed to delete" });
    }
  }
);

export default router;
