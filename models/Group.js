const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
  chatId: { type: String, maxlength: 50, required: true },
  channels: [],
});

module.exports = mongoose.model("Group", groupSchema);
