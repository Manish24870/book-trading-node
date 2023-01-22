import express from "express";

import { loadWallet } from "../controllers/walletController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/load", protect, loadWallet);

export default router;
