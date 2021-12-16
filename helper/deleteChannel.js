import mongoose from "mongoose";
import Group from "../models/Group.js";

export default async (chatId, channelId) => {
  await mongoose.connection.db.dropCollection(channelId);
  await Group.findOneAndUpdate(chatId, { $pull: { channels: channelId } });
};
