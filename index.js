import express from 'express';
import 'dotenv/config.js';
import booksRouter from './routes/booksRouter.js';
import session from 'express-session';
import flash from 'connect-flash';
import { authenticateJWT } from './controllers/authenticate.js';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

//flash middlewire to display message when user made changes 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

// now after I entered the session using secret now I can use flash
app.use(flash());

// Middleware to protect routes
// Make sure to import or define authenticateJWT above
app.use(authenticateJWT);

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