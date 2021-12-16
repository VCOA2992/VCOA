import bot from "../bot.js";
import { LOG_CHANNEL } from "../config/config.js";

export default async (message, error) => {
  console.log(message);

  if (error) console.log(error);

  if (LOG_CHANNEL) {
    let messageToBeSent = `${message}`;

    if (error) messageToBeSent += `\n\n\`${error}\``;

    await bot.sendMessage(LOG_CHANNEL, messageToBeSent, {
      parse_mode: "markdown",
    });
  }
};
