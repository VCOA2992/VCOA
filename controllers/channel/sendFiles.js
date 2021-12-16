/*
 * @command  /start [search <group-id>-<query>, <channel-id>-<message-id>]
 * @desc     Send filtered files to user
 * @access   All Users
 */

import { searchFiles } from "../../helper/searchFiles.js";
import Group from "../../models/Group.js";
import bot from "../../bot.js";
import logMessage from "../../helper/logMessage.js";

export default async (message, match) => {
  const chatId = message.chat.id;
  const response = match[1].split("-");

  try {
    if (response[0] === "search") {
      // Search files using query and send
      const groupId = "-" + response[1];
      const query = response.slice(3).join(" ");

      const group = await Group.findOne({ groupId });
      if (!group) return;

      const files = await searchFiles(query, group.channels);
      if (files.length < 1) return;

      for (const file of files) {
        await bot.copyMessage(chatId, file.fromId, file.messageId);
      }
    } else {
      // Send a file upon clicking button
      const channelId = "-" + response[1];
      const messageId = response[2];

      await bot.copyMessage(chatId, channelId, messageId);
    }
  } catch (error) {
    await bot.sendMessage(chatId, `Be sure I am added to all the channels`);

    logMessage(error.message, error);
  }
};
