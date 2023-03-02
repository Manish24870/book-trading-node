import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Exchange from "../models/Exchange.js";
import Order from "../models/Order.js";
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

// Route = /api/user/users
// Function to get all users
// Auth = true
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "Success",
      message: "Fetched users successfully",
      users,
    });
  } catch (err) {
    next(err);
  }
};

// Route = /api/user/change-role/:userId
// Function to change a user role
// Auth = true
export const changeRole = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.userId);
    user.role = req.body.newRole;
    await user.save();
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    next(err);
  }
};

// Route = /api/user/review/add
// Function to create a new review
// Auth = true
export const writeReview = async (req, res, next) => {
  console.log(req.body);
  try {
    const reviewedFor = await User.findById(req.body.reviewedFor);
    if (req.body.type === "exchange") {
      let exchange = await Exchange.findById(req.body.transaction);
      let reviewIndex = reviewedFor.reviews.findIndex(
        (review) =>
          req.user._id.equals(review.reviewedBy._id) && exchange._id.equals(req.body.transaction)
      );
      if (reviewIndex >= 0) {
        return res.status(400).json({
          status: "error",
          error: "Already reviewed",
        });
      }
    }

    if (req.body.type === "buy") {
      let order = await Order.findById(req.body.order);

      let orderItemIndex = order.orderItems.findIndex((el) => el._id == req.body.transaction);

      if (
        orderItemIndex > -1 &&
        reviewedFor.reviews.findIndex(
          (review) =>
            req.user._id.equals(review.reviewedBy._id) &&
            review.transaction === req.body.transaction
        ) > -1
      ) {
        return res.status(400).json({
          status: "error",
          error: "Already reviewed",
        });
      }
    }

    if (req.body.type === "auction") {
      let alreadyReviewed = reviewedFor.reviews.findIndex(
        (review) =>
          req.user._id.equals(review.reviewedBy._id) && review.transaction === req.body.transaction
      );

      if (alreadyReviewed > -1) {
        return res.status(400).json({
          status: "error",
          error: "Already reviewed",
        });
      }
    }

    const newReview = {
      reviewedBy: {
        username: req.user.username,
        email: req.user.email,
        photo: req.user.photo,
        _id: req.user._id,
        role: req.user.role,
      },
      transaction: req.body.transaction,
      reviewNumber: req.body.reviewNumber,
      reviewText: req.body.reviewText,
    };
    reviewedFor.reviews.push(newReview);

    await reviewedFor.save();

    res.status(200).json({
      status: "success",
      reviewedFor,
    });
  } catch (err) {
    next(err);
  }
};

// Route = /api/user/my-orders
// Function to get current user orders
// Auth = true
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate("buyer");
    res.status(200).json({
      status: "success",
      orders,
    });
  } catch (err) {
    next(err);
  }
};
