import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  chatId: { type: String, maxlength: 50, required: true },
  channels: [],
});

export default mongoose.model("Group", groupSchema);
