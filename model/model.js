import express from 'express';
import 'dotenv/config.js';
import { Client } from 'pg';

const app = express();
const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect()
export default db;