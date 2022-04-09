/*
 * @command  /broadcast (Mention a message to broadcast)
 * @desc     Broadcast a message
 * @access   Authorized Users
 */

import bot from "../../config/bot.js";
import sequelize from "../../config/sqlite.js";
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

  await sequelize.sync();
  let usersToSend = await ChatUser.findAll();

  if (!usersToSend.length > 0)
    return await bot.editMessageText(
      "Not enough users are recorded yet, Please try again later.",
      {
        chat_id: chatId,
        message_id: sendingMessage.message_id,
      }
    );

  usersToSend = usersToSend.map(({ dataValues }) => {
    const { chatId, name, username } = dataValues;
    return { chatId, name, username };
  });

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
      // await ChatUser.remove({ chatId: user.chatId });
      continue;
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
