import express from "express";
import {
  getBooks,
  renderNewForm,
  postBook,
  deleteBook,
  renderCurrentForm,
  updateBook
} from "../controllers/booksController.js";

import { getSignUp, signUp } from "../controllers/signUp.js";
import { login, logout, authenticateJWT } from '../controllers/authenticate.js';

const router = express.Router();

// Public routes
router.get("/", getBooks);
router.get("/new", renderNewForm);
router.get("/edit/:id", renderCurrentForm);
router.get('/signup', getSignUp);
router.post('/signup', signUp);
router.get('/login', (req, res) => res.render('login'));
router.post('/login', login);

// Protected routes (JWT required)
router.post("/new", authenticateJWT, postBook);
router.post("/delete/:id", authenticateJWT, deleteBook);
router.post('/edit/:id', authenticateJWT, updateBook);

// Logout route: use controller to clear JWT cookie and redirect with flash message
router.post('/logout', logout);

export default router;
