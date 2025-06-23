import db from "../model/model.js";

async function getBooks(req, res) {
  try {
    const result = await db.query("SELECT * from books ");
    const books = result.rows;
    res.render("index", { books });
  } catch (error) {
    res.status(500).send("Error");
  }
}

async function renderNewForm(req, res) {
  try {
    res.render("form");
  } catch (error) {
    res.status(500).send("Error");
  }
}

async function postBook(req, res) {
  try {
    const { title, author, rating, read_date, notes, cover_id } = req.body;
    if (!title) {
      return res.status(400).send("Book title is required");
    }
    await db.query(
      "INSERT INTO books (title, author, rating, read_date, notes, cover_id) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, author, rating, read_date, notes, cover_id]
    );
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error");
  }
}

async function deleteBook(req, res) {
  try {
    const id = req.params.id;
    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error");
  }
}

async function renderCurrentForm(req, res) {
  try {
    const currentBookId = req.params.id;
    const data = await db.query("SELECT * FROM books WHERE id = $1", [currentBookId]);
    const book = data.rows[0];

    if (!book) {
      return res.status(404).send("Book not found");
    }

    res.render("edit", { book });
  } catch (error) {
    res.status(500).send("Error rendering edit form");
  }
}


async function updateBook(req, res) {
  try {
    const id = req.params.id;
    const { title, author, rating, read_date, notes, cover_id } = req.body;
    // Extracting the book data cause the data contains additional info related to the row in our database
    await db.query(
      "UPDATE books SET title = $1, author = $2, rating = $3, read_date = $4, notes = $5, cover_id = $6 WHERE id = $7",
      [title, author, rating, read_date, notes, cover_id, id]
    );
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error");
  }
}
export { getBooks, renderNewForm, postBook, deleteBook, renderCurrentForm, updateBook };
