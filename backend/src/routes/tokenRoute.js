import express from "express";
import { storeToken, verifyToken } from "../controllers/tokenController.js";

const router = express.Router();

router.post("/token/generate", storeToken);
router.post("/token/verify", verifyToken);

export default router;
