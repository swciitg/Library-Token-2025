import express from "express";
import {
  addDeleteEntry,
  allotSlot,
  createEntry,
  //   slotFix,
} from "../controllers/entryController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { verifyTokenMiddleware } from "../middlewares/tokenMiddleware.js"

const router = express.Router();

router.post("/entry", verifyTokenMiddleware, addDeleteEntry);
router.post("/allot", verifyTokenMiddleware, allotSlot);
router.post("/change", verifyTokenMiddleware, createEntry);
// router.post("/fix", slotFix);

export default router;