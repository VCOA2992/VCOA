/*
 * @command  /delall
 * @desc     Danger: Delete all channels in group
 * @access   Authorized Users
 */

const messageAuth = require("../../helper/messageAuth");
const bot = require("../../bot");
const mongoose = require("mongoose");
const Group = require("../../models/Group");
const deleteChannel = require("../../helper/deleteChannel");

module.exports = async (message) => {
  const chatId = message.chat.id;

  messageAuth(message, { authUser: true });

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
  } catch (err) {
    console.log(err);
  }
};
