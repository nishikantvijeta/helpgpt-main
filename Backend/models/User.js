import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
 // history: [{ type: String }]
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }]
});

export default mongoose.model("User", UserSchema); 
