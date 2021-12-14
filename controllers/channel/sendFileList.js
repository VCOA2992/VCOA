/*
 * @desc     Sends files according to the query of user
 * @access   All Users
 */

const messageAuth = require("../../helper/messageAuth");
const { generateButtons, searchFiles } = require("../../helper/searchFiles");
const Group = require("../../models/Group");
const bot = require("../../bot");

module.exports = async (message) => {
  if (message.text.length < 3) return;

  const chatId = message.chat.id;
  const { text: query, message_id: messageId } = message;

  const response = await messageAuth(message, { noReply: true });
  if (response === "INVALID_CHAT") return;

  try {
    const group = await Group.findOne({ chatId });
    if (!group) return;

    const files = await searchFiles(query, group.channels);
    if (files.length < 1) return;

    const buttons = await generateButtons(files, query, messageId, chatId);

    const options = {
      reply_markup: buttons,
      reply_to_message_id: message.message_id,
    };

    if (message.reply_to_message) {
      options.reply_to_message_id = message.reply_to_message.message_id;
    }

    await bot.sendMessage(chatId, "Here are list of files", options);
  } catch (error) {
    console.log(error);
  }
};

