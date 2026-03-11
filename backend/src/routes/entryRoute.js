import express from "express";
import {
  addDeleteEntry,
  checkStudentStatus,
} from "../controllers/entryController.js";
import { verifyTokenMiddleware } from "../middlewares/tokenMiddleware.js"

const router = express.Router();

router.post("/entry", verifyTokenMiddleware, addDeleteEntry);
router.get("/check-status", checkStudentStatus);
export default router;