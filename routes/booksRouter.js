import express from "express";
import {
  getBooks,
  renderNewForm,
  postBook,
  deleteBook,
  renderCurrentForm,
  updateBook
} from "../controllers/booksController.js";

import {getSignUp, signUp} from "../controllers/signUp.js"
import { login } from '../controllers/authenticate.js';

const router = express.Router();

router.get("/", getBooks);

router.get("/new", renderNewForm);

router.post("/new", authenticateJWT, postBook);

router.post("/delete/:id", authenticateJWT, deleteBook);

router.post('/edit/:id', authenticateJWT, updateBook);

router.get("/edit/:id", renderCurrentForm);

router.get('/signup',getSignUp);

router.post('/signup', signUp);

router.post('/login', login);

export default router;
