/*
 * @command  /delall
 * @desc     Danger: Delete all channels in group
 * @access   Authorized Users
 */

import messageAuth from "../../helper/messageAuth.js";
import bot from "../../config/bot.js";
import Group from "../../models/Group.js";
import deleteChannel from "../../helper/deleteChannel.js";
import logMessage from "../../helper/logMessage.js";

export default async (message) => {
  const chatId = message.chat.id;

  const error = await messageAuth(message, { authUser: true });
  if (error) return;

  const group = await Group.findOne({ chatId });

  // Authorization before deleting channel
  if (group.channels.length < 1) {
    return bot.sendMessage(chatId, "Please add some channels");
  }

  const addingMessage = `Deleting All Channels in ${chatId}`;
  const { message_id: messageId } = await bot.sendMessage(
    chatId,
    addingMessage
  );

  try {
    for await (const channel of group.channels) deleteChannel(chatId, channel);

    await bot.editMessageText("All Channels Deleted Successfully", {
      chat_id: chatId,
      message_id: messageId,
    });
  } catch (error) {
    logMessage(error.message, { error, errorSource: message });
  }
};
