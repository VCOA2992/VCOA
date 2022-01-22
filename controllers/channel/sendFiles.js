/*
 * @command  /start [search <group-id>-<query>, <channel-id>-<message-id>]
 * @desc     Send filtered files to user
 * @access   All Users
 */

import { searchFiles } from "../../helper/searchFiles.js";
import Group from "../../models/Group.js";
import bot from "../../config/bot.js";
import {
  REQUIRED_CHAT_TO_JOIN,
  LIMITED_FILES_PER_DAY,
} from "../../config/config.js";
import fs from "fs";
import User from "../../models/User.js";

function msToTime(ms) {
  let text = "";
  let seconds = (ms / 1000).toFixed(1);
  let minutes = (ms / (1000 * 60)).toFixed(1);
  let hours = (ms / (1000 * 60 * 60)).toFixed(1);
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (seconds < 60) text = seconds + " Sec";
  else if (minutes < 60) text = minutes + " Min";
  else if (hours < 24) text = hours + " Hrs";
  else text = days + " Days";
  return text;
}

export default async (message, match) => {
  const chatId = message.chat.id;

  const response = match[1].split("-");

  if (message.chat.type !== "private") return;

  try {
    for (const requiredChat of REQUIRED_CHAT_TO_JOIN) {
      const chat = await bot.getChatMember(requiredChat, message.from.id);
      if (chat.status === "left")
        throw new Error("User is not added to the chat");
    }
  } catch (error) {
    let buttons = [];
    for (const requiredChat of REQUIRED_CHAT_TO_JOIN) {
      if (!requiredChat) continue;
      const chat = await bot.getChat(requiredChat);
      const lastButton = buttons[buttons.length - 1];

      // Adds button to last list of buttons if there is only 1 button
      if (lastButton && lastButton.length !== 2)
        lastButton.push({ text: `Join ${chat.title}`, url: chat.invite_link });
      else
        buttons.push([{ text: `Join ${chat.title}`, url: chat.invite_link }]);
    }

    const me = await bot.getMe();
    const botLink = "t.me/" + me.username;
    buttons.push([
      {
        text: `Try Again`,
        url: `${botLink}?start=-${response.slice(1).join("-")}`,
      },
    ]);

    const fileOptions = {
      filename: "caution.jpg",
      contentType: "image/jpeg",
    };

    const stream = fs.createReadStream("assets/images/caution.jpg");

    return await bot.sendPhoto(
      chatId,
      stream,
      {
        caption: `***⚠️ Caution:- \nFor Getting Your Files, First You Have to Join Listed "Channels/Groups" Given Below👇🏻***`,
        reply_markup: JSON.stringify({ inline_keyboard: buttons }),
        parse_mode: "markdown",
      },
      fileOptions
    );
  }

  try {
    if (LIMITED_FILES_PER_DAY) {
      let user = await User.findById(message.from.id);

      if (user) {
        if (new Date().getDay() !== new Date(user.createdAt).getDay()) {
          user.remove();
          user = await User.create({ _id: message.from.id, chatId });
        } else if (user.numberOfFilesUserGot >= LIMITED_FILES_PER_DAY)
          return await bot.sendMessage(
            chatId,
            `Sorry but limit has been reached for today.\nYou can get files after ${msToTime(
              new Date(new Date().setHours(24, 0, 0, 0)) - Date.now()
            )}`
          );
      }
    }

    if (response[0] === "search") {
      // Search files using query and send
      const groupId = "-" + response[1];
      const query = response.slice(3).join(" ");

      const group = await Group.findOne({ groupId });
      if (!group) return;

      let files = await searchFiles(query, group.channels);
      if (files.length < 1) return;

      files = files.slice(0, 60);

      for (const file of files) {
        await bot.copyMessage(chatId, file.fromId, file.messageId);
      }
    } else {
      // Send a file upon clicking button
      const channelId = "-" + response[1];
      const messageId = response[2];

      await bot.copyMessage(chatId, channelId, messageId);
    }
    if (LIMITED_FILES_PER_DAY) {
      let user = await User.findById(message.from.id);

      if (!user) user = await new User({ _id: message.from.id, chatId });

      user.numberOfFilesUserGot += 1;
      await user.save();
    }
  } catch (error) {
    console.log(error);
    const fileOptions = {
      filename: "caution.jpg",
      contentType: "image/jpeg",
    };

    const stream = fs.createReadStream("assets/images/404.jpg");

    return await bot.sendPhoto(
      chatId,
      stream,
      {
        caption: `***⚠️ Error:- \n404 Error Occured, Looks like file is deleted 🤔. Please contact respective group administrator for help!***`,
        parse_mode: "markdown",
      },
      fileOptions
    );
  }
};
