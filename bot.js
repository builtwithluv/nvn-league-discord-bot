const Discord = require('discord.io');
const logger = require('winston');
const { DISCORD_TOKEN } = require('./config');

const handleMessages = require('./handlers/handleMessages');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

const bot = new Discord.Client({
   token: DISCORD_TOKEN,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', handleMessages(bot));