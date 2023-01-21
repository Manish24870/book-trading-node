import jwt from "jsonwebtoken";
import Stripe from "stripe";

import User from "../models/User.js";
import inputValidator from "../validation/inputValidator.js";
import ApiError from "../utils/apiError.js";
import isEmpty from "../utils/isEmpty.js";

// Function to send a new auth token
const sendAuthToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
    user,
    token,
  });
};

// Route = /api/auth/register
// Function to register a new user
// Auth = false
export const registerUser = async (req, res, next) => {
  const { errors, isValid } = inputValidator(req.body, "register-user");

  if (!isValid) {
    return res.status(400).json({
      status: "fail",
      errorType: "invalid-input",
      error: errors,
    });
  }

  const stripeAccount = await Stripe(process.env.STRIPE_KEY).accounts.create({
    country: "US",
    type: "express",
    capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
    business_type: "individual",
    business_profile: { url: "https://github.com" },
    email: req.body.email,
  });

  const newUser = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    stripeId: stripeAccount.id,
  });

  try {
    await newUser.save();
    newUser.password = undefined;
    sendAuthToken(newUser, res);
  } catch (err) {
    next(err);
  }
};

// Route = /api/auth/login
// Function to login a new user
// Auth = false

export const loginUser = async (req, res, next) => {
  const { errors, isValid } = inputValidator(req.body);

  if (!isValid) {
    return res.status(400).json({
      status: "fail",
      errorType: "invalid-input",
      error: errors,
    });
  }

  try {
    const foundUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    }).select("+password");

    // Check if the username or email and password match
    if (!foundUser || !(await foundUser.comparePassword(req.body.password, foundUser.password))) {
      return next(new ApiError("The given credentials are invalid", "login-error", 401));
    }

    foundUser.password = undefined;
    sendAuthToken(foundUser, res);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
