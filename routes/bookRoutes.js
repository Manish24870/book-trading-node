import express from "express";

import upload from "../utils/multer.js";
import { addBook, getAllBooks, getBooksByListing } from "../controllers/bookController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", protect, upload.array("images"), addBook);
router.get("/all", protect, getAllBooks);
router.get("/byListing", protect, getBooksByListing);

export default router;
