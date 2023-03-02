import express from "express";

import upload from "../utils/multer.js";
import {
  getmyProfile,
  editProfile,
  getUsers,
  changeRole,
  writeReview,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/get", protect, getmyProfile);
router.post("/edit", upload.single("photo"), protect, editProfile);
router.get("/users", protect, getUsers);
router.post("/change-role/:userId", protect, changeRole);
router.post("/review/add", protect, writeReview);

export default router;
