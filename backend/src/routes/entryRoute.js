import express from "express";
import { addDeleteEntry } from "../controllers/entryController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/entry", authenticateToken, addDeleteEntry);

export default router;