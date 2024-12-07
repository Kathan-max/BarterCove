import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { configureSocket } from './config/socket';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Connect to MongoDB
connectDB();

// Configure Socket.IO
configureSocket(httpServer);

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ["http://localhost:5173", "http://localhost:5174"]
}));
app.use(express.json());

// Uploads directory for static file serving
app.use('/uploads', express.static('uploads'));

// Routes
app.use(userRoutes);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;