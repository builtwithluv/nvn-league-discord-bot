import path from 'path';
import { PREFIX } from '../constants';
import getCommandFiles from '../helpers/getCommandFiles';

const createHelpMessage = () => {
    const commandFiles = getCommandFiles();
    const title = `NvN Bot Commands (Use \`${PREFIX}\` to send commands)\n\n`;
    const commands = [];

    for (const file of commandFiles) {
        const command = require(path.resolve('commands', file)).default;

        if (typeof command.name === 'string') {
            commands.push(`[${command.name}] ${command.description}\n`);
        } else if (Array.isArray(command.name)) {
            commands.push(`[${command.name.join(', ')}] ${command.description}\n`);
        }
    }

    return `\`\`\`${title + commands.reduce((final, cmd) => final + cmd, '')}\`\`\``;
}

export default {
    name: 'help',
    description: 'Get available commands',
    execute(message, args, bot, apollo) {
        return message.channel.send(createHelpMessage());
    }
};
