import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error("Please provide a MONGODB_URI in the .env file");
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error; // Ném lỗi để cấp cao hơn xử lý
    }
};

export default connectDB;