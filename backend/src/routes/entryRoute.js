import express from "express";
import {
  addDeleteEntry,
  getTimelapsed,
} from "../controllers/entryController.js";
import { verifyTokenMiddleware } from "../middlewares/tokenMiddleware.js"

const router = express.Router();

router.post("/entry", verifyTokenMiddleware, addDeleteEntry);
router.get("/getTimelapsed", getTimelapsed);
export default router;