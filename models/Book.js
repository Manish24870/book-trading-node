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
      required: true,
    },
    bookQuality: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
