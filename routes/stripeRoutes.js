import express from "express";
import Stripe from "stripe";
import {
  generateStripeAccountLink,
  stripeAccountOnboard,
  stripeAuthorize,
} from "../controllers/stripeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/create-link", protect, generateStripeAccountLink);
router.get("/authorize", protect, stripeAuthorize);
router.get("/onboard", protect, stripeAccountOnboard);

export default router;
