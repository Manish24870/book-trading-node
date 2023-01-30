import mongoose, { mongo } from "mongoose";

const exchangeSchema = new mongoose.Schema(
  {
    initiator: [
      {
        initiator: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        initiatorBooks: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
          },
        ],
        initiatedAt: {
          type: Date,
          default: Date.now,
        },
        offerStatus: {
          type: String,
          enum: ["accepted", "rejected", "pending"],
          default: "pending",
        },
        acceptedAt: {
          type: Date,
        },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isExchanged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Exchange = mongoose.model("Exchange", exchangeSchema);

export default Exchange;
