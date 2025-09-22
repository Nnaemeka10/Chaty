// express import
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';

// dotenv config
dotenv.config();

// app init
const app = express();

const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json()); // to accept json data/ req body

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


//make ready for deployment
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

// server listen
app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT)
    connectDB();

}); 