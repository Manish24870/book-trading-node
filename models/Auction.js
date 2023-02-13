import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  },
  { timestamps: true }
);

const Auction = mongoose.model("Auction", auctionSchema);

export default Auction;
