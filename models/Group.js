const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
  chatId: { type: String, maxlength: 50, required: true },
  channels: Object,
});

module.exports = mongoose.model("Group", groupSchema);
