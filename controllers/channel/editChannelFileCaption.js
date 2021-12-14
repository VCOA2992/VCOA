/*
 * @desc     Edits caption when caption of a file is updated
 */

const doesCollectionExist = require("../../helper/doesCollectionExist");
const createFile = require("../../models/createFile");

module.exports = async (message) => {
  const chatId = message.chat.id;

  try {
    const collectionExist = await doesCollectionExist(chatId);
    if (!collectionExist) return;

    const File = createFile("" + chatId);

    await File.findByIdAndUpdate(message.message_id, {
      caption: message.caption,
    });
  } catch (error) {
    console.log(error);
  }
};
