import prisma from "../prisma/prismaClient.js";

async function getBooks(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      // If not logged in, redirect to signup page
      return res.redirect("/signup");
    }

    const books = await prisma.books.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        id: "desc",
      },
    });
    res.render("index", { books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res
      .status(500)
      .send("Sorry, we couldn't load your book list. Please try again later.");
  }
}

async function renderNewForm(req, res) {
  try {
    res.render("form");
  } catch (error) {
    console.error("Error rendering new book form:", error);
    res
      .status(500)
      .send("Sorry, we couldn't display the new book form. Please try again.");
  }
}

async function postBook(req, res) {
  try {
    // Require auth at controller level (defense-in-depth)
    if (!req.user) {
      req.flash("error", "Please log in to add a book.");
      return res.redirect("/login");
    }

    const { title, author, rating, read_date, notes, cover_id } = req.body;

    if (!title) {
      req.flash("error", "Book title is required.");
      return res.redirect("/new");
    }

    await prisma.books.create({
      data: {
        title,
        author,
        rating: rating ? parseInt(rating) : null, // Convert to number if provided
        read_date: read_date ? new Date(read_date) : null, // Convert to Date if provided
        notes,
        cover_id,
        user_id: req.user.id,
      },
    });
    req.flash("success", "Book added successfully!");
    res.redirect("/");
  } catch (error) {
    console.error("Error adding new book:", error);
    req.flash("error", "Sorry, we couldn't add your book. Please try again.");
    res.redirect("/new");
  }
}

async function deleteBook(req, res) {
  try {
    // Require auth at controller level (defense-in-depth)
    if (!req.user) {
      req.flash("error", "Please log in to delete a book.");
      return res.redirect("/login");
    }
    const id = req.params.id;

    // Optional: ensure the book belongs to the logged-in user (tenancy safety)
    await prisma.books.delete({
      where: {
        id: id,
        user_id: req.user.id, // Ensures user can only delete their own books
      },
    });
    req.flash("error", "Book deleted successfully!");
    res.redirect("/");
  } catch (error) {
    console.error(`Error deleting book with ID ${req.params.id}:`, error);
    req.flash(
      "error",
      "Sorry, we couldn't delete this book. Please try again."
    );
    res.redirect("/");
  }
}

async function renderCurrentForm(req, res) {
  try {
    const currentBookId = req.params.id;
    const book = await prisma.books.findUnique({
      where: {
        id: currentBookId,
      },
    });

    if (!book) {
      return res.status(404).send("Book not found");
    }

    res.render("edit", { book });
  } catch (error) {
    console.error(
      `Error rendering edit form for book ID ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .send("Sorry, we couldn't display the edit form. Please try again.");
  }
}

async function updateBook(req, res) {
  try {
    // Require auth at controller level (defense-in-depth)
    if (!req.user) {
      req.flash("error", "Please log in to update a book.");
      return res.redirect("/login");
    }

    const id = req.params.id;
    const { title, author, rating, read_date, notes, cover_id } = req.body;
    // Extracting the book data cause the data contains additional info related to the row in our database
    await prisma.books.update({
      where: {
        id: id,
        user_id: req.user.id, // Ensures user can only update their own books
      },
      data: {
        title,
        author,
        rating: rating ? parseInt(rating) : null,
        read_date: read_date ? new Date(read_date) : null,
        notes,
        cover_id,
      },
    });
    req.flash("success", "Book updated successfully!");
    res.redirect("/");
  } catch (error) {
    console.error(`Error updating book with ID ${req.params.id}:`, error);
    req.flash(
      "error",
      "Sorry, we couldn't update this book. Please try again."
    );
    res.redirect(`/edit/${req.params.id}`);
  }
}

export {
  getBooks,
  renderNewForm,
  postBook,
  deleteBook,
  renderCurrentForm,
  updateBook,
};
