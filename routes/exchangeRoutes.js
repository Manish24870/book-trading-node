import express from "express";

import {
  getMyExchangeBooks,
  createExchange,
  getMyInitiates,
  getMyOffers,
} from "../controllers/exchangeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/my-exchange-books", protect, getMyExchangeBooks);
router.post("/create", protect, createExchange);
router.get("/my-initiates", protect, getMyInitiates);
router.get("/my-offers", protect, getMyOffers);

export default router;
