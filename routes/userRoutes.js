import express from "express";

import upload from "../utils/multer.js";
import {
  getmyProfile,
  editProfile,
  getUsers,
  changeRole,
  writeReview,
  getMyOrders,
  getMyBooks,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/get", protect, getmyProfile);
router.post("/edit", upload.single("photo"), protect, editProfile);
router.get("/users", protect, getUsers);
router.post("/change-role/:userId", protect, changeRole);
router.post("/review/add", protect, writeReview);
router.get("/my-orders", protect, getMyOrders);
router.get("/my-books", protect, getMyBooks);

export default router;
