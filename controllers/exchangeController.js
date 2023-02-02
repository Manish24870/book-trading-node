import Book from "../models/Book.js";
import Exchange from "../models/Exchange.js";

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
      let initiatorIndex = exchange.initiatorIndex.findIndex((el) =>
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
    res.status(201).json({
      status: "success",
      message: "Book exchange initiated successfully",
      exchange,
    });
  } catch (err) {
    next(err);
  }
};
