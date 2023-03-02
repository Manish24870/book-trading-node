import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalPrice: {
      type: String,
      required: true,
    },
    orderItems: [],
    shippingDetails: {},
    sellers: [],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
