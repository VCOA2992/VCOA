/*
 * @command  /add <channel-id>
 * @desc     Command to add channel content
 * @access   Authorized Users
 */

import messageAuth from "../../helper/messageAuth.js";
import Group from "../../models/Group.js";
import createFile from "../../models/createFile.js";
import bot from "../../config/bot.js";
import client from "../../config/client.js";
import { Api } from "telegram";
import logMessage from "../../helper/logMessage.js";

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

    // Adding all Files to collection with name $channelId
    const File = createFile(channelId);

    await client.connect();
    await client.getDialogs({ limit: 50 });

    const fileTypes = [
      Api.InputMessagesFilterVideo,
      Api.InputMessagesFilterDocument,
    ];

    const files = [];

    for (const fileType of fileTypes) {
      for await (const message of client.iterMessages(parseInt(channelId), {
        limit: 10000000,
        filter: fileType,
      })) {
        if (message.restrictionReason) {
          logMessage(
            `${message.id} of ${channelId} has been skipped due to restriction`,
            message.restrictionReason.reason
          );
          continue;
        }

        files.push({
          _id: message.id,
          caption: message.message,
          fileSize: Math.trunc(message.media.document.size / 1024 / 1024),
        });
      }
    }

    await client.disconnect();

    await File.insertMany(files);
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
