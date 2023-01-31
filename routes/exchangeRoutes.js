import express from "express";

import { getMyExchangeBooks } from "../controllers/exchangeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/my-exchange-books", protect, getMyExchangeBooks);

export default router;
