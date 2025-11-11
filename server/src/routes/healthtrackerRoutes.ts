import { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { PrismaClient, HealthMetric, HealthMood, HealthSymptom } from "@prisma/client";

const router = Router();
const db = new PrismaClient();

/**
 * GET /api/healthtracker
 * Returns metrics, moods, and symptoms for authenticated user.
 */
router.get("/", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId: number | undefined = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    let metrics: HealthMetric[] = [];
    try {
      metrics = await db.healthMetric.findMany({
        where: { userId },
        orderBy: [
          { updatedAt: "desc" },
          { createdAt: "desc" },
        ],
      });
    } catch (err) {
      console.warn("Failed to fetch metrics, returning empty array", err);
      metrics = [];
    }

    let moods: HealthMood[] = [];
    try {
      moods = await db.healthMood.findMany({
        where: { userId },
        orderBy: [{ createdAt: "desc" }],
        take: 20,
      });
    } catch (err) {
      console.warn("Failed to fetch moods, returning empty array", err);
      moods = [];
    }

    let symptoms: HealthSymptom[] = [];
    try {
      symptoms = await db.healthSymptom.findMany({
        where: { userId },
        orderBy: [{ createdAt: "desc" }],
        take: 50,
      });
    } catch (err) {
      console.warn("Failed to fetch symptoms, returning empty array", err);
      symptoms = [];
    }

    res.status(200).json({ success: true, data: { metrics, moods, symptoms } });
  } catch (error) {
    console.error("Get health data error:", error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: "failed to fetch health data" });
  }
});
export default router;
