import pool from "../model/model.js";

async function getBooks(req, res) {
  try {
    const result = await pool.query("SELECT * from books ");
    const books = result.rows;
    res.render("index", { books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Sorry, we couldn't load your book list. Please try again later.");
  }
}

async function renderNewForm(req, res) {
  try {
    res.render("form");
  } catch (error) {
    console.error("Error rendering new book form:", error);
    res.status(500).send("Sorry, we couldn't display the new book form. Please try again.");
  }
}

async function postBook(req, res) {
  try {
    // Require auth at controller level (defense-in-depth)
    if (!req.user) {
      req.flash('error', 'Please log in to add a book.');
      return res.redirect('/login');
    }

    const { title, author, rating, read_date, notes, cover_id } = req.body;
    if (!title) {
      req.flash('error', 'Book title is required.');
      return res.redirect('/new');
    }
    // Save the book with the logged-in user's ID
    await pool.query(
      'INSERT INTO books (title, author, rating, read_date, notes, cover_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [title, author, rating, read_date, notes, cover_id, req.user.id]
    );
    req.flash('success', 'Book added successfully!');
    res.redirect('/');
  } catch (error) {
    console.error("Error adding new book:", error);
    req.flash('error', "Sorry, we couldn't add your book. Please try again.");
    res.redirect('/new');
  }
}

async function deleteBook(req, res) {
  try {
    // Require auth at controller level (defense-in-depth)
    if (!req.user) {
      req.flash('error', 'Please log in to delete a book.');
      return res.redirect('/login');
    }
    const id = req.params.id;

    // Optional: ensure the book belongs to the logged-in user (tenancy safety)
    await pool.query("DELETE FROM books WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    req.flash('error', 'Book deleted successfully!');
    res.redirect('/');
  } catch (error) {
    console.error(`Error deleting book with ID ${req.params.id}:`, error);
    req.flash('error', "Sorry, we couldn't delete this book. Please try again.");
    res.redirect('/');
  }
}

async function renderCurrentForm(req, res) {
  try {
    const currentBookId = req.params.id;
    const data = await pool.query("SELECT * FROM books WHERE id = $1", [currentBookId]);
    const book = data.rows[0];

    if (!book) {
      return res.status(404).send("Book not found");
    }

    res.render("edit", { book });
  } catch (error) {
    console.error(`Error rendering edit form for book ID ${req.params.id}:`, error);
    res.status(500).send("Sorry, we couldn't display the edit form. Please try again.");
  }
}


async function updateBook(req, res) {
  try {
    // Require auth at controller level (defense-in-depth)
    if (!req.user) {
      req.flash('error', 'Please log in to update a book.');
      return res.redirect('/login');
    }

    const id = req.params.id;
    const { title, author, rating, read_date, notes, cover_id } = req.body;
    // Extracting the book data cause the data contains additional info related to the row in our database
    await pool.query(
      "UPDATE books SET title = $1, author = $2, rating = $3, read_date = $4, notes = $5, cover_id = $6 WHERE id = $7 AND user_id = $8",
      [title, author, rating, read_date, notes, cover_id, id, req.user.id]
    );
    req.flash('success', 'Book updated successfully!');
    res.redirect("/");
  } catch (error) {
    console.error(`Error updating book with ID ${req.params.id}:`, error);
    req.flash('error', "Sorry, we couldn't update this book. Please try again.");
    res.redirect(`/edit/${req.params.id}`);
  }
}

export { getBooks, renderNewForm, postBook, deleteBook, renderCurrentForm, updateBook };
