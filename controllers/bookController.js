import Book from "../models/Book.js";
import inputValidator from "../validation/inputValidator.js";
import ApiError from "../utils/apiError.js";

// Route = /api/books/add
// Function to add a new book listing
// Auth = true
export const addBook = async (req, res, next) => {
  const { errors, isValid } = inputValidator(req.body, "add-book");
  if (!isValid) {
    return res.status(400).json({
      status: "fail",
      errorType: "invalid-input",
      error: errors,
    });
  }
  const bookImages = req.files.map((file) => {
    const filePath = file.path.replace(/\\/g, "/");
    return {
      url: filePath,
    };
  });

  const newBook = new Book({
    title: req.body.title,
    listing: req.body.listing,
    isbn: req.body.isbn,
    author: req.body.author,
    category: req.body.category,
    description: req.body.description,
    publisher: req.body.publisher,
    publishedDate: req.body.publishedDate,
    language: req.body.language,
    price: req.body.price,
    bookQuality: req.body.bookQuality,
    owner: req.user._id,
    images: bookImages,
  });

  try {
    await newBook.save();
    res.status(201).json({
      status: "success",
      message: "Book added successfully",
      book: newBook,
    });
  } catch (err) {
    next(err);
  }
};
