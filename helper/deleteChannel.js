const mongoose = require("mongoose");
const Group = require("../models/Group");

module.exports = async (chatId, channelId) => {
  await mongoose.connection.db.dropCollection(channelId);
  await Group.findOneAndUpdate(chatId, { $pull: { channels: channelId } });
};
