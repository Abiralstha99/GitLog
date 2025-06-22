import express from "express";
import {
  getBooks,
  renderNewForm,
  postBook,
  deleteBook,
} from "../controllers/booksController.js";

const router = express.Router();

router.get("/", getBooks);

router.get("/new", renderNewForm);

router.post("/new", postBook);

router.post("/delete/:id", deleteBook);
export default router;
