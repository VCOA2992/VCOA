import mongoose from "mongoose";

const chatUserSchema = new mongoose.Schema({
  chatId: { type: String, maxlength: 50, required: true },
  name: { type: String, required: true },
  userName: { type: String, required: false },
});

export default mongoose.model("ChatUser", chatUserSchema);
