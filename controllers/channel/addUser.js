import sequelize from "../../config/sqlite.js";
import ChatUser from "../../models/ChatUser.js";

export default async (message) => {
  const chatId = message.chat.id;

  if (message.chat.type !== "private") return;

  await sequelize.sync();
  const userExists = await ChatUser.findOne({
    where: { chatId: message.chat.id },
    raw: true,
  });
  if (userExists) return;

  const user = {
    chatId: message.chat.id,
    name: `${message.from.first_name ? message.from.first_name : ""} ${
      message.from.last_name ? message.from.last_name : ""
    }`,
    userName: `${message.from.username ? message.from.username : "none"}`,
  };
  // console.log(user);
  await ChatUser.create(user);
};
