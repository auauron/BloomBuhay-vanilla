import { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { PrismaClient, HealthMetric, HealthMood, HealthSymptom } from "@prisma/client";

const router = Router();
const db = new PrismaClient();

function formatDisplayDateFromDate(d: Date): string {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const timeString = d.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" });

  if (d.toDateString() === now.toDateString()) return `Today, ${timeString}`;
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${timeString}`;
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${timeString}`;
}

function mapSeverityToIntensity(severity?: string): "Low" | "Medium" | "High" {
  const s = (severity || "").toLowerCase();
  if (s === "high") return "High";
  if (s === "medium") return "Medium";
  return "Low";
}

/**
 * GET /api/healthtracker
 */
router.get("/", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const motherId: number | undefined = req.userId;
    if (!motherId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    // Metrics
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

    // Moods
    let moods: HealthMood[] = [];
    try {
      moods = await db.healthMood.findMany({
        where: { motherId },
        orderBy: [{ createdAt: "desc" }],
        take: 50,
      });
    } catch (err) {
      console.warn("Failed to fetch moods, returning empty array", err);
      moods = [];
    }

    // Symptoms (raw DB rows)
    let symptomsRaw: HealthSymptom[] = [];
    try {
      symptomsRaw = await db.healthSymptom.findMany({
        where: { motherId },
        orderBy: [{ createdAt: "desc" }],
        take: 50,
      });
    } catch (err) {
      console.warn("Failed to fetch symptoms, returning empty array", err);
      symptomsRaw = [];
    }

    const symptoms = symptomsRaw.map((s) => {
      const createdAt = s.createdAt ? new Date(s.createdAt) : new Date();
      return {
        id: s.id,
        symptom: s.name ?? "",
        time: formatDisplayDateFromDate(createdAt),
        intensity: mapSeverityToIntensity(s.severity),
        resolved: typeof (s as any).resolved === "boolean" ? (s as any).resolved : false,
        notes: s.notes ?? "",
        rawCreatedAt: s.createdAt,
      };
    });

    res.status(200).json({ success: true, data: { metrics, moods, symptoms } });
  } catch (error) {
    console.error("Get health data error:", error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: "failed to fetch health data" });
  }
});

/**
 * Create a new health metric
 */
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

/**
 * Update a health metric
 * PATCH /api/healthtracker/metrics/:id
 */
router.patch("/metrics/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const motherId = req.userId!;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid metric id" });
      return;
    }

    const existing = await db.healthMetric.findUnique({ where: { id } });
    if (!existing || existing.motherId !== motherId) {
      res.status(404).json({ success: false, error: "Metric not found" });
      return;
    }

    const { title, value, unit, change, trend, color, category } = req.body;
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (value !== undefined) updates.value = value;
    if (unit !== undefined) updates.unit = unit;
    if (change !== undefined) updates.change = change;
    if (trend !== undefined) updates.trend = trend;
    if (color !== undefined) updates.color = color;
    if (category !== undefined) updates.category = category;

    const updated = await db.healthMetric.update({
      where: { id },
      data: updates,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("Update metric error:", err);
    res.status(500).json({ success: false, error: "Failed to update metric" });
  }
});

/**
 * Delete a health metric
 * DELETE /api/healthtracker/metrics/:id
 */
router.delete("/metrics/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const motherId = req.userId!;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid metric id" });
      return;
    }

    const existing = await db.healthMetric.findUnique({ where: { id } });
    if (!existing || existing.motherId !== motherId) {
      res.status(404).json({ success: false, error: "Metric not found" });
      return;
    }

    await db.healthMetric.delete({ where: { id } });
    res.status(200).json({ success: true, data: { id } });
  } catch (err) {
    console.error("Delete metric error:", err);
    res.status(500).json({ success: false, error: "Failed to delete metric" });
  }
});


/**
 * Create a new mood
 * POST /api/healthtracker/moods
 */
router.post("/moods", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const motherId = req.userId!;
    const { mood, notes } = req.body;

    if (!mood || typeof mood !== "string") {
      res.status(400).json({ success: false, error: "Invalid mood" });
      return;
    }

    const newMood = await db.healthMood.create({
      data: { motherId, mood, notes: notes ?? "" },
    });

    res.status(201).json({ success: true, data: newMood });
  } catch (err) {
    console.error("Failed to add mood:", err);
    res.status(500).json({ success: false, error: "Failed to add mood" });
  }
});

/**
 * Update a mood (partial)
 * PATCH /api/healthtracker/moods/:id
 */
router.patch("/moods/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const motherId = req.userId!;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid id" });
      return;
    }

    const existing = await db.healthMood.findUnique({ where: { id } });
    if (!existing || existing.motherId !== motherId) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }

    const { notes, mood } = req.body as any;
    const updates: any = {};
    if (typeof notes !== "undefined") updates.notes = notes;
    if (typeof mood !== "undefined") updates.mood = mood;

    const updated = await db.healthMood.update({
      where: { id },
      data: updates,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("Update mood error", err);
    res.status(500).json({ success: false, error: "Failed to update mood" });
  }
});

/**
 * Delete a mood
 * DELETE /api/healthtracker/moods/:id
 */
router.delete("/moods/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const motherId = req.userId!;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid id" });
      return;
    }

    const existing = await db.healthMood.findUnique({ where: { id } });
    if (!existing || existing.motherId !== motherId) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }

    await db.healthMood.delete({ where: { id } });

    res.status(200).json({ success: true, data: { id } });
  } catch (err) {
    console.error("Delete mood error:", err);
    res.status(500).json({ success: false, error: "Failed to delete mood" });
  }
});

/* ---------- Symptom routes (unchanged, kept for completeness) ---------- */

router.post("/symptoms", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const motherId = req.userId!;
    const {
      symptom,
      intensity,
      date,
      time,
      resolved,
      notes,
      name,
      severity,
    } = req.body as any;

    const dbName: string = symptom || name || "Symptom";

    let dbSeverity: string | undefined;
    if (intensity && typeof intensity === "string") dbSeverity = intensity.toLowerCase();
    else if (severity && typeof severity === "string") dbSeverity = severity.toLowerCase();
    else dbSeverity = "low";

    const payload: any = {
      motherId,
      name: dbName,
      severity: dbSeverity,
      notes: notes ?? "",
    };

    if (typeof resolved === "boolean") payload.resolved = resolved;

    if (date) {
      let createdAt: Date | null = null;
      try {
        if (time) {
          const isoCandidate = `${date}T${time}`;
          const candDate = new Date(isoCandidate);
          if (!isNaN(candDate.getTime())) createdAt = candDate;
          else {
            const spaceCandidate = new Date(`${date} ${time}`);
            if (!isNaN(spaceCandidate.getTime())) createdAt = spaceCandidate;
          }
        } else {
          const d = new Date(date);
          if (!isNaN(d.getTime())) createdAt = d;
        }
      } catch (e) {
        createdAt = null;
      }
      if (createdAt) payload.createdAt = createdAt;
    }

    const symptomRow = await db.healthSymptom.create({ data: payload });

    const createdDate = symptomRow.createdAt ? new Date(symptomRow.createdAt) : new Date();
    const mapped = {
      id: symptomRow.id,
      symptom: symptomRow.name ?? "",
      time: formatDisplayDateFromDate(createdDate),
      intensity: mapSeverityToIntensity(symptomRow.severity),
      resolved: typeof (symptomRow as any).resolved === "boolean" ? (symptomRow as any).resolved : false,
      notes: symptomRow.notes ?? "",
      rawCreatedAt: symptomRow.createdAt,
    };

    res.status(201).json({ success: true, data: mapped });
  } catch (err) {
    console.error("Failed to add symptom:", err);
    res.status(500).json({ success: false, error: "Failed to add symptom" });
  }
});

router.patch("/symptoms/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const motherId = req.userId;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid id" });
      return;
    }

    const existing = await db.healthSymptom.findUnique({ where: { id } });
    if (!existing || existing.motherId !== motherId) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }

    const { symptom, intensity, name, severity, notes, resolved, date, time } = req.body as any;

    const updates: any = {};

    if (symptom || name) updates.name = symptom ?? name;
    if (intensity || severity) updates.severity = (intensity ?? severity).toString().toLowerCase();
    if (typeof notes !== "undefined") updates.notes = notes;
    if (typeof resolved === "boolean") updates.resolved = resolved;

    if (date) {
      let createdAt: Date | null = null;
      try {
        if (time) {
          const isoCandidate = `${date}T${time}`;
          const candDate = new Date(isoCandidate);
          if (!isNaN(candDate.getTime())) createdAt = candDate;
          else {
            const spaceCandidate = new Date(`${date} ${time}`);
            if (!isNaN(spaceCandidate.getTime())) createdAt = spaceCandidate;
          }
        } else {
          const d = new Date(date);
          if (!isNaN(d.getTime())) createdAt = d;
        }
      } catch (e) {
        createdAt = null;
      }
      if (createdAt) updates.createdAt = createdAt;
    }

    const updated = await db.healthSymptom.update({
      where: { id },
      data: updates,
    });

    const createdDate = updated.createdAt ? new Date(updated.createdAt) : new Date();
    const mapped = {
      id: updated.id,
      symptom: updated.name ?? "",
      time: formatDisplayDateFromDate(createdDate),
      intensity: mapSeverityToIntensity(updated.severity),
      resolved: typeof (updated as any).resolved === "boolean" ? (updated as any).resolved : false,
      notes: updated.notes ?? "",
      rawCreatedAt: updated.createdAt,
    };

    res.status(200).json({ success: true, data: mapped });
  } catch (err) {
    console.error("Failed to update symptom:", err);
    res.status(500).json({ success: false, error: "Failed to update symptom" });
  }
});

router.delete("/symptoms/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const motherId = req.userId!;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid id" });
      return;
    }

    const existing = await db.healthSymptom.findUnique({ where: { id } });
    if (!existing || existing.motherId !== motherId) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }

    await db.healthSymptom.delete({ where: { id } });

    res.status(200).json({ success: true, data: { id } });
  } catch (err) {
    console.error("Failed to delete symptom:", err);
    res.status(500).json({ success: false, error: "Failed to delete symptom" });
  }
});

export default router;