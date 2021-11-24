const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");

const token = config.BOT_TOKEN;

module.exports = new TelegramBot(token, { polling: true });
