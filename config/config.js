/*
 * All configs or credentials needed by bot for deployment
 */

import "dotenv/config.js";

export const AUTHORIZED_USERS = process.env.AUTHORIZED_USERS.split(" ");
export const APP_ID = parseInt(process.env.APP_ID);
export const API_HASH = process.env.API_HASH;
export const STRING_SESSION = process.env.STRING_SESSION;
export const BOT_TOKEN = process.env.BOT_TOKEN;
export const MONGODB_URI = process.env.MONGODB_URI;
