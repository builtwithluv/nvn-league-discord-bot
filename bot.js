import logger from 'winston';
import apollo from './clients/apollo-client';
import bot from './clients/discord-client';
import handleMessages from './handlers/handleMessages';
import config from './config';

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

bot.login(config.DISCORD_TOKEN);

bot.on('error', (err, code) => {
    console.log(err);
    console.log(code);
})

bot.on('ready', function (evt) {
    bot.user.setPresence({ game: { name: '| !help for cmds' } })
    logger.info('Connected');
});

bot.on('message', handleMessages(bot, apollo));
