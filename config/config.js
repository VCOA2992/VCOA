/*
 * All configs or credentials needed by bot for deployment
 */

module.exports = {
  AUTHORIZED_USERS: (
    process.env.AUTHORIZED_USERS || ""
  ).split(" "),
  APP_ID: parseInt(process.env.APP_ID),
  API_HASH: process.env.API_HASH || "",
  STRING_SESSION:
    process.env.STRING_SESSION ||
    "",
  BOT_TOKEN:
    process.env.BOT_TOKEN || "",
  MONGODB_URI: process.env.MONGODB_URI || "",
};
