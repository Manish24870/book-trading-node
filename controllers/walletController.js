import Stripe from "stripe";
import Wallet from "../models/Wallet.js";
import Order from "../models/Order.js";

// Route = GET /api/wallet
// Fetch a user wallet
// Auth = true
export const getWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ owner: req.user._id });
    res.status(200).json({
      status: "success",
      message: "Wallet fetched successfully",
      wallet,
    });
  } catch (err) {
    next(err);
  }
};

// Route = POST /api/wallet/load
// Load wallet with stripe money
// Auth = true
export const loadWallet = async (req, res, next) => {
  const loadAmount = req.body.amount / 130;
  try {
    const wallet = await Wallet.findById(req.user.wallet);

    const session = await Stripe(process.env.STRIPE_KEY).checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "load_wallet",
            },
            unit_amount: Math.floor(loadAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/my-profile",
      cancel_url: "http://localhost:3000/my-profile",
      payment_intent_data: {
        application_fee_amount: 10,
        transfer_data: {
          destination: req.user.stripeId,
        },
      },
    });
    wallet.stripeTransactions.push(session);
    wallet.amount += loadAmount * 130;
    await wallet.save();

    res.status(200).json({
      status: "success",
      message: "Wallet loaded successfully",
      sessionUrl: session.url,
      wallet,
    });
  } catch (err) {
    next(err);
  }
};

// Route = POST /api/wallet/buy
// Buy a book
// Auth = true
export const buyBook = async (req, res, next) => {
  try {
    const buyerWallet = await Wallet.findById(req.user.wallet);

    // Calculate total price and find all sellers
    let totalPrice = 0;
    let sellersId = [];
    let sellers = [];
    req.body.cartItems.forEach((el) => {
      totalPrice += el.price * el.quantity;
      if (!sellersId.includes(el.owner._id)) {
        sellersId.push(el.owner._id);
        sellers.push(el.owner);
      }
    });

    // If the buyer doesnt have enough funds
    if (buyerWallet.amount < totalPrice) {
      return res.status(400).json({
        status: "error",
        error: "Not enough balance",
      });
    }

    // Pay out all the sellers
    await Promise.all(
      sellers.map(async (seller) => {
        let sellerWallet = await Wallet.findById(seller.wallet);
        let sellerTotal = 0;
        req.body.cartItems.forEach((el) => {
          if (seller._id == el.owner._id) {
            sellerTotal += el.price * el.quantity;
          }
        });
        sellerWallet.amount += sellerTotal;
        sellerWallet.appTransactions.push({
          transactionType: "Book Payment",
          transactionAmount: totalPrice,
          buyer: req.user._id,
          seller: sellers,
          items: req.body.cartItems,
        });
        await sellerWallet.save();
      })
    );

    buyerWallet.amount -= totalPrice;
    buyerWallet.appTransactions.push({
      transactionType: "Book Payment",
      transactionAmount: totalPrice,
      buyer: req.user._id,
      seller: sellers,
      items: req.body.cartItems,
    });
    await buyerWallet.save();

    // Create an order
    const order = new Order({
      buyer: req.user._id,
      totalPrice,
      orderItems: req.body.cartItems,
      shippingDetails: req.body.shippingDetails,
    });

    await order.save();

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    next(err);
  }
};
