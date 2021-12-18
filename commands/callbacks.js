/*
 * All callbacks that bot will listen to
 */

import bot from "../config/bot.js";
import { AUTHORIZED_USERS } from "../config/config.js";
import pagination from "../controllers/callbacks/pagination.js";

bot.on("callback_query", async (query) => {
  const userWhoClicked = query.from.id;
  const userWhoRequested = query.message.reply_to_message.from.id;

  if (
    userWhoClicked === userWhoRequested ||
    AUTHORIZED_USERS.includes(userWhoClicked)
  )
    pagination(query);
  else{
    await bot.answerCallbackQuery(query.id);
    console.log(`You are not in authorized users.\nUsers: ${AUTHORIZED_USERS}`);
  }
});
