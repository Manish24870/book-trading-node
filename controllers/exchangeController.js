import Book from "../models/Book.js";
import Exchange from "../models/Exchange.js";
import ApiError from "../utils/apiError.js";

// Route = GET /api/exchange/my-exchange-books
// Function to get my exchange books
// Auth = true
export const getMyExchangeBooks = async (req, res, next) => {
  try {
    const books = await Book.find({
      owner: req.user._id,
      listing: "Exchange",
    });
    res.status(200).json({
      status: "success",
      message: "Exchange books fetched successfully",
      books,
    });
  } catch (err) {
    next(err);
  }
};

// Route = GET /api/exchange/my-initiates
// Function to get my exchange initiates
// Auth = true
export const getMyInitiates = async (req, res, next) => {
  try {
    const myInitiates = await Exchange.find({
      "initiator.initiatorUser": req.user._id,
    })
      .populate("owner")
      .populate("initiator.initiatorBooks")
      .populate("initiator.initiatorUser")
      .populate({
        path: "bookWanted",
        model: "Book",
        populate: {
          path: "owner",
          model: "User",
        },
      });
    res.status(200).json({
      status: "success",
      message: "My initiates fetched successfully",
      myInitiates,
    });
  } catch (err) {
    next(err);
  }
};

// Route = POST /api/exchange/create
// Function to create a new exchange
// Auth = true
export const createExchange = async (req, res, next) => {
  try {
    let exchange;
    exchange = await Exchange.findOne({
      bookWanted: req.body.bookWanted,
    });

    // If the exchange is already created
    if (exchange) {
      let initiatorIndex = exchange.initiator.findIndex((el) =>
        el.initiatorUser.equals(req.user._id)
      );

      // If this user has already initiated the exchange
      if (initiatorIndex > -1) {
        exchange.initiator.splice(initiatorIndex, 1);
      } else {
        const initiatorData = {
          initiatorUser: req.user._id,
          initiatorBooks: req.body.booksGiven,
        };
        exchange.initiator.push(initiatorData);
      }
    } else {
      // If the exchange is not alreadt created
      const initiator = [
        {
          initiatorUser: req.user._id,
          initiatorBooks: req.body.booksGiven,
        },
      ];
      exchange = new Exchange({
        initiator,
        owner: req.body.bookOwner,
        bookWanted: req.body.bookWanted,
      });
    }

    await exchange.save();
    res.status(200).json({
      status: "success",
      message: "Book exchange initiated successfully",
      exchange,
    });
  } catch (err) {
    next(err);
  }
};

// Route = GET /api/exchange/my-offers
// Function to get my exchange offers
// Auth = true
export const getMyOffers = async (req, res, next) => {
  try {
    const myOffers = await Exchange.find({ owner: req.user._id })
      .populate("initiator.initiatorUser")
      .populate("initiator.initiatorBooks")
      .populate("owner")
      .populate("bookWanted");

    res.status(200).json({
      status: "success",
      message: "My exchange offers fetched successfully",
      myOffers,
    });
  } catch (err) {
    next(err);
  }
};

// Route = GET /api/exchange/accept-offer
// Function to accept an exchange offer
// Auth = true
export const acceptOffer = async (req, res, next) => {
  try {
    const exchange = await Exchange.findById(req.body.exchangeId);
    const initiatorIndex = exchange.initiator.findIndex((el) =>
      el._id.equals(req.body.initiatorItemId)
    );
    console.log(initiatorIndex);
    // If the book has already been exchanged
    if (exchange.isExchanged) {
      return next(new ApiError("This book has already been exchanged", 400));
    }

    exchange.isExchanged = true;
    exchange.initiator[initiatorIndex].offerStatus = "accepted";
    exchange.initiator[initiatorIndex].acceptedAt = Date.now();
    exchange.initiator.forEach((el, index) => {
      if (index !== initiatorIndex) {
        el.offerStatus = "rejected";
      }
    });

    await exchange.save();
    res.status(200).json({
      status: "success",
      message: "Offer accepted",
      exchange,
    });
  } catch (err) {
    next(err);
  }
};

// Route = GET /api/exchange/reject-offer
// Function to reject an exchange offer
// Auth = true
export const rejectOffer = async (req, res, next) => {
  try {
    const exchange = await Exchange.findById(req.body.exchangeId);
    const initiatorIndex = exchange.initiator.findIndex((el) =>
      el._id.equals(req.body.initiatorItemId)
    );
    exchange.initiator[initiatorIndex].offerStatus = "rejected";
    await exchange.save();
    res.status(200).json({
      status: "success",
      message: "Offer rejected",
      exchange,
    });
  } catch (err) {
    next(err);
  }
};
