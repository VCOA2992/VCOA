/*
 * Bot object to do all actions related to bot
 */

import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN } from "./config.js";

const bot = new TelegramBot(BOT_TOKEN, {
  polling: {
    interval: 1000,
    params: {
      limit: 10,
    },
  },

  filepath: false,
});

export default bot;
