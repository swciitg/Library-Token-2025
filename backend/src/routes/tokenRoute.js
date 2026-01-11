import express from "express";
import { storeToken } from "../controllers/tokenController.js";

const router = express.Router();

router.post("/token/generate", storeToken);

export default router;
