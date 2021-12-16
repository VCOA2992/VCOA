/*
 * @command  /checkcap <channel-id>
 * @desc     Shows list of files whose caption is empty
 * @access   Authorized Users
 */

import logMessage from "../../helper/logMessage.js";
import messageAuth from "../../helper/messageAuth.js";
import createFile from "../../models/createFile.js";
import bot from "../../config/bot.js";
import client from "../../config/client.js";
import { Api } from "telegram";

export default async (message, match) => {
  const chatId = message.chat.id;
  const channelId = match[1];

  const error = await messageAuth(message, { authUser: true, private: true });
  if (error) return;

  try {
    const File = createFile(channelId);
    const filesWithEmptyCaption = await File.find({ caption: "" });

    if (filesWithEmptyCaption.length === 0) return;

    let message = "All the files without caption are:\n\n";
    await client.connect();

    for (const file of filesWithEmptyCaption) {
      const result = await client.invoke(
        new Api.channels.ExportMessageLink({
          channel: parseInt(channelId),
          id: file._id,
          thread: true,
        })
      );
      message += result.link + "\n";
    }

    await bot.sendMessage(chatId, message);
  } catch (error) {
    logMessage(error.message, message);
  }
};
