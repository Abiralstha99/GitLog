import express from 'express';
import 'dotenv/config.js';
import { Client } from 'pg';
import booksRouter from './routes/booksRouter.js';

const app = express();
const PORT = 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

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