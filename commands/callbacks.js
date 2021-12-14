/*
 * All callbacks that bot will listen to
 */

const bot = require("../bot");
const config = require("../config/config");

const authorized_users = config.AUTHORIZED_USERS;

bot.on("callback_query", async (query) => {
  const userWhoClicked = query.from.id;
  const userWhoRequested = query.message.reply_to_message.from.id;

  if (
    userWhoClicked === userWhoRequested ||
    authorized_users.includes(userWhoClicked)
  )
    require("../controllers/callbacks/pagination")(query);
});
