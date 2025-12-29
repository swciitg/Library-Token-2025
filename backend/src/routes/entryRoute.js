import express from "express";
import {
  addDeleteEntry,
} from "../controllers/entryController.js";
import { verifyTokenMiddleware } from "../middlewares/tokenMiddleware.js"

const router = express.Router();

router.post("/entry", verifyTokenMiddleware, addDeleteEntry);

export default router;