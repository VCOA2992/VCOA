import bot from "../config/bot.js";

const allCommands = [];

allCommands.push({
  command: "/add",
  description: "To add files of channel in group to be searchable",
});

allCommands.push({
  command: "/del",
  description: "To delete files of channel in group to be searchable",
});

allCommands.push({
  command: "/delall",
  description: "To delete all files added in a group",
});

allCommands.push({
  command: "/filters",
  description: "To get list of all channels that are added to a group",
});

bot.setMyCommands(allCommands, { scope: { type: "all_chat_administrators" } });
