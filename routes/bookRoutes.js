import express from "express";

import upload from "../utils/multer.js";
import {
  addBook,
  getAllBooks,
  getBook,
  deleteBook,
  createQuestion,
  createAnswer,
  getAllBooksAdmin,
  changeAvailability,
  getSimilarListings,
} from "../controllers/bookController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", protect, upload.array("images"), addBook);
router.get("/", protect, getAllBooks);
router.get("/all", protect, getAllBooksAdmin);

router.get("/similar-listings/:isbn", protect, getSimilarListings);
router.get("/:bookId", protect, getBook);
router.delete("/bookId", protect, deleteBook);
router.post("/:bookId/question", protect, createQuestion);
router.post("/:bookId/answer", protect, createAnswer);
router.post("/change-availability/:bookId", protect, changeAvailability);

export default router;
