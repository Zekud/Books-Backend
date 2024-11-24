const express = require("express");
const router = express.Router();
const Book = require("../models/book");

// GET /books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /books
router.post("/", async (req, res) => {
  const { title, author, isbn, publishedYear } = req.body;
  if (!title || !author || !isbn || !publishedYear) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const book = new Book({
    title,
    author,
    isbn,
    publishedYear,
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /books/:id
router.put("/:id", async (req, res) => {
  const { title, author, isbn, publishedYear } = req.body;
  if (!title || !author || !isbn || !publishedYear) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.title = title;
    book.author = author;
    book.isbn = isbn;
    book.publishedYear = publishedYear;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /books/:id
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.remove();
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Custom Endpoint: GET /books/recommendations
router.get("/recommendations", async (req, res) => {
  try {
    const books = await Book.find();
    const randomBook = books[Math.floor(Math.random() * books.length)];
    res.json(randomBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Custom Endpoint: POST /books/:id/favorite
router.post("/:id/favorite", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.favorite = true;
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
