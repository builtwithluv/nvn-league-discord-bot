import fs from 'fs';
import path from 'path';
import Discord from 'discord.js';

const bot = new Discord.Client();

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(path.resolve('commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(path.resolve('commands', file)).default;

	bot.commands.set(command.name, command);
}

export default bot;
