/*
 * All commands related to telegram channels
 */

const bot = require("../bot");

/*
 * @command  /add <channel-id>^
 * @desc     Command to add channel content
 * @access   Authorized Users
 */
bot.onText(/^\/add (.+)/, require("../controllers/channel/addChannel"));

/*
 * @command  /del <channel-id>
 * @desc     Command to delete channel content
 * @access   Authorized Users
 */
bot.onText(/^\/del (.+)/, require("../controllers/channel/deleteChannel"));

/*
 * @command  /delall
 * @desc     Danger: Delete all channels in group
 * @access   Authorized Users
 */
bot.onText(/^\/delall/, require("../controllers/channel/deleteAllChannels"));

/*
 * @command  /filterstats
 * @desc     Shows list of all connected channels
 * @access   Authorized Users
 */
bot.onText(/^\/filterstats/, require("../controllers/channel/filterStats"));

/*
 * @desc     Sends files according to the query of user
 * @access   All Users
 */
bot.on("text", require("../controllers/channel/sendFileList"));

/*
 * @command  /start [search <group-id>-<query>, <channel-id>-<message-id>]
 * @desc     Send filtered files to user
 * @access   All Users
 */
bot.onText(/\/start (.+)/, require("../controllers/channel/sendFiles"));

/*
 * @desc     Adds a file when a file is posted to the channel
 */
bot.on("channel_post", require("../controllers/channel/addChannelFile"));

/*
 * @desc     Edits caption when caption of a file is updated
 */
bot.on(
  "edited_channel_post_caption",
  require("../controllers/channel/editChannelFileCaption")
);
