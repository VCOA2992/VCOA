/*
 * All commands related to telegram channels
 */

import bot from "../config/bot.js";

import addChannel from "../controllers/channel/addChannel.js";
import deleteChannel from "../controllers/channel/deleteChannel.js";
import deleteAllChannels from "../controllers/channel/deleteAllChannels.js";
import filterStats from "../controllers/channel/filterStats.js";
import sendFileList from "../controllers/channel/sendFileList.js";
import sendFiles from "../controllers/channel/sendFiles.js";
import addChannelFile from "../controllers/channel/addChannelFile.js";
import editChannelFileCaption from "../controllers/channel/editChannelFileCaption.js";
// import checkCaption from "../controllers/channel/checkCaption.js";

/*
 * @command  /add <channel-id>^
 * @desc     Command to add channel content
 * @access   Authorized Users
 */
bot.onText(/^\/add (.+)/, addChannel);

/*
 * @command  /del <channel-id>
 * @desc     Command to delete channel content
 * @access   Authorized Users
 */
bot.onText(/^\/del (.+)/, deleteChannel);

/*
 * @command  /delall
 * @desc     Danger: Delete all channels in group
 * @access   Authorized Users
 */
bot.onText(/^\/delall/, deleteAllChannels);

/*
 * @command  /filters
 * @desc     Shows list of all connected channels
 * @access   Authorized Users
 */
bot.onText(/^\/filters/, filterStats);

/*
 * @command  /start [search <group-id>-<query>, <channel-id>-<message-id>]
 * @desc     Send filtered files to user
 * @access   All Users
 */
bot.onText(/\/start (.+)/, sendFiles);

/*
 * @command  /checkcap <channel-id>
 * @desc     Shows list of files whose caption is empty
 * @access   Authorized Users
 */
// bot.onText(/\/checkcap (.+)/, checkCaption);

/*
 * @desc     Adds a file when a file is posted to the channel
 */
bot.on("channel_post", addChannelFile);

/*
 * @desc     Edits caption when caption of a file is updated
 */
bot.on("edited_channel_post_caption", editChannelFileCaption);

/*
 * @desc     Sends files according to the query of user
 * @access   All Users
 */
bot.on("text", sendFileList);
