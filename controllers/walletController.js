import Stripe from "stripe";
import Wallet from "../models/Wallet.js";

// LOAD THE WALLET
export const loadWallet = async (req, res, next) => {
  const loadAmount = req.body.loadAmount / 130;
  try {
    const session = await Stripe(process.env.STRIPE_KEY).checkout.sessions.create({
      lineItems: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "load_wallet",
            },
            unit_amount: loadAmount * 100,
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
    res.status(200).json({
      status: "success",
      message: "Wallet loaded successfully",
      session,
    });
  } catch (err) {
    next(err);
  }
};

// PAY FROM WALLET

// PAY OUT
