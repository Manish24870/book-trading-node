import express from "express";

import { getMyExchangeBooks, createExchange } from "../controllers/exchangeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/my-exchange-books", protect, getMyExchangeBooks);
router.post("/create", protect, createExchange);

export default router;
