import bot from "../../config/bot.js";

export default async (message) => {
  if (message.text !== "/start") return;
  if (message.chat.type !== "private") return;

  await bot.sendMessage(
    message.chat.id,
    "I can send you your files, Please join our group"
  );
};
