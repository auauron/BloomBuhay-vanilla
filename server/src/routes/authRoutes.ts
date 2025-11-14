import { Router } from "express";
import {
  signup,
  login,
  refreshToken,
  logout,
} from "../controllers/authController";

const router = Router();
// registers new user
router.post("/signup", signup);
// login user
router.post("/login", login);
// refresh access token using refresh token 
router.post("/refresh", refreshToken);
// logout 
router.post("/logout", logout);

export default router;
