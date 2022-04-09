/*
 * Client object to do all stuffs that bot can't do
 */

import { APP_ID, API_HASH, STRING_SESSION } from "./config/config.js";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

const appId = APP_ID;
const apiHash = API_HASH;
const stringSession = new StringSession(STRING_SESSION);

let client;

(async () => {
  client = new TelegramClient(stringSession, appId, apiHash, {
    connectionRetries: 5,
  });
})();

client.setLogLevel("none");
export default client;
