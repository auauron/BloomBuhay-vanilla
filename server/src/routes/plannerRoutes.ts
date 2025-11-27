import { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";

interface BloomDate {
  day: number;
  date: number
  month: number;
  year: number;
};

interface BloomTime {
  hour: number;
  min: number;
  sec: number;
}

function translateBloomdate ( date: BloomDate ): string {
  return `${date.day}/${date.date}/${date.month}/${date.year}`
};

function translateBloomtime ( time: BloomTime ): string {
  return `${time.hour}/${time.min}/${time.sec}`
};

function getNow (): BloomDate {
  return { day: new Date().getDay(), date: new Date().getDate(), month: new Date().getMonth(), year: new Date().getFullYear() }
};

function getTime (): BloomTime {
  return { hour: new Date().getHours(), min: new Date().getMinutes(), sec: new Date().getSeconds() }
}

function taskID ( date: BloomDate, time: BloomTime ): number {
  return Number(`${date.date}${date.month}${date.year}/${time.hour}${time.min}${time.sec}`)
}

const router = Router();
const db = new PrismaClient();

interface CreateTaskRequest {
  title: string;
  description: string;
  startDate: BloomDate;
  endDate: BloomDate;
  days: number[];
  interval: number;
  time: BloomTime;
}

interface UpdateTaskRequest {
  isCompleted: boolean;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  days: number[];
  interval: number;
  time: string;
  updatedAt: string;
}

// this will get all tasks for the logged in user
router.get(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const tasks = await db.plannerTask.findMany({
        where: { userId },
        orderBy: [
          { startDate: "desc" },
          { updatedAt: "asc" }
        ]
      });

      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({ success: false, error: 'failed to fetch tasks' });
    }
  }
);

// this creates a new task
router.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const { title, description, startDate, endDate, days, interval, time } = req.body as CreateTaskRequest;

      if (!title || !title.trim()) {
        res.status(400).json({ success: false, error: "task title is required" })
        return;
      }

      if (!startDate) {
        res.status(400).json({ success: false, error: "task date is required" });
        return;
      }

      const task = await db.plannerTask.create({
        data: {
          userId,
          title: title.trim(),
          description: description?.trim(),
          startDate: translateBloomdate(startDate),
          endDate: translateBloomdate(endDate),
          days: days,
          interval: interval,
          time: translateBloomtime(time),
          dateCreated: String(taskID(getNow(), getTime())),
          isCompleted: false,
        },
      });

      res.status(201).json({ success: true, data: task });

    } catch (error) {
      console.error("Create task error:", error);
      res.status(500).json({ success: false, error: "failed to create task" });
    }
  }
);

// update task completion status
router.patch(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      const taskId = parseInt(req.params.id);

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      if (isNaN(taskId)) {
        res.status(400).json({ success: false, error: "Invalid task ID" });
        return;
      }

      // verify if task belongs to the user
      const existingTask = await db.plannerTask.findFirst({
        where: {
          id: taskId,
          userId
        }
      });

      if (!existingTask) {
        res.status(404).json({ success: false, error: "Task not found" });
        return;
      }

      const updateData = req.body as UpdateTaskRequest;

      const updated = await db.plannerTask.update({
        where: { id: taskId },
        data: updateData,
      });

      res.status(200).json({ success: true, data: updated })
    } catch (error) {
      console.error("Update task error:", error);
      res.status(500).json({ success: false, error: "failed to update task", });
    }
  }
);

// this delete task
router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      const taskId = parseInt(req.params.id);

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      if (isNaN(taskId)) {
        res.status(400).json({ success: false, error: "Invalid Task ID" });
        return;
      }

      const existingTask = await db.plannerTask.findFirst({
        where: { id: taskId, userId },
      });

      if (!existingTask) {
        res.status(404).json({ success: false, error: "Task not found" });
        return;
      }

      await db.plannerTask.delete({ where: { id: taskId }})

      res.status(200).json({
        success: true,
        message: "Task deleted successfully"
      })
      
    } catch (error) {
      console.error("Delete task error:", error);
      res.status(500).json({ success: false, error: "Failed to delete task" });
    }
  }
);

export default router