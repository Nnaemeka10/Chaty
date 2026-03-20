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

//use function to check if the user is online or not
export function getReceiverSocket(userId) {
    return userSocketMap[userId];
}

const userSocketMap = {}; //{userId: socketId}
const userGroupsMap = {}; //{userId: [groupId1, groupId2, ...]}

io.on("connection", (socket) => {
    console.log(`A User connected: ${socket.user.username} (${socket.userId})`);

    const userId = socket.userId;

    //foe storing online users
    userSocketMap[userId] = socket.id;
    if (!userGroupsMap[userId]) {
        userGroupsMap[userId] = [];
    }

    //Notify all clients about the updated online users
    io.emit("onlineUsers", Object.keys(userSocketMap));

    /**
     * GROUP CHAT HANDLERS
     * FAANG style: Efficient room management with Socket.io
     */
    
    // Join group room when user enters group chat
    socket.on("join-group", (groupId) => {
        try {
            const roomName = `group-${groupId}`;
            socket.join(roomName);
            
            if (!userGroupsMap[userId].includes(groupId)) {
                userGroupsMap[userId].push(groupId);
            }
            
            console.log(`User ${socket.user.username} joined group ${groupId}`);
            
            // Notify group members that user joined
            io.to(roomName).emit("userJoinedGroup", {
                userId,
                username: socket.user.username,
                groupId,
            });
        } catch (error) {
            console.error("Error in join-group event:", error);
        }
    });

    // Leave group room
    socket.on("leave-group", (groupId) => {
        try {
            const roomName = `group-${groupId}`;
            socket.leave(roomName);
            
            userGroupsMap[userId] = userGroupsMap[userId].filter(id => id !== groupId);
            
            console.log(`User ${socket.user.username} left group ${groupId}`);
            
            // Notify group members that user left
            io.to(roomName).emit("userLeftGroup", {
                userId,
                username: socket.user.username,
                groupId,
            });
        } catch (error) {
            console.error("Error in leave-group event:", error);
        }
    });

    /**
     * TYPING INDICATOR FOR GROUP CHATS
     * Debounced on frontend (3 second throttle)
     */
    socket.on("group-typing", ({ groupId, username }) => {
        try {
            const roomName = `group-${groupId}`;
            socket.to(roomName).emit("userTyping", {
                userId,
                username,
                groupId,
                timestamp: Date.now(),
            });
        } catch (error) {
            console.error("Error in group-typing event:", error);
        }
    });

    // Stop typing indicator
    socket.on("group-stop-typing", ({ groupId }) => {
        try {
            const roomName = `group-${groupId}`;
            socket.to(roomName).emit("userStoppedTyping", {
                userId,
                groupId,
            });
        } catch (error) {
            console.error("Error in group-stop-typing event:", error);
        }
    });

    /**
     * PERSONAL CHAT (DM) HANDLERS
     * FAANG style: Efficient room management for 1-to-1 chats
     */

    // Join DM room (creates room with sorted userId pair)
    socket.on("join-dm", (otherUserId) => {
        try {
            // Create consistent room name from sorted user IDs
            const roomName = `dm-${[userId, otherUserId].sort().join("-")}`;
            socket.join(roomName);
            
            console.log(`User ${socket.user.username} joined DM with ${otherUserId}`);
            
            // Notify other user that conversation is active
            const receiverSocket = userSocketMap[otherUserId];
            if (receiverSocket) {
                io.to(receiverSocket).emit("userOnline", {
                    userId,
                    username: socket.user.username,
                });
            }
        } catch (error) {
            console.error("Error in join-dm event:", error);
        }
    });

    // Leave DM room
    socket.on("leave-dm", (otherUserId) => {
        try {
            const roomName = `dm-${[userId, otherUserId].sort().join("-")}`;
            socket.leave(roomName);
            
            console.log(`User ${socket.user.username} left DM with ${otherUserId}`);
        } catch (error) {
            console.error("Error in leave-dm event:", error);
        }
    });

    /**
     * TYPING INDICATOR FOR PERSONAL CHATS
     */
    socket.on("dm-typing", ({ otherUserId, username }) => {
        try {
            const roomName = `dm-${[userId, otherUserId].sort().join("-")}`;
            socket.to(roomName).emit("dmUserTyping", {
                userId,
                username,
                timestamp: Date.now(),
            });
        } catch (error) {
            console.error("Error in dm-typing event:", error);
        }
    });

    // Stop typing in DM
    socket.on("dm-stop-typing", ({ otherUserId }) => {
        try {
            const roomName = `dm-${[otherUserId, userId].sort().join("-")}`;
            socket.to(roomName).emit("dmUserStoppedTyping", {
                userId,
            });
        } catch (error) {
            console.error("Error in dm-stop-typing event:", error);
        }
    });

    //with socket.on we can listen to events from clients
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.user.username} (${socket.userId})`);
        delete userSocketMap[userId];
        
        // Leave all group rooms
        if (userGroupsMap[userId]) {
            userGroupsMap[userId].forEach(groupId => {
                io.to(`group-${groupId}`).emit("userLeftGroup", {
                    userId,
                    username: socket.user.username,
                    groupId,
                });
            });
            delete userGroupsMap[userId];
        }
        
        io.emit("onlineUsers", Object.keys(userSocketMap));
    });
});

export { app, server, io, userSocketMap };