import Stripe from "stripe";
import Wallet from "../models/Wallet.js";

// LOAD THE WALLET
export const loadWallet = async (req, res, next) => {
  console.log("LOAD WALLET");
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

    console.log("WALLET LOADED");

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

// PAY FROM WALLET

// PAY OUT
