import moongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await moongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1); // 1 status code means failure, 0 means success
    }
}