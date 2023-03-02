import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      default:
        "https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
      select: false,
    },
    role: {
      type: String,
      emum: ["admin", "user"],
      required: true,
      default: "user",
    },
    favoriteCategories: [
      {
        type: String,
      },
    ],
    stripeId: {
      type: String,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
    reviews: [],
  },
  { timestamps: true }
);

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare input password with database password
userSchema.methods.comparePassword = async function (inputPassword, dbPassword) {
  return await bcrypt.compare(inputPassword, dbPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
