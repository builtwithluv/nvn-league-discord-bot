export const PREFIX = '!';

export default function handleMessages(bot, apollo) {
    return message => {
        if (!message.content.startsWith(PREFIX) || message.author.bot) {
            return;
        }

        const args = message.content.substring(PREFIX.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (!bot.commands.has(command)) {
            return;
        }

        try {
            bot.commands.get(command).execute(message, args, bot, apollo);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
}
