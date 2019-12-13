module.exports = {
    name: 'ping',
    execute: (bot, { channelID }) => bot.sendMessage({ to: channelID, message: 'Pong!' })
};
