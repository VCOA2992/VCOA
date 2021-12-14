/*
 * @command  /add <channel-id>
 * @desc     Command to add channel content
 * @access   Authorized Users
 */

const messageAuth = require("../../helper/messageAuth");
const Group = require("../../models/Group");
const createFile = require("../../models/createFile");
const bot = require("../../bot");
const client = require("../../client");
const { Api } = require("telegram");

module.exports = async (message, [, channelId]) => {
  const chatId = message.chat.id;

  messageAuth(message, { authUser: true });

  try {
    let group = await Group.findOne({ chatId });

    if (!group) {
      group = await new Group({ chatId });
    }

    if (group.channels.includes(channelId)) {
      return bot.sendMessage(
        chatId,
        "Sorry but that channel already exists.\nPlease use `/del <channel-id>` if you want to delete or add again.",
        { parse_mode: "markdown" }
      );
    }

    const addingMessage = `Adding ${channelId} in ${chatId}`;
    const { message_id: messageId } = await bot.sendMessage(
      chatId,
      addingMessage
    );

    // Adding all Files to collection with name $channelId
    const File = createFile(channelId);

    await client.connect();
    await client.getDialogs({ limit: 50 });

    const fileTypes = [
      Api.InputMessagesFilterVideo,
      Api.InputMessagesFilterDocument,
    ];

    const files = [];

    for (const fileType of fileTypes) {
      for await (const { message, id, media } of client.iterMessages(
        parseInt(channelId),
        {
          limit: 10000000,
          filter: fileType,
        }
      )) {
        files.push({
          _id: id,
          caption: message,
          fileSize: Math.trunc(media.document.size / 1024 / 1024),
        });
      }
    }

    await client.disconnect();

    await File.insertMany(files);
    group.channels.push(channelId);

    await group.save();

    await bot.editMessageText(
      `Channel Added Successfully\nTotal Files: ${files.length}`,
      {
        chat_id: chatId,
        message_id: messageId,
      }
    );
  } catch (err) {
    console.log(err);
  }
};

