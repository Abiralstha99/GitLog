import express from 'express';
import 'dotenv/config.js';
import booksRouter from './routes/booksRouter.js';
import pool from './model/model.js';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

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