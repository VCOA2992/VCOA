import bot from "../config/bot.js";

const allCommands = [];

allCommands.push({
  command: "/add",
  description: "To add files of channel in group to be searchable",
  options: { scope: { type: "all_chat_administrators" } },
});

allCommands.push({
  command: "/del",
  description: "To delete files of channel in group to be searchable",
  options: { scope: { type: "all_chat_administrators" } },
});

allCommands.push({
  command: "/delall",
  description: "To delete all files added in a group",
  options: { scope: { type: "all_chat_administrators" } },
});

allCommands.push({
  command: "/filterstats",
  description: "To get list of all channels that are added to a group",
  options: { scope: { type: "all_chat_administrators" } },
});

bot.setMyCommands(allCommands);
