import express, { Request, Response } from "express";
import { PrismaClient, Stage, BabyGender } from "@prisma/client";

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

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      userId: bodyUserId,
      stage: uiStage,
      babyName,
      lmpDate,
      babyGender,
    } = req.body as {
      userId?: number | string;
      stage?: string;
      babyName?: string;
      lmpDate?: string;
      babyGender?: string;
    };

    const userId = bodyUserId;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "userId required (or enable auth middleware)" });
    }

    const mappedStage = uiStageToEnum(uiStage);
    if (!mappedStage || !isValidStageEnum(mappedStage)) {
      return res.status(400).json({
        error:
          "Invalid or missing stage. Expected UI values: 'Pregnant' | 'Postpartum' | 'Early Childcare'",
      });
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

export default router;
