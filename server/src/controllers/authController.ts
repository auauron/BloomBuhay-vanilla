import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import {
  UserSignupRequest,
  UserLoginRequest,
  UserResponse,
  AuthResponse,
} from "../types/User";
import {
  validateSignupRequest,
  validateLoginRequest,
} from "../utils/validation";

const db = new PrismaClient();

// Helper function to convert User to UserResponse (removes password)
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

// Generate JWT token (access token) using env-configurable expiry
const generateToken = (userId: number, email: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const jwtExpires = process.env.JWT_EXPIRES || "1h"; // e.g. "1h", "24h", "7d"

  return jwt.sign(
    { userId, email },
    jwtSecret as string,
    { expiresIn: jwtExpires } as any
  );
};

// Generate and persist a refresh token
const generateRefreshToken = async (userId: number): Promise<string> => {
  // create a random token string
  const token = crypto.randomBytes(48).toString("hex");

  // refresh token expiry in days (configurable)
  const expiresDays = parseInt(
    process.env.REFRESH_TOKEN_EXPIRES_DAYS || "7",
    10
  );
  const expiresAt = new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000);

  await (db as any).refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const signupData = req.body as UserSignupRequest;

    // Validate input
    const validation = validateSignupRequest(signupData);
    if (!validation.isValid()) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: validation.getErrors(),
      });
      return;
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: signupData.email },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        error: "User with this email already exists",
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(signupData.password, 10);

    // Create user
    const newUser = await db.user.create({
      data: {
        fullName: signupData.fullName,
        email: signupData.email,
        password: hashedPassword,
      },
    });

    // Generate access token and refresh token
    const token = generateToken(newUser.id, newUser.email);
    const refresh = await generateRefreshToken(newUser.id);

    // Return response without password (include refresh token)
    const response: AuthResponse = {
      success: true,
      token,
      refreshToken: refresh,
      user: toUserResponse(newUser),
    };

    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(201).json(response);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create user account",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginData = req.body as UserLoginRequest;

    // Validate input
    const validation = validateLoginRequest(loginData);
    if (!validation.isValid()) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: validation.getErrors(),
      });
      return;
    }

    // Find user by email (not fullName!)
    const user = await db.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
      return;
    }

    // Generate access token and refresh token
    const token = generateToken(user.id, user.email);
    const refresh = await generateRefreshToken(user.id);

    // Return response without password (include refresh token)
    const response: AuthResponse = {
      success: true,
      token,
      refreshToken: refresh,
      user: toUserResponse(user),
    };

    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };

    if (!refreshToken) {
      res
        .status(400)
        .json({ success: false, error: "refreshToken is required" });
      return;
    }

    const tokenRecord = await (db as any).refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!tokenRecord || tokenRecord.revoked) {
      res.status(401).json({ success: false, error: "Invalid refresh token" });
      return;
    }

    if (new Date(tokenRecord.expiresAt) < new Date()) {
      res.status(401).json({ success: false, error: "Refresh token expired" });
      return;
    }

    const user = await db.user.findUnique({
      where: { id: tokenRecord.userId },
    });
    if (!user) {
      res.status(401).json({ success: false, error: "Invalid token user" });
      return;
    }

    // Revoke the used refresh token (rotation)
    await (db as any).refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revoked: true },
    });

    // Issue new tokens
    const newAccessToken = generateToken(user.id, user.email);
    const newRefresh = await generateRefreshToken(user.id);

    res
      .status(200)
      .json({ success: true, token: newAccessToken, refreshToken: newRefresh });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ success: false, error: "Failed to refresh token" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };

    if (!refreshToken) {
      res
        .status(400)
        .json({ success: false, error: "refreshToken is required" });
      return;
    }

    // Revoke any matching refresh tokens
    await (db as any).refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, error: "Logout failed" });
  }
};
