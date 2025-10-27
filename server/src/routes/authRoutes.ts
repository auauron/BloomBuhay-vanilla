import { Router } from "express";
import { signup, login } from "../controllers/authController";

const router = Router();
// registers new user
router.post("/signup", signup);
// login
router.post("/login", login);

export default router;
