import express from "express";
import {
  getBooks,
  renderNewForm,
  postBook,
  deleteBook,
  renderCurrentForm,
  updateBook
} from "../controllers/booksController.js";

const router = express.Router();

router.get("/", getBooks);

router.get("/new", renderNewForm);

router.post("/new", postBook);

router.post("/delete/:id", deleteBook);

router.get("/edit/:id", renderCurrentForm);

router.post('/edit/:id', updateBook);

export default router;
