import express from "express";
import { PrismaClient, Stage, BabyGender } from "@prisma/client";
import { authenticateToken, AuthRequest } from "../middleware/auth"; // adjust path if needed

const prisma = new PrismaClient();
const router = express.Router();

const uiStageToEnum = (ui?: string | null): Stage | null => {
  switch (ui) {
    case "Pregnant":
      return "pregnant";
    case "Postpartum":
      return "postpartum";
    case "Early Childcare":
      return "childcare";
    default:
      return null;
  }
};

const isValidStageEnum = (v: any): v is Stage =>
  ["pregnant", "postpartum", "childcare"].includes(String(v));

const isValidBabyGender = (v: any): v is BabyGender =>
  ["male", "female", "unknown", null].includes(String(v));

router.post("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId; // set by authenticateToken
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { stage: uiStage, babyName, lmpDate, babyGender } = req.body;

    const mappedStage = uiStageToEnum(uiStage);
    if (!mappedStage || !isValidStageEnum(mappedStage)) {
      return res.status(400).json({ error: "Invalid or missing stage" });
    }

    if (babyGender && !isValidBabyGender(babyGender)) {
      return res.status(400).json({ error: "Invalid babyGender" });
    }

    const created = await prisma.motherProfiles.create({
      data: {
        motherId: Number(userId),
        stage: mappedStage,
        babyName: babyName ?? null,
        lmpDate: lmpDate ? new Date(lmpDate) : null,
        babyGender: (babyGender as BabyGender) ?? null,
      },
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

    if (!profile) return res.status(404).json({ message: "No profile found" });

    return res.json(profile);
  } catch (err) {
    console.error("GET /api/mother-profiles/me error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;