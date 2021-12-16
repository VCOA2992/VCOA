/*
 * @command  /filterstats
 * @desc     Shows list of all connected channels
 * @access   Authorized Users
 */

import bot from "../../config/bot.js";
import logMessage from "../../helper/logMessage.js";
import messageAuth from "../../helper/messageAuth.js";
import Group from "../../models/Group.js";

export default async (message) => {
  const chatId = message.chat.id;

  messageAuth(message, { authUser: true });

  try {
    const group = await Group.findOne({ chatId });

    if (!group || group.channels.length < 1)
      return await bot.sendMessage(chatId, "No channels found");

    const channels = group.channels;
    let message = "All channels added to this group are:\n";

    for (let index in channels) {
      try {
        const data = await bot.getChat(channels[index]);
        message += `${+index + 1}) ${data.title} (${data.id})\n`;
      } catch (error) {
        logMessage(error.message, { error, errorSource: message });
        message += `${+index + 1}) ${channels[index]}\n`;
      }
    }

    await bot.sendMessage(chatId, message);
  } catch (error) {
    logMessage(error.message, { error, errorSource: message });
  }
};
