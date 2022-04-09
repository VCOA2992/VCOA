import "../models/ChatUser.js";
import User from "../models/ChatUser.js";
import database from "./sqlite.js";

const main = async () => {
  await database.sync();

  await User.create({
    chatId: "991837880",
    name: "Binamra Lamsal",
    userName: "kodilearn",
  });
};

main();
