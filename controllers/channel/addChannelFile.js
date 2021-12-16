/*
 * @desc     Adds a file when a file is posted to the channel
 */

import createFile from "../../models/createFile.js";
import doesCollectionExist from "../../helper/doesCollectionExist.js";

export default async (message) => {
  const chatId = message.chat.id;
  const { caption, message_id: id } = message;

  try {
    const media = message.document || message.video;
    if (!media) return;

    const collectionExist = await doesCollectionExist(chatId);
    if (!collectionExist) return;

    const File = createFile("" + chatId);

    await new File({
      _id: id,
      caption,
      fileSize: Math.trunc(media.file_size / 1024 / 1024),
    }).save();
  } catch (error) {
    console.log(error);
  }
};
