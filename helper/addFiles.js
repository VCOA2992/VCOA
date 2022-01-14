import client from "../config/client.js";
import { Api } from "telegram";
import createFile from "../models/createFile.js";
import logMessage from "../helper/logMessage.js";

const addFiles = async (channelId) => {
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
    for await (const message of client.iterMessages(parseInt(channelId), {
      limit: 10000000,
      filter: fileType,
    })) {
      if (message.restrictionReason) {
        logMessage(
          `${message.id} of ${channelId} has been skipped due to restriction`,
          message.restrictionReason.reason
        );
        continue;
      }

      files.push({
        _id: message.id,
        caption: message.message,
        fileSize: Math.trunc(message.media.document.size / 1024 / 1024),
      });
    }
  }

  await client.disconnect();
  await File.insertMany(files);

  return files;
};

export default addFiles;
