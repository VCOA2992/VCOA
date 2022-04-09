/*
 * @command  /scannedusers
 * @desc     Provide info of number of users who are scanned by bot for forwarding messages
 * @access   Authorized users
 */

import bot from "../../config/bot.js";
import messageAuth from "../../helper/messageAuth.js";
import ChatUser from "../../models/ChatUser.js";

export default async (message) => {
  const chatId = message.chat.id;

  const error = await messageAuth(message, { authUser: true, private: true });
  if (error) return;

  const usersToSend = await ChatUser.findAll();

  await bot.sendMessage(
    chatId,
    `Total number of users scanned: ${usersToSend.length}`
  );
};
