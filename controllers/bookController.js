import Book from "../models/Book.js";
import Auction from "../models/Auction.js";
import inputValidator from "../validation/inputValidator.js";
import { booksCosineSimilarity } from "../utils/cosineSimilarity.js";

// Route = POST /api/books/add
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
    price: req.body.listing === "Sell" ? req.body.price : 0,
    bookQuality: req.body.bookQuality,
    owner: req.user._id,
    images: bookImages,
    maturity: req.body.maturity ? req.body.maturity : "",
    publisher: req.body.publisher ? req.body.publisher : "",
  });

  try {
    await newBook.save();

    // Create a new auction if the listing type is auction
    if (newBook.listing === "Auction") {
      const newAuction = new Auction({
        owner: req.user._id,
        book: newBook._id,
      });
      await newAuction.save();
    }

    res.status(201).json({
      status: "success",
      message: "Book added successfully",
      book: newBook,
    });
  } catch (err) {
    next(err);
  }
};

// Route = GET /api/books
// Function to fetch all books
// Auth = true
export const getAllBooks = async (req, res, next) => {
  const { page = 1, limit = 10, type = "All" } = req.query;
  let books, count;
  try {
    if (type === "All") {
      books = await Book.find({ available: true })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort("-createdAt")
        .populate("owner");
      count = await Book.countDocuments();
    } else {
      books = await Book.find({ listing: type, available: true })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort("-createdAt")
        .populate("owner");
      count = await Book.countDocuments({ listing: type });
    }

    res.status(200).json({
      status: "Success",
      message: "Books fetched successfully",
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
};

// Route = GET /api/books/all
// Function to fetch all available and unavailable
// Auth = true
export const getAllBooksAdmin = async (req, res, next) => {
  try {
    const books = await Book.find().sort("-createdAt").populate("owner");

    res.status(200).json({
      status: "Success",
      message: "Books fetched successfully",
      books,
    });
  } catch (err) {
    next(err);
  }
};

// Route = GET /api/books
// Function to fetch all books
// Auth = true
export const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId).populate("owner");
    const Books = await Book.find().populate("owner");
    Books.forEach((book2) => {
      const similarity = booksCosineSimilarity(book, book2);
      console.log(similarity);
    });
    res.status(200).json({
      status: "Success",
      message: "Book fetched successfully",
      book,
    });
  } catch (err) {
    next(err);
  }
};

// Route = DELETE /api/books/:bookId
// Function to delete a book
// Auth = true
export const deleteBook = async (req, res, next) => {
  try {
    await Book.findByIdAndDelete(req.params.bookId);
    res.status(200).json({
      status: "Success",
      message: "Book deleted successfully",
    });
    // TODO delete book from favorites and others also
  } catch (err) {
    next(err);
  }
};

// Route = POST /api/books/:bookId/question
// Function to create a new question
// Auth = true
export const createQuestion = async (req, res, next) => {
  const { errors, isValid } = inputValidator(req.body);
  if (!isValid) {
    return res.status(400).json({
      status: "fail",
      errorType: "invalid-input",
      error: errors,
    });
  }
  try {
    const book = await Book.findById(req.params.bookId).populate("owner");

    const newQuestion = {
      question: req.body.question,
      askedBy: req.user._id,
    };
    book.discussion.push(newQuestion);
    await book.save();
    res.status(200).json({
      status: "Success",
      message: "Question created successfully",
      book,
    });
  } catch (err) {
    next(err);
  }
};

// Route = POST /api/books/:bookId/answer
// Function to create a new answer
// Auth = true
export const createAnswer = async (req, res, next) => {
  const { errors, isValid } = inputValidator(req.body);
  if (!isValid) {
    return res.status(400).json({
      status: "fail",
      errorType: "invalid-input",
      data: {
        errors,
      },
    });
  }

  try {
    const book = await Book.findById(req.params.bookId).populate("owner");
    const questionIndex = book.discussion.findIndex((el) => el._id.equals(req.body.questionId));
    book.discussion[questionIndex].answer = req.body.answer;
    await book.save();

    res.status(200).json({
      status: "Success",
      message: "Question created successfully",
      book,
    });
  } catch (err) {
    next(err);
  }
};

// Route= /api/books/change-availability/:bookId
// Function to change a book availability
export const changeAvailability = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.bookId).populate("owner");
    console.log(req.body);
    book.available = req.body.newAvailability;
    await book.save();
    res.status(200).json({
      status: "success",
      book,
    });
  } catch (err) {
    next(err);
  }
};

// Route= /api/books/similar-listings/:isbn
// Function to get similar listings by isbn
export const getSimilarListings = async (req, res, next) => {
  try {
    const books = await Book.find({ isbn: req.params.isbn }).populate("owner");
    const newBooks = [];
    for (let book of books) {
      if (book.listing === "Auction") {
        let auction = await Auction.findOne({ book: book._id });
        const clonedBook = JSON.parse(JSON.stringify(book));
        clonedBook.winner = auction.winner;
        newBooks.push(clonedBook);
      } else {
        newBooks.push(book);
      }
    }

    res.status(200).json({
      status: "success",
      books: newBooks,
    });
  } catch (err) {
    next(err);
  }
};
