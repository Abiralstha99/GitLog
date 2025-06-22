import express from "express";
import { getBooks, renderNewForm } from '../controllers/booksController.js';

const router = express.Router();

router.get('/', getBooks);

router.get('/new', renderNewForm);

export default router;
