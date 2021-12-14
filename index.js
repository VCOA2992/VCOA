const connectDB = require("./config/db");

// Connect Databases
connectDB();

// Commands
require("./commands/channel");
require("./commands/utils");
require("./commands/callbacks");
