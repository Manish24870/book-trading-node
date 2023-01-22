import mongoose, { mongo } from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    stripeId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    stripeOnboarded: {
      type: Boolean,
      default: false,
    },
    stripeTransactions: [],
    appTransactions: [
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
