import fs from 'fs';
import path from 'path';
import Discord from 'discord.js';

const bot = new Discord.Client();

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(path.resolve('commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(path.resolve('commands', file)).default;

	if (typeof command.name === 'string') {
		bot.commands.set(command.name, command);
	} else if (Array.isArray(command.name)) {
		command.name.forEach(name => bot.commands.set(name, command));
	}
}

export default bot;
