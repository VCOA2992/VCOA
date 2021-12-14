const bot = require("../bot");
const config = require("../config/config");

const authorized_users = config.AUTHORIZED_USERS;

module.exports = async (message, options) => {
  const chatId = message.chat.id;

  if (message.chat.type !== "group" && message.chat.type !== "supergroup")
    if (options && options.noReply) return "INVALID_CHAT";
    else
      await bot.sendMessage(
        chatId,
        "Sorry but this command is meant to be used only in groups"
      );

  if (options && options.authUser) {
    if (!authorized_users.includes(String(message.from.id)))
      await bot.sendMessage(
        chatId,
        "Sorry but you are not authorized to use this bot"
      );
  }
};
