import jwt from "jsonwebtoken";

import ApiError from "../utils/apiError.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("You are not authorized", "auth-error", 401));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new ApiError("This user is not authorized", "auth-error", 401));
  }

  req.user = currentUser;
  next();
};
