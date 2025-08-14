import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../model/model.js';

async function login(req,res) {
    const {username, password} = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) {
        req.flash('error', 'Invalid username or password!');
        return res.redirect('/login');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        req.flash('error', 'Invalid username or password!');
        return res.redirect('/login');
    }
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
    if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }
}

async function authenticateJWT(req,res,next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
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
