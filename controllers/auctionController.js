import Book from "../models/Book.js";
import Auction from "../models/Auction.js";
import ApiError from "../utils/apiError.js";
import Wallet from "../models/Wallet.js";

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
    const auction = await Auction.findOne({ book: req.params.bookId })
      .populate("book")
      .populate("owner")
      .populate("participants.participant")
      .populate("activities.user");
    res.status(200).json({
      status: "success",
      message: "Auction fetched successfully",
      auction,
    });
  } catch (err) {
    next(err);
  }
};

// Route = POST /api/auction/:bookId/save-settings
// Function to save auction settings
// Auth = true
export const saveSettings = async (req, res, next) => {
  try {
    const auction = await Auction.findOne({ book: req.params.bookId, owner: req.user._id });
    auction.schedule.isScheduled = req.body.schedule.isScheduled;
    if (req.body.schedule.date) {
      auction.schedule.date = req.body.schedule.date;
    }
    if (req.body.schedule.endDate) {
      auction.schedule.endDate = req.body.schedule.endDate;
    }
    await auction.save();
    res.status(200).json({
      status: "success",
      message: "Auction settings saved successfully",
      auction,
    });
  } catch (err) {
    next(err);
  }
};

// Route = POST /api/auction/:bookId/bid
// Function to place a bid in the auction
// Auth = true
export const placeBid = async (req, res, next) => {
  try {
    const auction = await Auction.findOne({ book: req.params.bookId });

    let alreadyParticipated = auction.participants.findIndex((el) =>
      el.participant.equals(req.user._id)
    );

    // If the user has already participated in the auction
    if (alreadyParticipated > -1) {
      auction.participants[alreadyParticipated].bids.push({
        amount: req.body.amount,
        date: new Date(),
      });
    } else {
      auction.participants.push({
        participant: req.user._id,
        bids: [
          {
            amount: req.body.amount,
            date: new Date(),
          },
        ],
      });
    }

    // Create an activity in auction
    auction.activities.push({
      user: req.user._id,
      data: {
        bidAmount: req.body.amount,
        date: new Date(),
      },
    });
    await auction.save();

    const wallet = await Wallet.findOne({ owner: req.user._id });
    wallet.appTransactions.push({
      transactionType: "Auction bid",
      transactionAmount: req.body.amount,
    });
    console.log(wallet.amount, req.body.amount);
    wallet.amount -= req.body.amount;

    await wallet.save();

    const savedAuction = await Auction.findOne({ book: req.params.bookId })
      .populate("book")
      .populate("owner")
      .populate("participants.participant")
      .populate("activities.user");

    res.status(200).json({
      status: "success",
      message: "Bid placed successfully",
      auction: savedAuction,
    });
  } catch (err) {
    next(err);
  }
};

// Route = POST /api/auction/:auctionId/subscribe
// Function to subscribe to email started email for an auction
// Auth = true
export const subscribeToAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.auctionId);
    auction.emailSubscribers.push({ _id: req.user._id, email: req.user.email });
    await auction.save();
    res.status(200).json({
      status: "success",
      message: "Subscribed to auction successfully",
      auction,
    });
  } catch (err) {
    next(err);
  }
};

// Route = POST /api/auction/my-wins
// Function to get my auction wins
// Auth = true
export const getMyWins = async (req, res, next) => {
  try {
    const auctions = await Auction.find({ "winner.participant": req.user._id }).populate(
      "book owner"
    );
    res.status(200).json({
      status: "success",
      message: "Fetched my auction wins successfully",
      auctions,
    });
  } catch (err) {
    next(err);
  }
};
