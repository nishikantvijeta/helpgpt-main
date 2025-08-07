import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js"; // <-- Add this line

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Public Auth Routes (register, login)
app.use("/api/auth", authRoutes); // <-- Add this line

// Protected Chat Routes
app.use("/api", chatRoutes);

// ✅ Ping test route
app.get("/ping", (req, res) => {
    res.send("pong");
});

// ✅ Start server and connect DB
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    connectDB();
});

// ✅ MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    }
};