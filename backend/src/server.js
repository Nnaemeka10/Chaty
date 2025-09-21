// express import
import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

// dotenv config
dotenv.config();

// app init
const app = express();

const PORT = process.env.PORT || 3000;

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


// server listen
app.listen(PORT, () => console.log('Server running on port: ' + PORT));