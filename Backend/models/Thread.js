import mongoose from "mongoose";

// Message schema: Each chat message
const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Thread schema: One chat thread per session
const ThreadSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null // ✅ Now optional
  },
  guestId: {
    type: String,
    default: null // ✅ Used for guest users (UUID or random id)
  },
  title: {
    type: String,
    default: "New Chat"
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Thread", ThreadSchema);
