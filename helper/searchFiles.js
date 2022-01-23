import createFile from "../models/createFile.js";
import Fuse from "fuse.js";
import bot from "../config/bot.js";
import allButtons from "../config/allButtons.js";
import generateInlineKeyboards from "./generateInlineKeyboards.js";

const allFiles = async (channels) => {
  let data = [];

  for await (const channelId of channels) {
    const File = createFile(channelId);
    const files = await File.find({});

    for await (const file of files) {
      data.push({
        fromId: channelId,
        caption: file.caption,
        messageId: file._id,
        fileSize: file.fileSize,
      });
    }
  }
  return data;
};

const searchFromFiles = (query, data) => {
  const option = {
    keys: ["caption"],
    threshold: 0.2,
  };

  const fuse = new Fuse(data, option);
  let filteredData = fuse.search(query.toLowerCase());

  return filteredData.map((d) => d.item);
};

const splitList = (list, index) => {
  const result = [];
  for (let i = 0; i < list.length; i += index) {
    result.push(list.slice(i, i + index));
  }
  return result;
};

export async function generateButtons(data, query, messageId, chatId) {
  let buttons = [];

  const me = await bot.getMe();
  const botLink = "t.me/" + me.username;

  data.forEach((item) => {
    buttons.push([
      {
        text: `📂 [${item.fileSize}MB] ${item.caption}`,
        url: `${botLink}?start=${item.fromId}-${item.messageId}`,
      },
    ]);
  });

  let keyword = `${chatId}-${messageId}`;
  const sendAllFileLink = `${botLink}?start=search-${chatId}-${query
    .replace(/ /g, "-")
    .replace(/[\(\)]/g, "")
    .replace(/:/g, "")
    .toLowerCase()}`;

  if (buttons.length > 10) {
    let splittedButtons = splitList(buttons, 10);

    allButtons[keyword] = {
      total: splittedButtons.length,
      buttons: splittedButtons,
      sendAllFileLink,
    };

    const filteredButtons = generateInlineKeyboards(
      allButtons[keyword].buttons[0],
      {
        nextLink: `next_0_${keyword}`,
        sendAllFileLink,
        pages: {
          currentPage: 1,
          totalPages: allButtons[keyword].total,
        },
      }
    );

    return filteredButtons;
  } else {
    return generateInlineKeyboards(buttons, { sendAllFileLink });
  }
}

export async function searchFiles(query, channels) {
  let data = await allFiles(channels);
  let filteredData = searchFromFiles(query, data);

  return filteredData;
}
