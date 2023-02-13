import express from "express";

import { getMyAuctionBooks, getAuction, saveSettings } from "../controllers/auctionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/:bookId", protect, getAuction);
router.get("/my-auction-books", protect, getMyAuctionBooks);
router.post("/:bookId/save-settings", protect, saveSettings);

export default router;
