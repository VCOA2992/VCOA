import bot from "../config/bot.js";
import { LOG_CHANNEL } from "../config/config.js";

export default async (message, options) => {
  const { error, errorSource } = options || {};

  console.log(message);

  if (error) console.log(error);

  if (LOG_CHANNEL) {
    let messageToBeSent = `${message}`;

    if (error) messageToBeSent += `\n\n\`${error.stack}\``;

    if (errorSource) {
      const date = new Date(errorSource.date * 1000);
      messageToBeSent +=
        `\n\n***Message ID***: ${errorSource.message_id}` +
        `\n***Chat ID***: ${errorSource.chat.id} (${errorSource.chat.type})` +
        `\n***From***: ${errorSource.from.first_name} ${errorSource.from.last_name} (@${errorSource.from.username})` +
        `\n***Text***: \`${errorSource.text}\`` +
        `\n***Date***: ${date.toLocaleString()}`;

      if (errorSource.chat.title)
        messageToBeSent += `\n***Group***: ${errorSource.chat.title}`;
    }

    await bot.sendMessage(LOG_CHANNEL, messageToBeSent, {
      parse_mode: "markdown",
    });
  }
};
