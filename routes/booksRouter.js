import express from "express";
import { getBooks, renderNewForm, postBook } from '../controllers/booksController.js';

const router = express.Router();

router.get('/', getBooks);

router.get('/new', renderNewForm);

router.post('/new', postBook);

export default router;
