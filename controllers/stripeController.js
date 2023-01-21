import User from "../models/User.js";
import Stripe from "stripe";

// Route = POST /api/stripe/create-link
// Generate a stripe account link for user
// Auth = true
export const generateStripeAccountLink = async (req, res, next) => {
  console.log("AAA");
  try {
    const accountLink = await Stripe(process.env.STRIPE_KEY).accountLinks.create({
      account: req.user.stripeId,
      type: "account_onboarding",
      refresh_url: "http://localhost:5000/api/books/stripe/authorize",
      return_url: "http://localhost:5000/api/books/stripe/onboard",
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
    if (account.details_submitted) {
      req.user.stripeOnboarder = true;
      await req.user.save();
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
      return_url: "http://localhost:5000/api/books/stripe/onboard",
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
