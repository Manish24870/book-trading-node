import express from "express";

import {
  getMyAuctionBooks,
  getAuction,
  saveSettings,
  placeBid,
  subscribeToAuction,
} from "../controllers/auctionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/:bookId", protect, getAuction);
router.get("/my-auction-books", protect, getMyAuctionBooks);
router.post("/:bookId/save-settings", protect, saveSettings);
router.post("/:bookId/bid", protect, placeBid);
router.get("/:auctionId/subscribe", protect, subscribeToAuction);

export default router;
