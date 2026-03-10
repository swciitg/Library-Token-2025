import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { blockSlot, unblockSlot } from "../controllers/adminController.js";

const router = express.Router();

// Protect all admin routes with authentication
router.use(authenticateToken);

// Block a slot
router.post("/admin/slot/block", blockSlot);

// Unblock a slot
router.post("/admin/slot/unblock", unblockSlot);

export default router;