/*
 * @desc     Sends files according to the query of user
 * @access   All Users
 */

import messageAuth from "../../helper/messageAuth.js";
import { generateButtons, searchFiles } from "../../helper/searchFiles.js";
import Group from "../../models/Group.js";
import bot from "../../bot.js";

export default async (message) => {
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
