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
    const motherId: number | undefined = req.userId;
    if (!motherId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    let metrics: HealthMetric[] = [];
    try {
      metrics = await db.healthMetric.findMany({
        where: { motherId },
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
        where: { motherId },
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
        where: { motherId },
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

// Create a new health metric
router.post("/metrics", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const motherId = req.userId!;
    const { title, value, unit, change, trend, color, category } = req.body;

    const metric = await db.healthMetric.create({
      data: { motherId, title, value, unit, change, trend, color, category },
    });

    res.status(201).json({ success: true, data: metric });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to create metric" });
  }
});

// Create a new mood
router.post("/moods", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const motherId = req.userId!;
    const { mood, notes } = req.body;

    const newMood = await db.healthMood.create({
      data: { motherId, mood, notes },
    });

    res.status(201).json({ success: true, data: newMood });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to add mood" });
  }
});

// Create a new symptom
router.post("/symptoms", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const motherId = req.userId!;
    const { name, severity, notes } = req.body;

    const symptom = await db.healthSymptom.create({
      data: { motherId, name, severity, notes },
    });

    res.status(201).json({ success: true, data: symptom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to add symptom" });
  }
});
export default router;
