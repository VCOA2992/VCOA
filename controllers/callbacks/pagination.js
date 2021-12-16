import bot from "../../config/bot.js";
import allButtons from "../../config/allButtons.js";
import generateInlineKeyboards from "../../helper/generateInlineKeyboards.js";

export default async (query) => {
  await bot.answerCallbackQuery(query.id);

  if (query.data.startsWith("pages")) return;

  const chatId = query.message.chat.id;
  const [indent, index, keyword] = query.data.split("_");
  const data = allButtons[keyword];

  if (!data) return;

  let backLink;
  let nextLink;
  let filteredData = data.buttons[parseInt(index) - 1];

  const pages = {
    currentPage: parseInt(index),
    totalPages: data.total,
  };
  const sendAllFileLink = data.sendAllFileLink;

  if (query.data.startsWith("next")) {
    pages.currentPage = parseInt(index) + 2;
    filteredData = data.buttons[parseInt(index) + 1];

    backLink = `back_${parseInt(index) + 1}_${keyword}`;

    if (parseInt(index) !== parseInt(data.total - 2)) {
      nextLink = `next_${parseInt(index) + 1}_${keyword}`;
    }
  } else if (query.data.startsWith("back")) {
    nextLink = `next_${parseInt(index) - 1}_${keyword}`;

    if (parseInt(index) !== 1) {
      backLink = `back_${parseInt(index) - 1}_${keyword}`;
    }
  }

  const buttons = generateInlineKeyboards(filteredData, {
    backLink,
    nextLink,
    sendAllFileLink,
    pages,
  });

  await bot.editMessageReplyMarkup(buttons, {
    chat_id: chatId,
    message_id: query.message.message_id,
    inline_message_id: query.message.message_id,
  });
};
