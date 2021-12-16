import connectDB from "./config/db.js";

// Connect Databases
connectDB();

// Commands
import "./commands/channel.js";
import "./commands/utils.js";
import "./commands/callbacks.js";

import "./helper/addBotCommand.js";
