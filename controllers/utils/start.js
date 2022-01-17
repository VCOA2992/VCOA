import bot from "../../config/bot.js";
import fs from "fs";
import { REQUIRED_CHAT_TO_JOIN, WELCOME_MESSAGE } from "../../config/config.js";

export default async (message) => {
  if (message.text !== "/start") return;
  if (message.chat.type !== "private") return;

  const chatId = message.chat.id;

  let buttons = [];
  for (const requiredChat of REQUIRED_CHAT_TO_JOIN) {
    if (!requiredChat) continue;
    const chat = await bot.getChat(requiredChat);
    const lastButton = buttons[buttons.length - 1];

    // Adds button to last list of buttons if there is only 1 button
    if (lastButton && lastButton.length !== 2)
      lastButton.push({ text: `Join ${chat.title}`, url: chat.invite_link });
    else buttons.push([{ text: `Join ${chat.title}`, url: chat.invite_link }]);
  }

  const fileOptions = {
    filename: "caution.jpg",
    contentType: "image/jpeg",
  };

  const stream = fs.createReadStream("assets/images/welcome.jpg");

  let caption = "";
  if (!WELCOME_MESSAGE) {
    caption =
      "Hello there, Welcome here ✨\n\nWe are happy to see you here.\n\nWe are a Brand who provide all kind of content to members with no cost. 📂";

    if (buttons.length > 0) {
      caption +=
        "\n\nDon't forget to join channels given below and get what you dream in your life. ✌🏻";
    }
  } else {
    caption = WELCOME_MESSAGE;
  }

  return await bot.sendPhoto(
    chatId,
    stream,
    {
      caption: `***${caption}***`,
      reply_markup: JSON.stringify({ inline_keyboard: buttons }),
      parse_mode: "markdown",
    },
    fileOptions
  );
};
