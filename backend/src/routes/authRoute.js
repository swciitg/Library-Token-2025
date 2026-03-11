import express from "express";
import { signup, login } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/auth/signup", signup);
router.post("/auth/login", login);

export default router;
