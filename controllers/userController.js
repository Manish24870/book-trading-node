import User from "../models/User.js";

// Route = /api/user/get
// Function to get a single user profile
// Auth = true
export const getUserProfile = async (req, res, next) => {
  try {
    const userProfile = await User.findById(req.user._id);
    res.status(200).json({
      status: "Success",
      message: "Profile fetched successfully",
      userProfile,
    });
  } catch (err) {
    next(err);
  }
};
