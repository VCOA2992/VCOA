/*
 * @desc     Edits caption when caption of a file is updated
 */

import doesCollectionExist from "../../helper/doesCollectionExist.js";
import logMessage from "../../helper/logMessage.js";
import createFile from "../../models/createFile.js";

export default async (message) => {
  const chatId = message.chat.id;

  try {
    const collectionExist = await doesCollectionExist(chatId);
    if (!collectionExist) return;

    const File = createFile("" + chatId);

    await File.findByIdAndUpdate(message.message_id, {
      caption: message.caption,
    });
  } catch (error) {
    logMessage(error.message, { error, errorSource: message });
  }
};
