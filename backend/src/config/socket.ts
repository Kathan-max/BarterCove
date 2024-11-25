import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Message } from '../types';

const userSocketMap = new Map<string, string>();

export const configureSocket = (httpServer: HttpServer) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ["http://localhost:5173", "http://localhost:5174"],
      methods: ["GET", "POST"]
    }
  });

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

  return io;
};