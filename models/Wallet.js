import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    stripeId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    transactions: [
      {
        transactionType: {
          type: String,
          required: true,
        },
        transactionDate: {
          type: Date,
          required: true,
          default: Date.now,
        },
        transactionAmount: {
          type: Number,
          required: true,
        },
      },
    ],
  },

  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
