/* 
    
*/
import bot from "../config/bot.js";
import start from "../controllers/utils/start.js";

/*
 * @desc     Log all related errors
 */
bot.onText(/\/start/, start);

/*
 * @desc     Log all related errors
 */
bot.on("error", console.error);
