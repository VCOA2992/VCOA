import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    _id: Number,
    chatId: { type: String, maxlength: 50, required: true },
    numberOfFilesUserGot: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
