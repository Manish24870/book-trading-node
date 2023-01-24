import express from "express";

import upload from "../utils/multer.js";
import { getmyProfile, editProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/get", protect, getmyProfile);
router.post("/edit", upload.single("photo"), protect, editProfile);

export default router;
