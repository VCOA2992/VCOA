/*
 * @command  /add <channel-id>
 * @desc     Command to add channel content
 * @access   Authorized Users
 */

import messageAuth from "../../helper/messageAuth.js";
import Group from "../../models/Group.js";
import bot from "../../config/bot.js";
import logMessage from "../../helper/logMessage.js";
import addFiles from "../../helper/addFiles.js";

export default async (message, [, channelId]) => {
  const chatId = message.chat.id;

  const error = await messageAuth(message, { authUser: true });
  if (error) return;
  console.log(error);

  try {
    let group = await Group.findOne({ chatId });

    if (!group) {
      group = await new Group({ chatId });
    }

    if (group.channels.includes(channelId)) {
      return bot.sendMessage(
        chatId,
        "Sorry but that channel already exists.\nPlease use `/del <channel-id>` if you want to delete or add again.",
        { parse_mode: "markdown" }
      );
    }

    const addingMessage = `Adding ${channelId} in ${chatId}`;
    logMessage(addingMessage);
    const { message_id: messageId } = await bot.sendMessage(
      chatId,
      addingMessage
    );

    const files = await addFiles(channelId);

    group.channels.push(channelId);
    await group.save();

    const addingFinished = `Channel Added Successfully\nTotal Files: ${files.length}`;
    logMessage(addingFinished);
    await bot.editMessageText(addingFinished, {
      chat_id: chatId,
      message_id: messageId,
    });
  } catch (error) {
    const errorMessage =
      "Error Occured while adding channel, Please check logs for more info";
    await bot.sendMessage(chatId, errorMessage);
    logMessage(errorMessage, { error, errorSource: message });
  }
};
