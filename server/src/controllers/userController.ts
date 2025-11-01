import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface DeleteUserRequest {
  password: string;
}

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { password } = req.body as DeleteUserRequest;

    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    if (!password) {
      res.status(400).json({
        success: false,
        error: "Password is required to delete account",
      });
      return;
    }

    // Get user and verify password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }, // Only get password for verification
    });

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: "Invalid password",
      });
      return;
    }

    // Delete user and all related data in a transaction
    await prisma.$transaction(async (tx) => {
      // First revoke all refresh tokens
      await tx.refreshToken.updateMany({
        where: { userId },
        data: { revoked: true },
      });

      // Then delete the user (this will cascade delete related records due to onDelete: Cascade in schema)
      await tx.user.delete({
        where: { id: userId },
      });
    });

    res.status(200).json({
      success: true,
      message: "Account successfully deleted",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete account",
    });
  }
};