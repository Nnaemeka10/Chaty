import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();  
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true,
    },
});

io.use(socketAuthMiddleware);

const userSocketMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
    console.log(`A User connected: ${socket.user.username} (${socket.userId})`);

    const userId = socket.userId;

    //foe storing online users
    userSocketMap[userId] = socket.id;


    //Notify all clients about the updated online users
    io.emit("onlineUsers", Object.keys(userSocketMap));

    //with socket.on we can listen to events from clients
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.user.username} (${socket.userId})`);
        delete userSocketMap[userId];
        io.emit("onlineUsers", Object.keys(userSocketMap));
    });
});

export { app, server, io};