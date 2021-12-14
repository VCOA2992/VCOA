/*
 * @command  /del <channel-id>
 * @desc     Command to delete channel content
 * @access   Authorized Users
 */

const messageAuth = require("../../helper/messageAuth");
const bot = require("../../bot");
const mongoose = require("mongoose");
const Group = require("../../models/Group");
const deleteChannel = require("../../helper/deleteChannel");

module.exports = async (message, [, channelId]) => {
  const chatId = message.chat.id;

  messageAuth(message, { authUser: true });

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
  } catch (err) {
    console.log(err);
  }
};
