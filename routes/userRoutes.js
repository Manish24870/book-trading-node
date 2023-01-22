import express from "express";

import { getUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/get", protect, getUserProfile);
// router.post("/login", protect, loginUser);

export default router;
