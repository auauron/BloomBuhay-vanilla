import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
  UserSignupRequest,
  UserLoginRequest,
  UserResponse,
  AuthResponse,
} from "../types/User";
import { validateSignupRequest, validateLoginRequest } from "../utils/validation";

const db = new PrismaClient();

// Helper function to convert User to UserResponse (removes password)
const toUserResponse = (user: any): UserResponse => {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// Generate JWT token
const generateToken = (userId: number, email: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ userId, email }, jwtSecret, {
    expiresIn: "24h",
  });
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

    // Generate token
    const token = generateToken(newUser.id, newUser.email);

    // Return response without password
    const response: AuthResponse = {
      success: true,
      token,
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
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
      return;
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    // Return response without password
    const response: AuthResponse = {
      success: true,
      token,
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
