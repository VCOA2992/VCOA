/*
 * Bot object to do all actions related to bot
 */

import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN } from "./config/config.js";

export default new TelegramBot(BOT_TOKEN, { polling: true });
