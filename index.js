const connectDB = require("./config/db");
const Fuse = require("fuse.js");
const config = require("./config");

const authorized_users = config.AUTHORIZED_USERS;

const bot = require("./bot");

// Connect Databases
connectDB();

// Gramjs
const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const Group = require("./models/Group");

const appId = parseInt(config.APP_ID);
const apiHash = config.API_HASH;
const stringSession = new StringSession(config.STRING_SESSION);

let client;
let allButtons = {};

(async () => {
  client = new TelegramClient(stringSession, appId, apiHash, {
    connectionRetries: 5,
  });
  await client.start();
})();

console.log("Bot is now ready");

// Add channel in group
bot.onText(/\/add (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (msg.chat.type !== "group" && msg.chat.type !== "supergroup") {
    return bot.sendMessage(
      chatId,
      "Sorry but this command is meant to be used only in groups"
    );
  }

  if (!authorized_users.includes(String(msg.from.id))) {
    return bot.sendMessage(
      chatId,
      "Sorry but you are not authorized to use this bot"
    );
  }

  const resp = match[1];
  console.log(match, resp);

  let obj = await Group.findOne({ chatId: chatId });

  if (!obj) {
    obj = await new Group({ chatId: chatId, channels: {} });
  }

  if (obj.channels[resp]) {
    return bot.sendMessage(
      chatId,
      "Sorry but that channel already exists, please delete"
    );
  }

  await bot.sendMessage(chatId, "Adding channel");
  console.log(`Adding ${resp} in ${chatId}`);

  let data = [];
  try {
    await client.getDialogs({ limit: 50 });
    for await (const message of client.iterMessages(parseInt(resp), {
      limit: 100000000000,
      filter: Api.InputMessagesFilterVideo,
    })) {
      data.push({
        caption: message.message,
        messageId: message.id,
        fileSize: Math.trunc(message.media.document.size / 1024 / 1024),
      });
    }

    for await (const message of client.iterMessages(parseInt(resp), {
      limit: 100000000000,
      filter: Api.InputMessagesFilterDocument,
    })) {
      data.push({
        caption: message.message,
        messageId: message.id,
        fileSize: Math.trunc(message.media.document.size / 1024 / 1024),
      });
    }

    obj.channels = { ...obj.channels, [resp]: data };

    try {
      await obj.save();
      await bot.sendMessage(chatId, "Added successfully");
      console.log("Channel added successfully");
    } catch (err) {
      console.log(err);
      await bot.sendMessage(
        chatId,
        `Error while adding channel\n${err.message}`
      );
    }
  } catch (error) {
    console.log(error);
    await bot.sendMessage(
      chatId,
      `Error occured while adding channel\n${error.message}`
    );
  }
});

// Delete channel from group
bot.onText(/\/del (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (msg.chat.type !== "group" && msg.chat.type !== "supergroup") {
    return bot.sendMessage(
      chatId,
      "Sorry but this command is meant to be used only in groups"
    );
  }

  if (!authorized_users.includes(String(msg.from.id))) {
    return bot.sendMessage(
      chatId,
      "Sorry but you are not authorized to use this bot"
    );
  }

  const resp = match[1];
  await bot.sendMessage(chatId, "Deleting channel");

  let obj = await Group.findOne({ chatId: chatId });

  if (!obj) {
    return bot.sendMessage(chatId, "Please add some channels");
  }

  if (!obj.channels[resp]) {
    return bot.sendMessage(
      chatId,
      "Sorry but the channel you mentioned doesn't exist"
    );
  }

  let temp = { ...obj.channels };
  delete temp[resp];

  obj.channels = temp;

  try {
    await obj.save();
    await bot.sendMessage(chatId, "Deleted successfully");
  } catch (err) {
    console.log(err);
  }
});

const splitList = (list, index) => {
  const result = [];
  for (let i = 0; i < list.length; i += index) {
    result.push(list.slice(i, i + index));
  }
  return result;
};

// Search for movie and send in group
bot.on("message", async (msg) => {
  if (!msg.text) {
    return;
  }

  const chatId = msg.chat.id;
  if (msg.chat.type !== "group" && msg.chat.type !== "supergroup") {
    return;
  }

  if (msg.length < 3) {
    return;
  }

  const obj = await Group.findOne({ chatId });
  if (!obj) return;

  let data = [];

  for (let i in obj.channels) {
    for (let j of obj.channels[i]) {
      data.push({
        fromId: i,
        caption: j.caption,
        messageId: j.messageId,
        fileSize: j.fileSize,
      });
    }
  }

  const opt = {
    keys: ["caption"],
    threshold: 0.2,
  };

  const fuse = new Fuse(data, opt);
  const filteredData = fuse.search(msg.text.toLowerCase());

  if (!filteredData.length) {
    return;
  }

  let buttons = [];

  const me = await bot.getMe();

  const botLink = "t.me/" + me.username;

  filteredData.forEach((item) => {
    buttons.push([
      {
        text: `📂 [${item.item.fileSize}MB] ${item.item.caption}`,
        url: `${botLink}?start=${item.item.fromId}-${item.item.messageId}`,
      },
    ]);
  });

  let keyword = `${msg.chat.id}-${msg.message_id}`;

  if (buttons.length > 10) {
    btns = splitList(buttons, 10);
    allButtons[keyword] = {
      total: btns.length,
      buttons: btns,
    };

    const data = [...allButtons[keyword].buttons[0]];

    data.push([
      {
        text: "Next ➡️",

        callback_data: `next_0_${keyword}`,
      },
    ]);

    data.push([
      {
        text: `📃 Pages 1/${allButtons[keyword].total}`,
        callback_data: `pages`,
      },
    ]);

    data.push([
      {
        text: "Send all files",
        url: `${botLink}?start=search-${chatId}-${msg.text
          .replace(/ /g, "-")
          .toLowerCase()}`,
      },
    ]);

    let options = {
      reply_markup: JSON.stringify({
        inline_keyboard: data,
      }),

      reply_to_message_id: msg.message_id,
    };

    if (msg.reply_to_message) {
      options.reply_to_message_id = msg.reply_to_message.message_id;
    }

    const message = await bot.sendMessage(
      msg.chat.id,
      "Here are list of your Search Query",
      options
    );
  } else {
    buttons.push([
      {
        text: "Send all files",
        url: `${botLink}?start=search-${chatId}-${msg.text
          .replace(/ /g, "-")
          .toLowerCase()}`,
      },
    ]);

    let options = {
      reply_markup: JSON.stringify({
        inline_keyboard: buttons,
      }),

      reply_to_message_id: msg.message_id,
    };

    if (msg.reply_to_message) {
      options.reply_to_message_id = msg.reply_to_message.message_id;
    }

    const message = await bot.sendMessage(
      msg.chat.id,
      "Here are list of your Search Query",
      options
    );
  }
});

bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1].split("-");
  if (resp[0] === "search") {
    const groupId = "-" + resp[2];
    const searchQuery = resp.slice(3).join(" ");

    const obj = await Group.findOne({ groupId });

    let data = [];
    for (let i in obj.channels) {
      for (let j of obj.channels[i]) {
        data.push({ fromId: i, caption: j.caption, messageId: j.messageId });
      }
    }

    const opt = {
      keys: ["caption"],
      threshold: 0.2,
    };

    const fuse = new Fuse(data, opt);
    const filteredData = fuse.search(searchQuery);

    if (!filteredData.length) {
      return;
    }

    try {
      for (let item of filteredData) {
        await bot.copyMessage(chatId, item.item.fromId, item.item.messageId);
      }
    } catch (err) {
      await bot.sendMessage(
        chatId,
        `${err.message} \n Be sure I am added to all the channels`
      );
    }
  } else {
    const channel = "-" + resp[1];
    const messageId = resp[2];

    try {
      await bot.copyMessage(chatId, channel, messageId);
    } catch (err) {
      await bot.sendMessage(
        chatId,
        `${err.message} \n Be sure I am added to all the channels`
      );
    }
  }
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;

  const userWhoClicked = query.from.id;
  const userWhoRequested = query.message.reply_to_message.from.id;

  if (
    userWhoClicked === userWhoRequested ||
    authorized_users.includes(userWhoClicked)
  ) {
    if (query.data.startsWith("next")) {
      await bot.answerCallbackQuery(query.id);

      const [indent, index, keyword] = query.data.split("_");
      const data = allButtons[keyword];

      if (parseInt(index) === parseInt(data.total - 2)) {
        const buttons = [...data.buttons[parseInt(index) + 1]];

        buttons.push([
          {
            text: "⬅️ Back",
            callback_data: `back_${parseInt(index) + 1}_${keyword}`,
          },
        ]);

        buttons.push([
          {
            text: `📃 Pages ${parseInt(index) + 2}/${data.total}`,
            callback_data: `pages`,
          },
        ]);

        await bot.editMessageReplyMarkup(
          JSON.stringify({
            inline_keyboard: buttons,
          }),

          {
            chat_id: chatId,
            message_id: query.message.message_id,
            inline_message_id: query.message.message_id,
          }
        );
      } else {
        const buttons = [...data.buttons[parseInt(index) + 1]];

        buttons.push([
          {
            text: "⬅️ Back",
            callback_data: `back_${parseInt(index) + 1}_${keyword}`,
          },
          {
            text: "Next ➡️",

            callback_data: `next_${parseInt(index) + 1}_${keyword}`,
          },
        ]);

        buttons.push([
          {
            text: `📃 Pages ${parseInt(index) + 2}/${data.total}`,
            callback_data: `pages`,
          },
        ]);

        await bot.editMessageReplyMarkup(
          JSON.stringify({
            inline_keyboard: buttons,
          }),

          {
            chat_id: chatId,
            message_id: query.message.message_id,
            inline_message_id: query.message.message_id,
          }
        );
      }
    } else if (query.data.startsWith("back")) {
      await bot.answerCallbackQuery(query.id);

      const [indent, index, keyword] = query.data.split("_");
      const data = allButtons[keyword];

      if (parseInt(index) === 1) {
        const buttons = [...data.buttons[parseInt(index) - 1]];

        buttons.push([
          {
            text: "Next ➡️",
            callback_data: `next_${parseInt(index) - 1}_${keyword}`,
          },
        ]);

        buttons.push([
          {
            text: `📃 Pages ${parseInt(index)}/${data.total}`,
            callback_data: `pages`,
          },
        ]);

        await bot.editMessageReplyMarkup(
          JSON.stringify({
            inline_keyboard: buttons,
          }),

          {
            chat_id: chatId,
            message_id: query.message.message_id,
            inline_message_id: query.message.message_id,
          }
        );
      } else {
        const buttons = [...data.buttons[parseInt(index) - 1]];

        buttons.push([
          {
            text: "⬅️ Back",
            callback_data: `back_${parseInt(index) - 1}_${keyword}`,
          },
          {
            text: "Next ➡️",

            callback_data: `next_${parseInt(index) - 1}_${keyword}`,
          },
        ]);

        buttons.push([
          {
            text: `📃 Pages ${parseInt(index)}/${data.total}`,
            callback_data: `pages`,
          },
        ]);

        await bot.editMessageReplyMarkup(
          JSON.stringify({
            inline_keyboard: buttons,
          }),

          {
            chat_id: chatId,
            message_id: query.message.message_id,
            inline_message_id: query.message.message_id,
          }
        );
      }
    } else if (query.data.startsWith("pages")) {
      await bot.answerCallbackQuery(query.id);
    }
  }
});

bot.onText(/\/filterstats/, async (msg) => {
  const chatId = msg.chat.id;
  if (msg.chat.type !== "group" && msg.chat.type !== "supergroup") {
    return;
  }

  const obj = await Group.findOne({ chatId });
  if (!obj) return await bot.sendMessage(chatId, "No channels found");

  const channels = Object.keys(obj.channels);
  let message = "All channels added to this group are:\n";

  for (let index in channels) {
    message += `${+index + 1}) ${channels[index]}\n`;
  }

  await bot.sendMessage(chatId, message);
});
