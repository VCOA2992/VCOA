/*
 * @command  /filterstats
 * @desc     Shows list of all connected channels
 * @access   Authorized Users
 */

const bot = require("../../bot");
const messageAuth = require("../../helper/messageAuth");
const Group = require("../../models/Group");

module.exports = async (message) => {
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
      } catch (err) {
        console.log(err);
        message += `${+index + 1}) ${channels[index]}\n`;
      }
    }

    await bot.sendMessage(chatId, message);
  } catch (error) {
    console.log(error);
  }
};
