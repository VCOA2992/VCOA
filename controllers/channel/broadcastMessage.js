/*
 * @command  /add <channel-id>
 * @desc     Command to add channel content
 * @access   Authorized Users
 */

import bot from "../../config/bot.js";
import messageAuth from "../../helper/messageAuth.js";
import ChatUser from "../../models/ChatUser.js";

export default async (message) => {
  const chatId = message.chat.id;

  const error = await messageAuth(message, { authUser: true, private: true });
  if (error) return;

  let messageToForward;

  try {
    messageToForward = message.reply_to_message.message_id;
  } catch (error) {
    return await bot.sendMessage(chatId, "Please mention a message to send");
  }

  const sendingMessage = await bot.sendMessage(
    chatId,
    "Forwarding your message to members"
  );

  const usersToSend = await ChatUser.find({});
  if (!usersToSend.length > 0)
    return await bot.editMessageText(
      "Not enough users are recorded yet, Please try again later.",
      {
        chat_id: chatId,
        message_id: sendingMessage.message_id,
      }
    );

  await bot.editMessageText(
    `Sending your message to ${usersToSend.length} members`,
    {
      chat_id: chatId,
      message_id: sendingMessage.message_id,
    }
  );

  for (let user of usersToSend) {
    try {
      await bot.copyMessage(user.chatId, chatId, messageToForward);
    } catch (error) {
      await ChatUser.remove({ chatId: user.chatId });
    }
  }

  await bot.editMessageText(
    `Successfully sent your message to ${usersToSend.length} members`,
    {
      chat_id: chatId,
      message_id: sendingMessage.message_id,
    }
  );
};
