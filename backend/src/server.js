// express import
import express from 'express';
import cookieParser from 'cookie-parser';

import path from 'path';

import authRoutes from './modules/auth/routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import groupMessageRoutes from './modules/messages/groupMessages/routes/groupMessage.route.js';
import groupRoutes from './modules/groups/routes/group.route.js';
import userRoutes from './modules/users/routes/user.route.js';
import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';
import cors from "cors"
import { app, server } from './lib/socket.js';


const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

// middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials:true }))
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);           // Authentication endpoints
app.use("/api/messages", messageRoutes);    // Personal message endpoints
app.use("/api/messages", groupMessageRoutes);  // Group message endpoints
app.use("/api/groups", groupRoutes);        // Group management endpoints
app.use("/api/users", userRoutes);          // User profile endpoints



//make ready for deployment
if(ENV.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

const startServer = async () => {
    try {
        await connectDB(); // ⬅️ DB FIRST

        server.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Server startup failed:", err);
        process.exit(1);
    }
};


startServer();