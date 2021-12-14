/*
 * Bot object to do all actions related to bot
 */

const TelegramBot = require("node-telegram-bot-api");
const config = require("./config/config");

const token = config.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

module.exports = bot;
