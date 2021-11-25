const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");

const token = config.BOT_TOKEN;

const port = process.env.PORT || 443;
const host = process.env.HOST;
const externalUrl = process.env.CUSTOM_ENV_VARIABLE || 'https://my-app.herokuapp.com',

module.exports = new TelegramBot(token, { polling: true, webHook: {port: port, host: host }});
bot.setWebHook(externalUrl + ':443/bot' + token);
