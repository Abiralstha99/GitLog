import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../model/model.js';

async function login(req,res) {
    try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid username or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid username or password.' });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '2h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60 * 1000 // 2h
    });

    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed.' });
  }
}

async function authenticateJWT(req,res,next) {
    const authHeader = req.headers.authorization;
    const headerToken = authHeader.split(' ')[1];
    const cookieToken = req.cookies?.token;
    const token = cookieToken || headerToken;
    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if (err){
            return res.status(403).json({error: 'Invalid or expired token.'});
        }
        req.user = user;
        next();
    })
}

export {login, authenticateJWT};
