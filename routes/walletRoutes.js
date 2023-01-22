import express from "express";

import { loadWallet, getWallet, buyBook } from "../controllers/walletController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/load", protect, loadWallet);
router.get("/get", protect, getWallet);
router.post("/buy", protect, buyBook);

export default router;
