import bcrypt from 'bcrypt';
import pool from '../model/model.js';

async function getSignUp(req, res) {
  res.render('signup');
}

async function signUp(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      req.flash('error', 'Username and password are required.');
      return res.redirect('/signup');
    }

    const uname = username.trim();

    // Ensure unique username (case-insensitive)
    const existing = await pool.query(
      'SELECT 1 FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1',
      [uname]
    );
    if (existing.rowCount > 0) {
      req.flash('error', 'Username already taken. Please choose another.');
      return res.redirect('/signup');
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [uname, hash]
    );

    req.flash('success', 'Signup successful! Please log in.');
    res.redirect('/login');
  } catch (error) {
    console.error('Signup error:', error);
    req.flash('error', 'Signup failed. Please try again.');
    res.redirect('/signup');
  }
}

export { getSignUp, signUp }
