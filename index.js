import express from 'express';
import 'dotenv/config.js';
import { Client } from 'pg';

const app = express();
const PORT = 3000;

app.listen(PORT, () =>{
    console.log(`Server running at PORT ${PORT}`);
    
})