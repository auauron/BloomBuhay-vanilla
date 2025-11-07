import { Router, Response } from "express";
import  { authenticateToken, AuthRequest } from '../middleware/auth';
import { PrismaClient } from "@prisma/client";

const router = Router();
const db = new PrismaClient();

// CRUD 

router.get(
    "/notes",
    authenticateToken,
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId  
            
        } catch (error) {

        }
    }
)