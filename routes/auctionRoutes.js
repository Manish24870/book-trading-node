import express from "express";

import { getMyAuctionBooks } from "../controllers/auctionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/my-auction-books", protect, getMyAuctionBooks);

export default router;
