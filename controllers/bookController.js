import * as bookRepository from "../repository/bookRepository.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { randomUUID } from "crypto";

const checkBody = (req, res, next) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return next(new AppError("Title and author are required", 400));
  }
  next();
};

const checkID = async (req, res, next, val) => {
  try {
    const id = val;
    const books = await bookRepository.readData();
    const book = books.find((book) => book.id === id);
    if (!book) {
      return next(new AppError("Book not found", 404));
    }
    req.book = book;
    next();
  } catch (error) {
    return next(new AppError(error.message, 404));
  }
};

const getAllBooks = catchAsync(async (req, res, next) => {
  const books = await bookRepository.readData();
  res.status(200).json({
    status: "success",
    result: books.length,
    data: {
      books,
    },
  });
});

const getBook = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      book: req.book,
    },
  });
};

const createBook = catchAsync(async (req, res, next) => {
  const id = randomUUID();
  const newBook = { ...req.body, id };
  await bookRepository.createOne(newBook);
  res.status(201).json({
    status: "success",
    data: {
      book: newBook,
    },
  });
});

const updateBook = catchAsync(async (req, res, next) => {
  const newBook = await bookRepository.updateOne(req.book, req.body);
  res.status(200).json({
    status: "success",
    data: {
      book: newBook,
    },
  });
});

const deleteBook = catchAsync(async (req, res, next) => {
  await bookRepository.deleteOne(req.book);
  res.status(204).json({
    status: "success",
    data: {
      book: null,
    },
  });
});

export {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  checkID,
  checkBody,
};
