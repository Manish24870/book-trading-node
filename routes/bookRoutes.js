import express from "express";
import Stripe from "stripe";

import upload from "../utils/multer.js";
import {
  addBook,
  getAllBooks,
  getBook,
  deleteBook,
  createQuestion,
  createAnswer,
} from "../controllers/bookController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", protect, upload.array("images"), addBook);
router.get("/", protect, getAllBooks);

router.get("/:bookId", protect, getBook);
router.delete("/bookId", protect, deleteBook);
router.post("/:bookId/question", protect, createQuestion);
router.post("/:bookId/answer", protect, createAnswer);

export default router;
