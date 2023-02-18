import express from "express";

import { createConversation } from "../controllers/conversationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createConversation);

export default router;
