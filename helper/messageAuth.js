import bot from "../bot.js";
import { AUTHORIZED_USERS } from "../config/config.js";

export default async (message, options) => {
  const chatId = message.chat.id;

  if (message.chat.type !== "group" && message.chat.type !== "supergroup")
    if (options && options.noReply) return "INVALID_CHAT";
    else
      await bot.sendMessage(
        chatId,
        "Sorry but this command is meant to be used only in groups"
      );

  if (options && options.authUser) {
    if (!AUTHORIZED_USERS.includes(String(message.from.id)))
      await bot.sendMessage(
        chatId,
        "Sorry but you are not authorized to use this bot"
      );
  }
};
