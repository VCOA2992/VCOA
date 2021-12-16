/*
 * All callbacks that bot will listen to
 */

import bot from "../config/bot.js";
import { AUTHORIZED_USERS } from "../config/config.js";
import pagination from "../controllers/callbacks/pagination.js";

const authorized_users = AUTHORIZED_USERS;

bot.on("callback_query", async (query) => {
  const userWhoClicked = query.from.id;
  const userWhoRequested = query.message.reply_to_message.from.id;

  if (
    userWhoClicked === userWhoRequested ||
    authorized_users.includes(userWhoClicked)
  )
    pagination(query);
});
