import express from "express";
import {
  // addDeleteEntry,
  allotSlot,
  createEntry,
  //   slotFix,
} from "../controllers/entryController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.post("/entry", addDeleteEntry);
router.post("/allot", allotSlot);
router.post("/change", createEntry);
// router.post("/fix", slotFix);

export default router;
