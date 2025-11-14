import { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { UserResponse } from "../types/User";
import bcrypt from "bcrypt";
import { validateEmail, ValidationResult } from "../utils/validation";
import { deleteUser } from "../controllers/userController";

const router = Router();
const db = new PrismaClient();

// Delete user account
router.delete("/delete", authenticateToken, deleteUser);

// helper function to remove password since its not suppose to return the password
const toUserResponse = (user: any): UserResponse => {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

router.get(
  "/me",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await db.user.findUnique({
        where: { id: req.userId },
        include: {
          MotherProfiles: true, // fetch profile
        },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      const profile = user.MotherProfiles?.[0] || null;
      const bloomStage = profile?.stage || "unknown";

      res.status(200).json({
        success: true,
        user: toUserResponse(user),
        profile,
        bloomStage,
      });
    } catch (error) {
      console.error("Get user profile error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch user profile",
      });
    }
  }
);


router.put(
  "/me",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { fullName, email, password, confirmPassword, profilePic } =
        req.body;
      const validation = new ValidationResult();

      // Validate fullName if provided
      if (fullName !== undefined) {
        if (!fullName || fullName.trim().length === 0) {
          validation.addError("fullName", "Full name is required");
        } else if (fullName.trim().length < 2) {
          validation.addError(
            "fullName",
            "Full name must be at least 2 characters long"
          );
        }
      }

      // Validate email if provided
      if (email !== undefined) {
        if (!email || email.trim().length === 0) {
          validation.addError("email", "Email is required");
        } else if (!validateEmail(email)) {
          validation.addError("email", "Invalid email format");
        } else {
          // Check if email is already taken by another user
          const existingUser = await db.user.findUnique({
            where: { email: email.trim() },
          });

          if (existingUser && existingUser.id !== req.userId) {
            validation.addError(
              "email",
              "Email is already taken by another user"
            );
          }
        }
      }

      // Validate password if provided
      if (password) {
        if (!confirmPassword) {
          validation.addError(
            "confirmPassword",
            "Password confirmation is required"
          );
        } else if (password !== confirmPassword) {
          validation.addError("confirmPassword", "Passwords do not match");
        } else if (password.length < 8) {
          validation.addError(
            "password",
            "Password must be at least 8 characters long"
          );
        } else if (!/[A-Z]/.test(password)) {
          validation.addError(
            "password",
            "Password must contain at least one uppercase letter"
          );
        } else if (!/[a-z]/.test(password)) {
          validation.addError(
            "password",
            "Password must contain at least one lowercase letter"
          );
        } else if (!/[0-9]/.test(password)) {
          validation.addError(
            "password",
            "Password must contain at least one number"
          );
        }
      }

      if (!validation.isValid()) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          errors: validation.getErrors(),
        });
        return;
      }

      // Get current user
      const currentUser = await db.user.findUnique({
        where: { id: req.userId },
      });

      if (!currentUser) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      // Prepare update data
      const updateData: any = {};
      if (fullName !== undefined) {
        updateData.fullName = fullName.trim();
      }
      if (email !== undefined) {
        updateData.email = email.trim();
      }
      if (profilePic !== undefined) {
        updateData.profilePic = profilePic?.trim?.() || null;
      }
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      // Update user
      const updatedUser = await db.user.update({
        where: { id: req.userId },
        data: updateData,
      });

      res.status(200).json({
        success: true,
        user: toUserResponse(updatedUser),
      });
    } catch (error) {
      console.error("Update user profile error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update user profile",
      });
    }
  }
);

// Delete user account (requires password confirmation)
router.delete("/me", authenticateToken, deleteUser);

export default router;
