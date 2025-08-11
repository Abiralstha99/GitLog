import express from 'express';
import 'dotenv/config.js';
import { Pool } from 'pg';

const pool = new Pool ({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  max: 10,    
  // How long (max) should I wait to connect to the database before giving up?
  // If it takes more than 20000 milliseconds (20 seconds) for the pool to give you a connection, it will throw an error.
  connectionTimeoutMillis: 20000,  
  
  // After 30000 milliseconds (30 seconds) of doing nothing, the pool will close that connection to save resources.
  idleTimeoutMillis: 30000,

  //  Node stays alive, because the pool might be waiting for new requests.
  allowExitOnIdle: false
}); 

export default pool;