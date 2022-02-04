/*
 * All configs or credentials needed by bot for deployment
 */

import "dotenv/config.js";

export const AUTHORIZED_USERS = process.env.AUTHORIZED_USERS.split(" ");
export const APP_ID = parseInt(process.env.APP_ID);
export const API_HASH = process.env.API_HASH;
export const STRING_SESSION = String(process.env.STRING_SESSION);
export const BOT_TOKEN = process.env.BOT_TOKEN;
export const MONGODB_URI = process.env.MONGODB_URI;
export const LOG_CHANNEL = process.env.LOG_CHANNEL;
export const REQUIRED_CHAT_TO_JOIN = (
  process.env.REQUIRED_CHAT_TO_JOIN || ""
).split(" ").filter(value => value !== "");
export const WELCOME_MESSAGE =
  process.env.WELCOME_MESSAGE &&
  process.env.WELCOME_MESSAGE.replace(/\\n/g, "\n");
export const LIMITED_FILES_PER_DAY =
  parseInt(process.env.LIMITED_FILES_PER_DAY) || "";
