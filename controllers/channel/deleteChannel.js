/*
 * @command  /del <channel-id>
 * @desc     Command to delete channel content
 * @access   Authorized Users
 */

import messageAuth from "../../helper/messageAuth.js";
import bot from "../../config/bot.js";
import Group from "../../models/Group.js";
import deleteChannel from "../../helper/deleteChannel.js";
import logMessage from "../../helper/logMessage.js";

export default async (message, [, channelId]) => {
  const chatId = message.chat.id;

  const error = await messageAuth(message, { authUser: true });
  if (error) return;

  const group = await Group.findOne({ chatId });

  // Authorization before deleting channel
  if (group.channels.length < 1) {
    return bot.sendMessage(chatId, "Please add some channels");
  }

  if (!group.channels.includes(channelId)) {
    return bot.sendMessage(chatId, "Channel not found");
  }

  const addingMessage = `Deleting ${channelId} in ${chatId}`;
  const { message_id: messageId } = await bot.sendMessage(
    chatId,
    addingMessage
  );

  try {
    deleteChannel(chatId, channelId);

    await bot.editMessageText("Channel Deleted Successfully", {
      chat_id: chatId,
      message_id: messageId,
    });
  } catch (error) {
    logMessage(error.message, { error, errorSource: message });
  }
};
