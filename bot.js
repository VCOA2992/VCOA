const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");

const token = config.BOT_TOKEN;

const port = process.env.PORT || 8080;
const host = process.env.HOST;

module.exports = new TelegramBot(token, { polling: true, webHook: {port: port, host: host }});
