import express from "express";
import { PrismaClient, Stage, BabyGender } from "@prisma/client";
import { authenticateToken, AuthRequest } from "../middleware/auth"; // adjust path if needed

const prisma = new PrismaClient();
const router = express.Router();

const uiStageToEnum = (ui?: string | null): Stage | null => {
  // Now expects keys like "pregnant", "postpartum", "childcare" from client
  if (!ui || !isValidStageEnum(ui)) return null;
  return ui as Stage;
};

const isValidStageEnum = (v: any): v is Stage =>
  ["pregnant", "postpartum", "childcare"].includes(String(v));

const isValidBabyGender = (v: any): v is BabyGender =>
  ["male", "female", "unknown"].includes(String(v));

/**
 * Helper: compute weeks pregnant from LMP date.
 * Returns integer number of weeks (rounded down), or null if invalid.
 */
const computeWeeksFromLmp = (lmp?: string | null): number | null => {
  if (!lmp) return null;
  const d = new Date(lmp);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.floor((now.getTime() - d.getTime()) / msPerDay);
  if (diffDays < 0) return null; // LMP in the future — ignore
  return Math.floor(diffDays / 7);
};

router.post("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId; // set by authenticateToken
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { stage: uiStage, babyName, lmpDate, babyGender, weeksPregnant } = req.body;

    const mappedStage = uiStageToEnum(uiStage);
    if (!mappedStage || !isValidStageEnum(mappedStage)) {
      return res.status(400).json({ error: "Invalid or missing stage" });
    }

    if (babyGender && !isValidBabyGender(babyGender)) {
      return res.status(400).json({ error: "Invalid babyGender" });
    }

    // Determine weeksPregnant:
    // prefer explicit weeksPregnant (number) if provided and valid
    // else compute from lmpDate if available
    let weeks: number | null = null;
    if (weeksPregnant !== undefined && weeksPregnant !== null && weeksPregnant !== "") {

      const n = Number(weeksPregnant);
      if (!Number.isNaN(n) && Number.isFinite(n) && n >= 0) {
        weeks = Math.floor(n);
      } else {
        return res.status(400).json({ error: "Invalid weeksPregnant value" });
      }
    } else if (lmpDate) {
      const computed = computeWeeksFromLmp(lmpDate);
      if (computed !== null) weeks = computed;
    }

    // Build create payload
    const createData: any = {
      motherId: Number(userId),
      stage: mappedStage,
      babyName: babyName ?? null,
      lmpDate: lmpDate ? new Date(lmpDate) : null,
      babyGender: (babyGender as BabyGender) ?? null,
      ...(weeks !== null ? { weeksPregnant: weeks } : {}),
      createdAt: new Date(),
    };

    const created = await prisma.motherProfiles.create({
      data: createData,
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error("POST /api/mother-profiles error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const profile = await prisma.motherProfiles.findFirst({
      where: { motherId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    if (!profile) return res.status(404).json({ success: false, error: "No profile found" });

    return res.json({success: true, data: profile});
  } catch (err) {
    console.error("GET /api/mother-profiles/me error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;