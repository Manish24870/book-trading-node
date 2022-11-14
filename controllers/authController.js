import jwt from "jsonwebtoken";

import User from "../models/User.js";
import inputValidator from "../validation/inputValidator.js";
import ApiError from "../utils/apiError.js";
import isEmpty from "../utils/isEmpty.js";

// Function to send a new auth token
const sendAuthToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.status(200).json({
    status: "success",
    data: {
      message: "Logged in successfully",
      user,
      token,
    },
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
      errors,
    });
  }

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    await newUser.save();
    newUser.password = undefined;
    sendAuthToken(newUser, res);
  } catch (err) {
    next(err);
  }
};
