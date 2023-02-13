import Book from "../models/Book.js";
import Auction from "../models/Auction.js";
import ApiError from "../utils/apiError.js";

// Route = GET /api/auction/my-auction-books
// Function to get my auction books
// Auth = true
export const getMyAuctionBooks = async (req, res, next) => {
  try {
    const books = await Book.find({
      owner: req.user._id,
      listing: "Auction",
    });

    res.status(200).json({
      status: "success",
      message: "Auction books fetched successfully",
      books,
    });
  } catch (err) {
    next(err);
  }
};

// Route = GET /api/auction
// Function to get a single auction
// Auth = true
export const getAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findOne({ book: req.params.bookId, owner: req.user._id })
      .populate("book")
      .populate("owner");
    res.status(200).json({
      status: "success",
      message: "Auction fetched successfully",
      auction,
    });
  } catch (err) {
    next(err);
  }
};
