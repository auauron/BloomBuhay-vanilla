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

    let metrics: BabyMetric[] = [];
    try {
      metrics = await db.babyMetric.findMany({
        where: { userId },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      });
    } catch (err) {
      console.warn("Failed to fetch metrics, returning empty array", err);
      metrics = [];
    }

    let feedings: FeedingLog[] = [];
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

    let sleeps: SleepLog[] = [];
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

    let growths: GrowthRecord[] = [];
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

    let diapers: any[] = [];
    try {
      const diaperLogs = await db.toolsLog.findMany({
        where: { motherId: userId, type: "diaper" },
        orderBy: [{ createdAt: "desc" }],
        take: 50,
      });
      diapers = diaperLogs.map((t) => {
        const d: any = t.data || {};
        return {
          id: t.id,
          userId,
          diaperType: d.diaperType,
          occurredAt: d.occurredAt ?? t.createdAt.toISOString(),
          color: d.color,
          consistency: d.consistency,
          notes: d.notes,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.createdAt.toISOString(),
        };
      });
    } catch (err) {
      console.warn("Failed to fetch diapers via ToolsLog, returning empty array", err);
      diapers = [];
    }

    let vaccinations: any[] = [];
    try {
      const vaccinationLogs = await db.toolsLog.findMany({
        where: { motherId: userId, type: "vaccination" },
        orderBy: [{ createdAt: "desc" }],
        take: 50,
      });
      vaccinations = vaccinationLogs.map((t) => {
        const d: any = t.data || {};
        return {
          id: t.id,
          userId,
          vaccineName: d.vaccineName,
          dose: d.dose,
          date: d.date ?? t.createdAt.toISOString(),
          administeredDate: d.administeredDate,
          status: d.status,
          clinic: d.clinic,
          sideEffects: d.sideEffects,
          notes: d.notes,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.createdAt.toISOString(),
        };
      });
    } catch (err) {
      console.warn("Failed to fetch vaccinations via ToolsLog, returning empty array", err);
      vaccinations = [];
    }

    let doctorVisits: any[] = [];
    try {
      const visitLogs = await db.toolsLog.findMany({
        where: { motherId: userId, type: "doctorVisit" },
        orderBy: [{ createdAt: "desc" }],
        take: 50,
      });
      doctorVisits = visitLogs.map((t) => {
        const d: any = t.data || {};
        return {
          id: t.id,
          userId,
          visitDate: d.visitDate ?? t.createdAt.toISOString(),
          reason: d.reason,
          doctor: d.doctor ?? d.doctorName,
          doctorName: d.doctorName,
          clinic: d.clinic,
          weight: d.weight,
          height: d.height,
          headCircumference: d.headCircumference,
          diagnosis: d.diagnosis,
          prescriptions: d.prescriptions,
          notes: d.notes,
          nextVisit: d.nextVisit ?? d.followUpDate,
          followUpDate: d.followUpDate,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.createdAt.toISOString(),
        };
      });
    } catch (err) {
      console.warn("Failed to fetch doctor visits via ToolsLog, returning empty array", err);
      doctorVisits = [];
    }

    res.status(200).json({
      success: true,
      data: { metrics, feedings, sleeps, growths, diapers, vaccinations, doctorVisits },
    });
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

    const { weight, height, headCircumference, notes, ageMonths } = req.body;
    const created = await db.growthRecord.create({
      data: {
        userId,
        weight,
        height,
        headCircumference,
        ageMonths,
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

    const { weight, height, headCircumference, notes, ageMonths } = req.body;
    const updateData: any = {};
    if (weight !== undefined) updateData.weight = weight;
    if (height !== undefined) updateData.height = height;
    if (headCircumference !== undefined) updateData.headCircumference = headCircumference;
    if (ageMonths !== undefined) updateData.ageMonths = ageMonths;
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

/**
 * 🫛 NUTRITION ROUTES 🫛
 */

/**
 * GET /api/bbtools/tools/nutrition
 */
router.get("/tools/nutrition", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const logs = await db.toolsLog.findMany({
      where: { motherId: userId, type: "nutrition" },
      orderBy: { createdAt: "desc" },
    });

    // Convert ToolsLog to NutritionEntry format
    const nutritionEntries = logs.map(log => ({
      id: log.id.toString(),
      ...(log.data as any)
    }));

    res.status(200).json({ success: true, data: nutritionEntries });
  } catch (err) {
    console.error("Get nutrition logs error:", err);
    res.status(500).json({ success: false, error: "Failed to get nutrition logs" });
  }
});

/**
 * POST /api/bbtools/tools/nutrition
 */
router.post("/tools/nutrition", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { date, time, food, amount, notes } = req.body;

    const created = await db.toolsLog.create({
      data: {
        motherId: userId,
        type: "nutrition",
        data: {
          date,
          time, 
          food,
          amount,
          notes
        },
      },
    });

    res.status(201).json({ 
      success: true, 
      data: {
        id: created.id.toString(),
        date: date,
        time: time,
        food: food,
        amount: amount,
        notes: notes
      }
    });
  } catch (err) {
    console.error("Create nutrition error:", err);
    res.status(500).json({ success: false, error: "Failed to create nutrition entry" });
  }
});

/**
 * PATCH /api/bbtools/tools/nutrition/:id
 */
router.patch("/tools/nutrition/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { date, time, food, amount, notes } = req.body;

    const updated = await db.toolsLog.updateMany({
      where: { id, motherId: userId, type: "nutrition" },
      data: {
        data: {
          date,
          time,
          food,
          amount,
          notes
        },
      },
    });

    if (updated.count === 0) return res.status(404).json({ success: false, error: "Nutrition entry not found" });

    const log = await db.toolsLog.findUnique({ where: { id } });
    if (!log) {
  return res.status(404).json({ success: false, error: "Nutrition entry not found" });
}
    res.status(200).json({ 
      success: true, 
      data: {
        id: log.id.toString(),
        date: (log.data as any).date,
        time: (log.data as any).time,
        food: (log.data as any).food,
        amount: (log.data as any).amount,
        notes: (log.data as any).notes
      }
    });
  } catch (err) {
    console.error("Update nutrition error:", err);
    res.status(500).json({ success: false, error: "Failed to update nutrition entry" });
  }
});

/**
 * DELETE /api/bbtools/tools/nutrition/:id
 */
router.delete("/tools/nutrition/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const deleted = await db.toolsLog.deleteMany({
      where: { id, motherId: userId, type: "nutrition" },
    });

    if (deleted.count === 0) return res.status(404).json({ success: false, error: "Nutrition entry not found" });

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("Delete nutrition error:", err);
    res.status(500).json({ success: false, error: "Failed to delete nutrition entry" });
  }
});


/**
 * 🛌 SCHEDULE ROUTES 🛌
 */

/**
 * GET /api/bbtools/tools/schedule
 */
router.get("/tools/schedule", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const logs = await db.toolsLog.findMany({
      where: { motherId: userId, type: "schedule" },
      orderBy: { createdAt: "desc" },
    });

    // Convert ToolsLog to ScheduleEntry format
    const scheduleEntries = logs.map(log => ({
      id: log.id.toString(),
      ...(log.data as any)
    }));

    res.status(200).json({ success: true, data: scheduleEntries });
  } catch (err) {
    console.error("Get schedule entries error:", err);
    res.status(500).json({ success: false, error: "Failed to get schedule entries" });
  }
});

/**
 * POST /api/bbtools/tools/schedule
 */
router.post("/tools/schedule", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { date, startTime, endTime, type, description, notes } = req.body;

    const created = await db.toolsLog.create({
      data: {
        motherId: userId,
        type: "schedule",
        data: {
          date,
          startTime, 
          endTime,
          type,
          description,
          notes
        },
      },
    });

    res.status(201).json({ 
      success: true, 
      data: {
        id: created.id.toString(),
        date: date,
        startTime: startTime,
        endTime: endTime,
        type: type,
        description: description,
        notes: notes
      }
    });
  } catch (err) {
    console.error("Create schedule error:", err);
    res.status(500).json({ success: false, error: "Failed to create schedule entry" });
  }
});

/**
 * PATCH /api/bbtools/tools/schedule/:id
 */
router.patch("/tools/schedule/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { date, startTime, endTime, type, description, notes } = req.body;

    const updated = await db.toolsLog.updateMany({
      where: { id, motherId: userId, type: "schedule" },
      data: {
        data: {
          date,
          startTime,
          endTime,
          type,
          description,
          notes
        },
      },
    });

    if (updated.count === 0) return res.status(404).json({ success: false, error: "Schedule entry not found" });

    const log = await db.toolsLog.findUnique({ where: { id } });
    if (!log) {
      return res.status(404).json({ success: false, error: "Schedule entry not found" });
    }

    res.status(200).json({ 
      success: true, 
      data: {
        id: log.id.toString(),
        date: (log.data as any).date,
        startTime: (log.data as any).startTime,
        endTime: (log.data as any).endTime,
        type: (log.data as any).type,
        description: (log.data as any).description,
        notes: (log.data as any).notes
      }
    });
  } catch (err) {
    console.error("Update schedule error:", err);
    res.status(500).json({ success: false, error: "Failed to update schedule entry" });
  }
});

/**
 * DELETE /api/bbtools/tools/schedule/:id
 */
router.delete("/tools/schedule/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const deleted = await db.toolsLog.deleteMany({
      where: { id, motherId: userId, type: "schedule" },
    });

    if (deleted.count === 0) return res.status(404).json({ success: false, error: "Schedule entry not found" });

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("Delete schedule error:", err);
    res.status(500).json({ success: false, error: "Failed to delete schedule entry" });
  }
});

/**
 * 💉 VACCINATION ROUTES 💉
 */

/**
 * GET /api/bbtools/tools/vaccinations
 */
router.get("/tools/vaccinations", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const logs = await db.toolsLog.findMany({
      where: { motherId: userId, type: "vaccination" },
      orderBy: { createdAt: "desc" },
    });

    // Convert ToolsLog to Vaccination format
    const vaccinations = logs.map(log => ({
      id: log.id.toString(),
      ...(log.data as any)
    }));

    res.status(200).json({ success: true, data: vaccinations });
  } catch (err) {
    console.error("Get vaccinations error:", err);
    res.status(500).json({ success: false, error: "Failed to get vaccinations" });
  }
});

/**
 * POST /api/bbtools/tools/vaccinations
 */
router.post("/tools/vaccinations", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { name, dueDate, completed, completedDate, notes } = req.body;

    const created = await db.toolsLog.create({
      data: {
        motherId: userId,
        type: "vaccination",
        data: {
          name,
          dueDate, 
          completed: completed || false,
          completedDate,
          notes
        },
      },
    });

    res.status(201).json({ 
      success: true, 
      data: {
        id: created.id.toString(),
        name: name,
        dueDate: dueDate,
        completed: completed || false,
        completedDate: completedDate,
        notes: notes
      }
    });
  } catch (err) {
    console.error("Create vaccination error:", err);
    res.status(500).json({ success: false, error: "Failed to create vaccination" });
  }
});

/**
 * PATCH /api/bbtools/tools/vaccinations/:id
 */
router.patch("/tools/vaccinations/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { name, dueDate, completed, completedDate, notes } = req.body;

    const updated = await db.toolsLog.updateMany({
      where: { id, motherId: userId, type: "vaccination" },
      data: {
        data: {
          name,
          dueDate,
          completed,
          completedDate,
          notes
        },
      },
    });

    if (updated.count === 0) return res.status(404).json({ success: false, error: "Vaccination not found" });

    const log = await db.toolsLog.findUnique({ where: { id } });
    if (!log) {
      return res.status(404).json({ success: false, error: "Vaccination not found" });
    }

    res.status(200).json({ 
      success: true, 
      data: {
        id: log.id.toString(),
        name: (log.data as any).name,
        dueDate: (log.data as any).dueDate,
        completed: (log.data as any).completed,
        completedDate: (log.data as any).completedDate,
        notes: (log.data as any).notes
      }
    });
  } catch (err) {
    console.error("Update vaccination error:", err);
    res.status(500).json({ success: false, error: "Failed to update vaccination" });
  }
});

/**
 * DELETE /api/bbtools/tools/vaccinations/:id
 */
router.delete("/tools/vaccinations/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const deleted = await db.toolsLog.deleteMany({
      where: { id, motherId: userId, type: "vaccination" }
    });

    if (deleted.count === 0) return res.status(404).json({ success: false, error: "Vaccination not found" });

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("Delete vaccination error:", err);
    res.status(500).json({ success: false, error: "Failed to delete vaccination" });
  }
});

/**
 * POST /api/bbtools/diapers
 */
router.post("/diapers", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { diaperType, occurredAt, color, consistency, notes } = req.body;
    const created = await db.toolsLog.create({
      data: {
        motherId: userId,
        type: "diaper",
        data: { diaperType, occurredAt, color, consistency, notes }
      }
    });

    const d: any = created.data || {};
    res.status(201).json({
      success: true,
      data: {
        id: created.id,
        userId,
        diaperType: d.diaperType,
        occurredAt: d.occurredAt ?? created.createdAt.toISOString(),
        color: d.color,
        consistency: d.consistency,
        notes: d.notes,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error("Add diaper error", error);
    res.status(500).json({ success: false, error: "failed to add diaper log" });
  }
});

/**
 * PATCH /api/bbtools/diapers/:id
 */
router.patch("/diapers/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const existing = await db.toolsLog.findFirst({
      where: { id, motherId: userId, type: "diaper" }
    });
    if (!existing) return res.status(404).json({ success: false, error: "Diaper log not found" });

    const current = (existing.data as any) || {};
    const { diaperType, occurredAt, color, consistency, notes } = req.body;

    const updated = await db.toolsLog.update({
      where: { id },
      data: {
        data: {
          ...current,
          ...(diaperType !== undefined ? { diaperType } : {}),
          ...(occurredAt !== undefined ? { occurredAt } : {}),
          ...(color !== undefined ? { color } : {}),
          ...(consistency !== undefined ? { consistency } : {}),
          ...(notes !== undefined ? { notes } : {})
        }
      }
    });

    const d: any = updated.data || {};
    res.status(200).json({
      success: true,
      data: {
        id: updated.id,
        userId,
        diaperType: d.diaperType,
        occurredAt: d.occurredAt ?? updated.createdAt.toISOString(),
        color: d.color,
        consistency: d.consistency,
        notes: d.notes,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error("Update diaper error", error);
    res.status(500).json({ success: false, error: "failed to update diaper log" });
  }
});

/**
 * DELETE /api/bbtools/diapers/:id
 */
router.delete("/diapers/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const deleted = await db.toolsLog.deleteMany({
      where: { id, motherId: userId, type: "diaper" }
    });

    if (deleted.count === 0) return res.status(404).json({ success: false, error: "Diaper log not found" });

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Delete diaper error", error);
    res.status(500).json({ success: false, error: "failed to delete diaper log" });
  }
});

/**
 * POST /api/bbtools/vaccinations
 */
router.post("/vaccinations", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { vaccineName, dose, date, administeredDate, status, clinic, sideEffects, notes } = req.body;
    const created = await db.toolsLog.create({
      data: {
        motherId: userId,
        type: "vaccination",
        data: { vaccineName, dose, date, administeredDate, status, clinic, sideEffects, notes }
      }
    });

    const d: any = created.data || {};
    res.status(201).json({
      success: true,
      data: {
        id: created.id,
        userId,
        vaccineName: d.vaccineName,
        dose: d.dose,
        date: d.date ?? created.createdAt.toISOString(),
        administeredDate: d.administeredDate,
        status: d.status,
        clinic: d.clinic,
        sideEffects: d.sideEffects,
        notes: d.notes,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error("Add vaccination error", error);
    res.status(500).json({ success: false, error: "failed to add vaccination" });
  }
});

/**
 * PATCH /api/bbtools/vaccinations/:id
 */
router.patch("/vaccinations/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const existing = await db.toolsLog.findFirst({
      where: { id, motherId: userId, type: "vaccination" }
    });
    if (!existing) return res.status(404).json({ success: false, error: "Vaccination not found" });

    const current = (existing.data as any) || {};
    const { vaccineName, dose, date, administeredDate, status, clinic, sideEffects, notes } = req.body;

    const updated = await db.toolsLog.update({
      where: { id },
      data: {
        data: {
          ...current,
          ...(vaccineName !== undefined ? { vaccineName } : {}),
          ...(dose !== undefined ? { dose } : {}),
          ...(date !== undefined ? { date } : {}),
          ...(administeredDate !== undefined ? { administeredDate } : {}),
          ...(status !== undefined ? { status } : {}),
          ...(clinic !== undefined ? { clinic } : {}),
          ...(sideEffects !== undefined ? { sideEffects } : {}),
          ...(notes !== undefined ? { notes } : {})
        }
      }
    });

    const d: any = updated.data || {};
    res.status(200).json({
      success: true,
      data: {
        id: updated.id,
        userId,
        vaccineName: d.vaccineName,
        dose: d.dose,
        date: d.date ?? updated.createdAt.toISOString(),
        administeredDate: d.administeredDate,
        status: d.status,
        clinic: d.clinic,
        sideEffects: d.sideEffects,
        notes: d.notes,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error("Update vaccination error", error);
    res.status(500).json({ success: false, error: "failed to update vaccination" });
  }
});

/**
 * DELETE /api/bbtools/vaccinations/:id
 */
router.delete("/vaccinations/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const deleted = await db.toolsLog.deleteMany({
      where: { id, motherId: userId, type: "vaccination" }
    });

    if (deleted.count === 0) return res.status(404).json({ success: false, error: "Vaccination not found" });

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Delete vaccination error", error);
    res.status(500).json({ success: false, error: "failed to delete vaccination" });
  }
});

/**
 * POST /api/bbtools/doctor-visits
 */
router.post("/doctor-visits", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { visitDate, reason, doctor, doctorName, clinic, weight, height, headCircumference, diagnosis, notes, prescriptions, nextVisit, followUpDate } = req.body;
    const created = await db.toolsLog.create({
      data: {
        motherId: userId,
        type: "doctorVisit",
        data: { visitDate, reason, doctor, doctorName, clinic, weight, height, headCircumference, diagnosis, notes, prescriptions, nextVisit, followUpDate }
      }
    });

    const d: any = created.data || {};
    res.status(201).json({
      success: true,
      data: {
        id: created.id,
        userId,
        visitDate: d.visitDate ?? created.createdAt.toISOString(),
        reason: d.reason,
        doctor: d.doctor ?? d.doctorName,
        clinic: d.clinic,
        weight: d.weight,
        height: d.height,
        headCircumference: d.headCircumference,
        diagnosis: d.diagnosis,
        notes: d.notes,
        prescriptions: d.prescriptions,
        nextVisit: d.nextVisit ?? d.followUpDate,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error("Add doctor visit error", error);
    res.status(500).json({ success: false, error: "failed to add doctor visit" });
  }
});

/**
 * PATCH /api/bbtools/doctor-visits/:id
 */
router.patch("/doctor-visits/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const existing = await db.toolsLog.findFirst({
      where: { id, motherId: userId, type: "doctorVisit" }
    });
    if (!existing) return res.status(404).json({ success: false, error: "Doctor visit not found" });

    const current = (existing.data as any) || {};
    const { visitDate, reason, doctor, doctorName, clinic, weight, height, headCircumference, diagnosis, notes, prescriptions, nextVisit, followUpDate } = req.body;

    const updated = await db.toolsLog.update({
      where: { id },
      data: {
        data: {
          ...current,
          ...(visitDate !== undefined ? { visitDate } : {}),
          ...(reason !== undefined ? { reason } : {}),
          ...(doctor !== undefined ? { doctor } : {}),
          ...(doctorName !== undefined ? { doctorName } : {}),
          ...(clinic !== undefined ? { clinic } : {}),
          ...(weight !== undefined ? { weight } : {}),
          ...(height !== undefined ? { height } : {}),
          ...(headCircumference !== undefined ? { headCircumference } : {}),
          ...(diagnosis !== undefined ? { diagnosis } : {}),
          ...(notes !== undefined ? { notes } : {}),
          ...(prescriptions !== undefined ? { prescriptions } : {}),
          ...(nextVisit !== undefined ? { nextVisit } : {}),
          ...(followUpDate !== undefined ? { followUpDate } : {})
        }
      }
    });

    const d: any = updated.data || {};
    res.status(200).json({
      success: true,
      data: {
        id: updated.id,
        userId,
        visitDate: d.visitDate ?? updated.createdAt.toISOString(),
        reason: d.reason,
        doctor: d.doctor ?? d.doctorName,
        clinic: d.clinic,
        weight: d.weight,
        height: d.height,
        headCircumference: d.headCircumference,
        diagnosis: d.diagnosis,
        notes: d.notes,
        prescriptions: d.prescriptions,
        nextVisit: d.nextVisit ?? d.followUpDate,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error("Update doctor visit error", error);
    res.status(500).json({ success: false, error: "failed to update doctor visit" });
  }
});

/**
 * DELETE /api/bbtools/doctor-visits/:id
 */
router.delete("/doctor-visits/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const deleted = await db.toolsLog.deleteMany({
      where: { id, motherId: userId, type: "doctorVisit" }
    });

    if (deleted.count === 0) return res.status(404).json({ success: false, error: "Doctor visit not found" });

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Delete doctor visit error", error);
    res.status(500).json({ success: false, error: "failed to delete doctor visit" });
  }
});

// GET /api/bbtools/kicks
router.get("/kicks", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const kickLogs = await db.toolsLog.findMany({
      where: { motherId: userId, type: "kick" },
      orderBy: [{ createdAt: "desc" }],
      take: 100,
    });

    const kicks = kickLogs.map((t) => {
      const d: any = t.data || {};
      return {
        id: t.id,
        userId,
        startTime: d.startTime ?? null,
        endTime: d.endTime ?? null,
        durationSeconds: d.durationSeconds ?? 0,
        kicks: d.kicks ?? 0,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.createdAt.toISOString(),
      };
    });

    res.status(200).json({ success: true, data: kicks });
  } catch (error) {
    console.error("Get kicks error:", error);
    res.status(500).json({ success: false, error: "failed to fetch kick sessions" });
  }
});

// POST /api/bbtools/kicks
router.post("/kicks", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { startTime, endTime, durationSeconds, kicks } = req.body;

    const created = await db.toolsLog.create({
      data: {
        motherId: userId,
        type: "kick",
        data: {
          startTime: startTime ?? null,
          endTime: endTime ?? null,
          durationSeconds: durationSeconds ?? 0,
          kicks: kicks ?? 0,
        },
      },
    });

    const d: any = created.data || {};
    const responseObj = {
      id: created.id,
      userId,
      startTime: d.startTime || null,
      endTime: d.endTime || null,
      durationSeconds: d.durationSeconds || 0,
      kicks: d.kicks || 0,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.createdAt.toISOString(),
    };

    res.status(201).json({ success: true, data: responseObj });
  } catch (error) {
    console.error("Create kick session error:", error);
    res.status(500).json({ success: false, error: "failed to create kick session" });
  }
});
export default router;