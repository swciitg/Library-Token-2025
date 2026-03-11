import express from "express";
import { login } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/auth/login", login);

export default router;
