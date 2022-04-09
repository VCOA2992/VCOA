import "../models/ChatUser.js";
import database from "./sqlite.js";

const main = async () => {
  await database.sync();
};

main();
