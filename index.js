import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authroutes.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB()
const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });