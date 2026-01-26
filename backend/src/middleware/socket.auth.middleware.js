import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {

        //get token from cookie
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1];
        
        if (!token) {
            console.log("Socket authentication failed: No token provided");
            return next(new Error("Authentication error - No token provided"));
        }

        //verify token
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) {
            console.log("Socket authentication failed: Invalid token");
            return next(new Error("Authentication error - Invalid token"));
        }

        //find user by id from token from db
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            console.log("Socket authentication failed: User not found");
            return next(new Error("Authentication error - User not found"));
        }

        //attach user to socket object
        socket.user = user;
        socket.userId = user._id.toString();
        
        console.log(`Socket authenticated: ${user.username} (${user._id})`);
        next();
    } catch (error) {
        console.log("Socket authentication error:", error.message);
        next(new Error("Authentication error"));
    }
};