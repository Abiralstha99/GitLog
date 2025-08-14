import express from 'express';
import 'dotenv/config.js';
import booksRouter from './routes/booksRouter.js';
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3000;

// Ensure critical secrets are present
if (!process.env.ACCESS_TOKEN_SECRET) {
  console.warn('Warning: ACCESS_TOKEN_SECRET is not set. JWT authentication will not be secure.');
}

app.set('view engine', 'ejs');
// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

// Parse cookies BEFORE any auth logic so req.cookies is available
app.use(cookieParser());

// flash middleware requires session; order: session -> flash
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

// now after I entered the session using secret now I can use flash
app.use(flash());

// Do not apply authenticateJWT globally; protect only specific routes in the router

app.use((req, res, next) => {
  res.locals.flash = req.flash();
  next();
});
// routes
console.log({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.use("/", booksRouter);
app.listen(PORT, () =>{
    console.log(`Server running at PORT ${PORT}`);
    
})