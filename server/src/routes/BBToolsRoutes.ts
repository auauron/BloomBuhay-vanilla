import { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { BabyMetric, FeedingLog, GrowthRecord, PrismaClient, SleepLog } from "@prisma/client";

const router = Router();
const db = new PrismaClient();

/**
 * GET /api/bbtools
 * Returns metrics, feedings, sleeps, and growths for authenticated user.
 */
router.get("/", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId: number | undefined = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    let metrics:BabyMetric[] = [];
    try {
      metrics = await db.babyMetric.findMany({
        where: { userId },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      });
    } catch (err) {
      console.warn("Failed to fetch metrics, returning empty array", err);
      metrics = [];
    }

    let feedings:FeedingLog[] = [];
    try {
      feedings = await db.feedingLog.findMany({
        where: { userId },
        orderBy: [{ createdAt: "desc" }],
        take: 50,
      });
    } catch (err) {
      console.warn("Failed to fetch feedings, returning empty array", err);
      feedings = [];
    }

    let sleeps:SleepLog[] = [];
    try {
      sleeps = await db.sleepLog.findMany({
        where: { userId },
        orderBy: [{ startAt: "desc" }],
        take: 50,
      });
    } catch (err) {
      console.warn("Failed to fetch sleeps, returning empty array", err);
      sleeps = [];
    }

    let growths:GrowthRecord[] = [];
    try {
      growths = await db.growthRecord.findMany({
        where: { userId },
        orderBy: [{ createdAt: "desc" }],
        take: 50,
      });
    } catch (err) {
      console.warn("Failed to fetch growth records, returning empty array", err);
      growths = [];
    }

    res.status(200).json({ success: true, data: { metrics, feedings, sleeps, growths } });
  } catch (error) {
    console.error("Get BB tools data error:", error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: "failed to fetch BB tools data" });
  }
});

/**
 * POST /api/bbtools/metrics
 * Create a baby metric
 */
router.post("/metrics", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { title, value, unit, notes } = req.body;
    const created = await db.babyMetric.create({
      data: {
        userId,
        title,
        value,
        unit,
        notes,
      },
    });

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("Create metric error:", error);
    res.status(500).json({ success: false, error: "failed to create metric" });
  }
});

/**
 * PATCH /api/bbtools/metrics/:id
 */
router.patch("/metrics/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const updated = await db.babyMetric.updateMany({
      where: { id, userId },
      data: req.body,
    });

    if (updated.count === 0) return res.status(404).json({ success: false, error: "Metric not found" });

    const metric = await db.babyMetric.findUnique({ where: { id } });
    res.status(200).json({ success: true, data: metric });
  } catch (error) {
    console.error("Update metric error:", error);
    res.status(500).json({ success: false, error: "failed to update metric" });
  }
});

/**
 * DELETE /api/bbtools/metrics/:id
 */
router.delete("/metrics/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const deleted = await db.babyMetric.deleteMany({ where: { id, userId } });
    if (deleted.count === 0) return res.status(404).json({ success: false, error: "Metric not found" });

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Delete metric error:", error);
    res.status(500).json({ success: false, error: "failed to delete metric" });
  }
});

/**
 * POST /api/bbtools/feedings
 */
router.post("/feedings", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { amount, method, notes, occurredAt } = req.body;
    const created = await db.feedingLog.create({
      data: {
        userId,
        amount,
        method,
        notes,
        occurredAt: occurredAt ? new Date(occurredAt) : new Date(),
      },
    });

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("Add feeding error:", error);
    res.status(500).json({ success: false, error: "failed to add feeding" });
  }
});

/**
 * PATCH /api/bbtools/feedings/:id
 */
router.patch("/feedings/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { amount, method, notes, occurredAt } = req.body;
    const updateData: any = {};
    if (amount !== undefined) updateData.amount = amount;
    if (method !== undefined) updateData.method = method;
    if (notes !== undefined) updateData.notes = notes;
    if (occurredAt !== undefined) updateData.occurredAt = new Date(occurredAt);

    const updated = await db.feedingLog.updateMany({
      where: { id, userId },
      data: updateData,
    });

    if (updated.count === 0) return res.status(404).json({ success: false, error: "Feeding not found" });

    const feeding = await db.feedingLog.findUnique({ where: { id } });
    res.status(200).json({ success: true, data: feeding });
  } catch (error) {
    console.error("Update feeding error:", error);
    res.status(500).json({ success: false, error: "failed to update feeding" });
  }
});

/**
 * DELETE /api/bbtools/feedings/:id
 */
router.delete("/feedings/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const deleted = await db.feedingLog.deleteMany({ where: { id, userId } });
    if (deleted.count === 0) return res.status(404).json({ success: false, error: "Feeding not found" });

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Delete feeding error:", error);
    res.status(500).json({ success: false, error: "failed to delete feeding" });
  }
});

/**
 * POST /api/bbtools/sleeps
 */
router.post("/sleeps", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { startAt, endAt, notes } = req.body;
    const created = await db.sleepLog.create({
      data: {
        userId,
        startAt: new Date(startAt),
        endAt: endAt ? new Date(endAt) : null,
        notes,
      },
    });

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("Add sleep error:", error);
    res.status(500).json({ success: false, error: "failed to add sleep log" });
  }
});

/**
 * PATCH /api/bbtools/sleeps/:id
 */
router.patch("/sleeps/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { startAt, endAt, notes } = req.body;
    const updateData: any = {};
    if (startAt !== undefined) updateData.startAt = new Date(startAt);
    if (endAt !== undefined) updateData.endAt = endAt ? new Date(endAt) : null;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await db.sleepLog.updateMany({ where: { id, userId }, data: updateData });
    if (updated.count === 0) return res.status(404).json({ success: false, error: "Sleep log not found" });

    const sleep = await db.sleepLog.findUnique({ where: { id } });
    res.status(200).json({ success: true, data: sleep });
  } catch (error) {
    console.error("Update sleep error:", error);
    res.status(500).json({ success: false, error: "failed to update sleep" });
  }
});

/**
 * DELETE /api/bbtools/sleeps/:id
 */
router.delete("/sleeps/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const deleted = await db.sleepLog.deleteMany({ where: { id, userId } });
    if (deleted.count === 0) return res.status(404).json({ success: false, error: "Sleep log not found" });

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Delete sleep error:", error);
    res.status(500).json({ success: false, error: "failed to delete sleep" });
  }
});

/**
 * POST /api/bbtools/growths
 */
router.post("/growths", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { weight, height, headCircumference, notes } = req.body;
    const created = await db.growthRecord.create({
      data: {
        userId,
        weight,
        height,
        headCircumference,
        notes,
      },
    });

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("Add growth record error:", error);
    res.status(500).json({ success: false, error: "failed to add growth record" });
  }
});

/**
 * PATCH /api/bbtools/growths/:id
 */
router.patch("/growths/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { weight, height, headCircumference, notes } = req.body;
    const updateData: any = {};
    if (weight !== undefined) updateData.weight = weight;
    if (height !== undefined) updateData.height = height;
    if (headCircumference !== undefined) updateData.headCircumference = headCircumference;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await db.growthRecord.updateMany({ where: { id, userId }, data: updateData });
    if (updated.count === 0) return res.status(404).json({ success: false, error: "Growth record not found" });

    const growth = await db.growthRecord.findUnique({ where: { id } });
    res.status(200).json({ success: true, data: growth });
  } catch (error) {
    console.error("Update growth error:", error);
    res.status(500).json({ success: false, error: "failed to update growth" });
  }
});

/**
 * DELETE /api/bbtools/growths/:id
 */
router.delete("/growths/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const deleted = await db.growthRecord.deleteMany({ where: { id, userId } });
    if (deleted.count === 0) return res.status(404).json({ success: false, error: "Growth record not found" });

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Delete growth error:", error);
    res.status(500).json({ success: false, error: "failed to delete growth" });
  }
});

/**
 * GET /api/bbtools/tools/contractions
 */
router.get("/tools/contractions", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const logs = await db.toolsLog.findMany({
      where: { motherId: userId, type: "contractionTimer" },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, data: logs.map(l => l.data) });
  } catch (err) {
    console.error("Get contractions error:", err);
    res.status(500).json({ success: false, error: "Failed to get contractions" });
  }
});

/**
 * POST /api/bbtools/tools/contractions
 */
router.post("/tools/contractions", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const data = req.body; // { startTime, endTime, duration, frequency }

    const created = await db.toolsLog.create({
      data: {
        motherId: userId,
        type: "contractionTimer",
        data,
      },
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error("Create contraction error:", err);
    res.status(500).json({ success: false, error: "Failed to create contraction" });
  }
});

/**
 * DELETE /api/bbtools/tools/contractions/:id
 */
router.delete("/tools/contractions/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const deleted = await db.toolsLog.deleteMany({
      where: { id, motherId: userId, type: "contractionTimer" },
    });

    if (deleted.count === 0) return res.status(404).json({ success: false, error: "Contraction not found" });

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("Delete contraction error:", err);
    res.status(500).json({ success: false, error: "Failed to delete contraction" });
  }
});

/**
 * GET /api/bbtools/tools/duedate
 */
router.get("/tools/duedate", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const logs = await db.toolsLog.findMany({
      where: { motherId: userId, type: "dueDateCalculator" },
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    res.status(200).json({ success: true, data: logs.length > 0 ? logs[0].data : null });
  } catch (err) {
    console.error("Get due date log error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch due date log" });
  }
});

/**
 * POST /api/bbtools/tools/duedate
 */
router.post("/tools/duedate", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const data = req.body; // { lmpDate, weeksPregnant }

    const created = await db.toolsLog.create({
      data: {
        motherId: userId,
        type: "dueDateCalculator",
        data,
      },
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error("Create due date log error:", err);
    res.status(500).json({ success: false, error: "Failed to create due date log" });
  }
});

export default router;