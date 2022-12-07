import express from "express";

import upload from "../utils/multer.js";
import { addBook, getAllBooks, getBook } from "../controllers/bookController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", protect, upload.array("images"), addBook);
router.get("/", protect, getAllBooks);
router.get("/:bookId", protect, getBook);

export default router;
