import jwt from "jsonwebtoken";

import User from "../models/User";
import inputValidator from "../validation/inputValidator";
import ApiError from "../utils/apiError";
import isEmpty from "../utils/isEmpty";

// Route = /api/auth/register
// Function to register a new user
// Auth = false

export const registerUser = async (req, res, next) => {
  try {
    const { errors, isValid } = inputValidator(req.body, "register-user");
  } catch (err) {}
};
