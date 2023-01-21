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
  stripeTest,
} from "../controllers/bookController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/stripe", stripeTest);
// router.get("/stripe-ref", async (req, res, next) => {
//   const acctLink = await Stripe(
//     "sk_test_51MSJebAffzcoqh8LpOwpTuKoRT0tr4SIYayS5KPuCDWwm8YT2nJ2NRzpzls6X2AlOGaTRnWxbCFSvlxnizNBvVQh00FEoJpusN"
//   ).accountLinks.create({
//     account: "acct_1MSaNiPB8mMlCkl5",
//     refresh_url: "http://localhost:5000/api/books/stripe-ref",
//     return_url: "http://localhost:5000/api/books/stripe-ret",
//     type: "account_onboarding",
//   });
//   console.log(acctLink);
// });
router.post("/add", protect, upload.array("images"), addBook);
router.get("/", protect, getAllBooks);

router.get("/:bookId", protect, getBook);
router.delete("/bookId", protect, deleteBook);
router.post("/:bookId/question", protect, createQuestion);
router.post("/:bookId/answer", protect, createAnswer);

export default router;
