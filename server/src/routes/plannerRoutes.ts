import { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";

const router = Router();
const db = new PrismaClient;

interface CreateTaskRequest { 
    title: string;
    description?: string;
    date: string;
}

interface UpdateTaskRequest {
    isCompleted: boolean;
}

// this will get all tasks for the logged in user
router.get(
    "/", 
    authenticateToken,
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(401).json({ success: false, error: "Unauthorized"});
                return;
            }

            const tasks = await db.plannerTask.findMany({
                where: { userId },
                orderBy: [
                    {
                        date: "asc"
                    },
                    {
                        createdAt: "desc",
                    }
                ],
            });

            res.status(200).json({
                success: true,
                data: tasks,
            });
        } catch (error) {
            console.error("Get tasks error:", error);
            res.status(500).json({
                success: false,
                error: 'failed to fetch tasks',
            });
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
            const { title, description, date } = req.body as CreateTaskRequest;
            
            if (!userId) {
                res.status(401).json({success: false, error:"Unauthorized"});
                return;
            }

            if (!title || !title.trim()) {
                res.status(400).json({success: false, error: "task title is required"})
                return;
            }

            if (!date) {
                res.status(400).json({ success: false, error: "date is required"});
                return;
            }

            const task = await db.plannerTask.create({
                data: {
                    userId,
                    title: title.trim(),
                    description: description?.trim() || "",
                    date: new Date(date),
                    isCompleted: false,
                },
            });

            res.status(201).json({ success: true, date: task });
        } catch (error) {
            console.error("Create task error:", error);
            res.status(500).json({ success: true, error: "failed to fetch task"});
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
            const { isCompleted } = req.body as UpdateTaskRequest;

            if (!userId) {
                res.status(401).json({ success: false, error: "Unauthorized"});
                return;
            }
            
            if (isNaN(taskId)) {
                res.status(400).json({ success:false,error:"Invalid task ID"});
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
                res.status(404).json({
                    success:false,
                    error:"Task not found",
                });
                return;
            }

            const task = await db.plannerTask.update({
                where:{
                    id: taskId
                },
                data: { isCompleted },
            });

            res.status(200).json({success: true, data: task})
        } catch (error) {
            console.error("Update task error:", error);
            res.status(500).json({ success: false, error:"failed to update task",});
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
                res.status(401).json({ success: false, error: "Unautiorized"});
                return;
            }

            if (isNaN(taskId)) {
                res.status(400).json({ success: false, errror:"Invalid Task ID"});
                return;
            }
             
            const existingTask = await db.plannerTask.findFirst({
                where: { id: taskId, userId},
            });

            if (!existingTask) {
                res.status(404).json({success:true, error: "Task not found"});
                return;
            }

            await db.plannerTask.delete({
                where: { id: taskId }
            })

            res.status(200).json({
                success: true,
                message: "Task deleted successfully"
            })
        } catch (error) {
            console.error("Delete task error:", error);
            res.status(500).json({success: false, error: "Failed to delete task"});
        }
    }
);

export default router