import { Router } from "express";
import {getSlotByRollNumber} from "../controllers/getSlotController.js";

const router = Router();
router.get("/slot/:roll_no", getSlotByRollNumber);
export default router;