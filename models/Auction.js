import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    isAuctioned: {
      type: Boolean,
      default: false,
    },
    auctionable: {
      type: Boolean,
      default: false,
    },
    started: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    winner: {},
    schedule: {
      isScheduled: {
        type: Boolean,
        default: false,
      },
      date: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
    participants: [
      {
        participant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        bids: [],
      },
    ],
    activities: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        data: {},
      },
    ],
    emailSubscribers: [],
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Auction = mongoose.model("Auction", auctionSchema);

export default Auction;
