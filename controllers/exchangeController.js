import Book from "../models/Book.js";

// Route = GET /api/exchange/my-exchange-books
// Function to get my exchange books
// Auth = true
export const getMyExchangeBooks = async (req, res, next) => {
  try {
    const books = await Book.find({
      owner: req.user._id,
      listing: "Exchange",
    });
    res.status(201).json({
      status: "success",
      message: "Exchange books fetched successfully",
      books,
    });
  } catch (err) {
    next(err);
  }
};
