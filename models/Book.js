import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    listing: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
    },
    maturity: {
      type: String,
    },

    category: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
    },
    publisher: {
      type: String,
    },
    publishedDate: {
      type: String,
    },
    language: {
      type: String,
      required: true,
    },
    price: {
      type: String,
    },
    bookQuality: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          trim: true,
        },
      },
    ],
    discussion: [
      {
        question: {
          type: String,
          trim: true,
        },
        answer: {
          type: String,
          trim: true,
        },
        askedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
