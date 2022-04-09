import ChatUser from "../../models/ChatUser.js";

export default async (message) => {
  const chatId = message.chat.id;

  if (message.chat.type !== "private") return;

  const userExists =
    (await (await ChatUser.find({ chatId: message.chat.id })).length) > 0;
  if (userExists) return;

  const user = await new ChatUser({
    chatId: message.chat.id,
    name: `${message.from.first_name ? message.from.first_name : ""} ${
      message.from.last_name ? message.from.last_name : ""
    }`,
    userName: `${message.from.username ? message.from.username : ""}`,
  });

  await user.save();
};
