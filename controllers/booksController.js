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
    res.redirect('/');
  } catch (error) {
    res.status(500).send("Error");
  }
}
export { getBooks, renderNewForm, postBook };
