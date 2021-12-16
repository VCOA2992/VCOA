/*
 * @command  /add <channel-id>
 * @desc     Command to add channel content
 * @access   Authorized Users
 */

import messageAuth from "../../helper/messageAuth.js";
import Group from "../../models/Group.js";
import createFile from "../../models/createFile.js";
import bot from "../../bot.js";
import client from "../../client.js";
import { Api } from "telegram";

export default async (message, [, channelId]) => {
  const chatId = message.chat.id;

  messageAuth(message, { authUser: true });

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
    console.log(addingMessage);
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
          console.log(
            `${message.id} of ${channelId} has been skipped due to restriction\n${message.restrictionReason.reason}`
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
    console.log(addingFinished);
    await bot.editMessageText(addingFinished, {
      chat_id: chatId,
      message_id: messageId,
    });
  } catch (err) {
    console.log(err);
  }
};
