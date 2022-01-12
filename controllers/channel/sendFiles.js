/*
 * @command  /start [search <group-id>-<query>, <channel-id>-<message-id>]
 * @desc     Send filtered files to user
 * @access   All Users
 */

import { searchFiles } from "../../helper/searchFiles.js";
import Group from "../../models/Group.js";
import bot from "../../config/bot.js";
import logMessage from "../../helper/logMessage.js";
import { REQUIRED_CHAT_TO_JOIN } from "../../config/config.js";

export default async (message, match) => {
  const chatId = message.chat.id;

  const response = match[1].split("-");

  if (message.chat.type !== "private") return;

  try {
    for (const requiredChat of REQUIRED_CHAT_TO_JOIN) {
      const chat = await bot.getChatMember(requiredChat, message.from.id);
      if (chat.status === "left")
        throw new Error("User is not added to the chat");
    }
  } catch (error) {
    let buttons = [];
    for (const requiredChat of REQUIRED_CHAT_TO_JOIN) {
      const chat = await bot.getChat(requiredChat);
      const lastButton = buttons[buttons.length - 1];

      // Adds button to last list of buttons if there is only 1 button
      if (lastButton && lastButton.length !== 2)
        lastButton.push({ text: chat.title, url: chat.invite_link });
      else buttons.push([{ text: chat.title, url: chat.invite_link }]);
    }

    const me = await bot.getMe();
    const botLink = "t.me/" + me.username;
    buttons.push([
      {
        text: `Try Again`,
        url: `${botLink}?start=-${response.slice(1).join("-")}`,
      },
    ]);
    return await bot.sendMessage(
      chatId,
      "Looks like you aren't joined to some of our groups and channels. Please join given channel below to get your movies",
      { reply_markup: JSON.stringify({ inline_keyboard: buttons }) }
    );
  }

  try {
    if (response[0] === "search") {
      // Search files using query and send
      const groupId = "-" + response[1];
      const query = response.slice(3).join(" ");

      const group = await Group.findOne({ groupId });
      if (!group) return;

      let files = await searchFiles(query, group.channels);
      if (files.length < 1) return;

      files = files.slice(0, 60);

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

    logMessage(error.message, { error, errorSource: message });
  }
};
