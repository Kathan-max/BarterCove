import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
// process.env.
const isDevelopment = process.env.NODE_ENV !== 'production';
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ["http://localhost:5173", "http://localhost:5174"]; // default for development
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin:  allowedOrigins,
    methods: ["GET", "POST"]
  }
});

app.use(cors());

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

const userSocketMap = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('user connected', (userId: string) => {
    userSocketMap.set(userId, socket.id);
  });

  socket.on('private message', (message: Message) => {
    const receiverSocketId = userSocketMap.get(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('private message', message);
    }
    // socket.emit('private message', message);
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});