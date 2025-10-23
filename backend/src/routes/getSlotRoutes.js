import { Router } from "express";
import {
  getSlotByRollNumber,
  getAllSlot,
} from "../controllers/getSlotController.js";

const router = Router();
router.get("/slot/:roll_no", getSlotByRollNumber);
router.get("/all-slot", getAllSlot);
export default router;
