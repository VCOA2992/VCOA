/*
 * Client object to do all stuffs that bot can't do
 */

const config = require("./config/config");
const { Logger } = require("telegram/extensions");
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

const appId = config.APP_ID;
const apiHash = config.API_HASH;
const stringSession = new StringSession(config.STRING_SESSION);

Logger.setLevel("none");

let client;

(async () => {
  client = new TelegramClient(stringSession, appId, apiHash, {
    connectionRetries: 5,
  });
})();

module.exports = client;
