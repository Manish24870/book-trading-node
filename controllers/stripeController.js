import User from "../models/User.js";
import Stripe from "stripe";
import Wallet from "../models/Wallet.js";

// Route = POST /api/stripe/create-link
// Generate a stripe account link for user
// Auth = true
export const generateStripeAccountLink = async (req, res, next) => {
  try {
    const accountLink = await Stripe(process.env.STRIPE_KEY).accountLinks.create({
      account: req.user.stripeId,
      type: "account_onboarding",
      refresh_url: "http://localhost:5000/api/stripe/authorize",
      return_url: "http://localhost:3000/onboard",
    });
    return res.status(200).json({
      status: "success",
      message: "Stripe onboard link generated",
      link: accountLink.url,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Route = POST /api/stripe/onboard
// After stripe account creation success
// Auth = true
export const stripeAccountOnboard = async (req, res, next) => {
  try {
    const account = await Stripe(process.env.STRIPE_KEY).account.retrieve(req.user.stripeId);
    const wallet = await Wallet.findOne({ owner: req.user._id });

    if (account.details_submitted) {
      wallet.stripeOnboarded = true;
      await wallet.save();
      return res.status(200).json({
        status: "success",
        message: "Stripe onboard success",
      });
    } else {
      console.log("Onboarding Failed");
      return res.status(400).json({
        status: "fail",
        errorType: "stripe-error",
        error: "Stripe onboarding failed",
      });
    }
  } catch (err) {
    next(err);
  }
};

// Route = POST /api/stripe/authorize
// After the created stripe link expires
// Auth = true
export const stripeAuthorize = async (req, res, next) => {
  try {
    const accountLink = await Stripe(process.env.STRIPE_KEY).accountLinks.create({
      account: req.user.stripeId,
      type: "account_onboarding",
      refresh_url: "http://localhost:5000/api/books/stripe/authorize",
      return_url: "http://localhost:3000/onboard",
    });
    return res.status(200).json({
      status: "success",
      message: "Stripe onboard link generated",
      link: accountLink.url,
    });
  } catch (err) {
    next(err);
  }
};

// Route = POST /api/stripe/payment
// Pay in stripe
// Auth = true
export const stripePayment = async (req, res, next) => {
  try {
    const session = await Stripe(process.env.STRIPE_KEY).checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "product_1",
            },
            unit_amount: 10000,
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
          destination: "acct_1MSZnJPGt7Ac44Fm",
        },
      },
    });
    console.log(session);
    res.status(200).json({
      status: "success",
      message: "Stripe payment success",
      session,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const stripeCharge = async (req, res, next) => {
  try {
    const charge = await Stripe(process.env.STRIPE_KEY).charges.create({
      amount: 2000,
      currency: "usd",
      description: "Test charge",
      source: req.user.stripeId,
    });
    console.log(charge);
  } catch (err) {
    next(err);
  }
};
