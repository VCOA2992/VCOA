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

    if (filesWithEmptyCaption.length === 0)
      return bot.sendMessage(chatId, "No files with empty caption found");

    let files = [];
    await client.connect();

    await bot.sendMessage(
      chatId,
      `I am now sending all files without caption...\nTotal Files: ${filesWithEmptyCaption.length}`
    );

    for (const file of filesWithEmptyCaption) {
      if (files.length > 30) {
        await bot.sendMessage(chatId, files.join("\n"));
        files = [];
      }
      const result = await client.invoke(
        new Api.channels.ExportMessageLink({
          channel: parseInt(channelId),
          id: file._id,
          thread: true,
        })
      );

      files.push(result.link);
    }

    await bot.sendMessage(chatId, files.join("\n"));
    await bot.sendMessage(chatId, "Done!");
  } catch (error) {
    logMessage(error.message, message);
  }
};
