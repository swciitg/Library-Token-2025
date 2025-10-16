import express from "express";
import { addDeleteEntry } from "../controllers/entryController.js";

const router = express.Router();

router.post("/entry", addDeleteEntry);

export default router;