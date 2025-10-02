import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../model/model.js";

async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      req.flash("error", "Username and password are required.");
      return res.redirect("/login");
    }
    const uname = username.trim().toLowerCase();
    const result = await pool.query(
      "SELECT * FROM users WHERE LOWER(username) = $1 LIMIT 1",
      [uname]
    );
    const user = result.rows[0];
    if (!user) {
      req.flash("error", "Invalid username or password.");
      return res.redirect("/login");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash("error", "Invalid username or password.");
      return res.redirect("/login");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true, // not accessible via JS
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60 * 1000, // 2h
    });

    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "Login failed. Please try again.");
    res.redirect("/login");
  }
}

async function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  req.flash("success", "Logged out.");
  res.redirect("/");
}

async function authenticateJWT(req, res, next) {
  const headerToken = req.headers.authorization?.split(" ")[1];
  const cookieToken = req.cookies?.token;
  const token = cookieToken || headerToken;
  if (!token) {
    // For SSR flows, redirect with flash
    req.flash("error", "Please log in to continue.");
    return res.redirect("/login");
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      req.flash("error", "Your session has expired. Please log in again.");
      return res.redirect("/login");
    }
    req.user = user;
    next();
  });
}

async function profile(req, res) {
  try {
    const userId = req.user?.id;
    console.log("Profile - req.user:", req.user); // Debug: check user info
    console.log("Profile - userId:", userId); // Debug: check userId
    if (!userId) {
      req.flash("error", "Please log in to view your profile.");
      return res.redirect("/login");
    }
    const { rows } = await pool.query(
      `SELECT id, title, author, rating, notes, cover_id, user_id
       FROM books
       WHERE user_id = $1
       ORDER BY id DESC`,
      [userId]
    );
    console.log("Profile - books found:", rows); // Debug: check what books are returned
    res.render("profile", { user: req.user, books: rows || [] });
  } catch (error) {
    console.error("Profile error:", error);
    req.flash("error", "Could not load your profile.");
    res.redirect("/");
  }
}
export { login, logout, authenticateJWT, profile };
