import bcrypt from "bcryptjs";

import User from "../models/User.js";
import ApiError from "../utils/apiError.js";
import isEmpty from "../utils/isEmpty.js";
import inputValidator from "../validation/inputValidator.js";

// Route = /api/user/get
// Function to get my profile
// Auth = true
export const getmyProfile = async (req, res, next) => {
  try {
    const myProfile = await User.findById(req.user._id);
    res.status(200).json({
      status: "Success",
      message: "Profile fetched successfully",
      myProfile,
    });
  } catch (err) {
    next(err);
  }
};

// Route = /api/user/edit
// Function to edit a user profile
// Auth = true
export const editProfile = async (req, res, next) => {
  let validationData = { ...req.body };
  delete validationData["password"];
  delete validationData["confirmPassword"];
  const { errors, isValid } = inputValidator(validationData);

  console.log("BODY", req.body);

  if (!isValid) {
    return res.status(400).json({
      status: "fail",
      errorType: "invalid-input",
      error: errors,
    });
  }

  let newUserData = {
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    favoriteCategories: JSON.parse(req.body.favoriteCategories),
  };

  if (req.file) {
    newUserData.photo = req.file.path.replace(/\\/g, "/");
  }

  // Check for duplicate email or username
  let duplicateErrors = {};
  if (req.body.email !== req.user.email) {
    const foundEmail = await User.findOne({ email: req.body.email });
    if (foundEmail && !foundEmail._id.equals(req.user._id)) {
      duplicateErrors.email = "This email is taken";
    }
  }
  if (req.body.username !== req.user.username) {
    const foundUsername = await User.findOne({ username: req.body.username });
    if (foundUsername && !foundUsername._id.equals(req.user._id)) {
      duplicateErrors.username = "This username is taken";
    }
  }

  if (!isEmpty(duplicateErrors)) {
    return res.status(400).json({
      status: "fail",
      errorType: "invalid-input",
      error: duplicateErrors,
    });
  }

  // If user has input the password
  if (!isEmpty(req.body.password) || !isEmpty(req.body.confirmPassword)) {
    if (req.body.password === req.body.confirmPassword) {
      newUserData.password = await bcrypt.hash(req.body.password, 12);
    } else {
      return res.status(400).json({
        status: "fail",
        errorType: "invalid-input",
        error: {
          password: "The passwords do not match",
        },
      });
    }
  }

  // Update the user profile
  try {
    const user = await User.findOneAndUpdate({ _id: req.user._id }, newUserData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "Success",
      message: "Profile updated successfully",
      myProfile: user,
    });
  } catch (err) {
    next(err);
  }
};
