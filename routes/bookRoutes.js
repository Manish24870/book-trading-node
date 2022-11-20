import express from "express";

import upload from "../utils/multer.js";
import { addBook } from "../controllers/bookController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", protect, upload.array("images"), addBook);

export default router;
