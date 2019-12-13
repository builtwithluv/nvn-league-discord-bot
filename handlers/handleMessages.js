const commands = require('../commands');

const PREFIX_EXECUTOR = '!';

module.exports = function handleMessages(bot) {
    return (user, userID, channelID, message, evt) => {
            if (!doesMatchPrefixExecutor(message)) {
                return;
            }
        
            const action = getAction(message);
            const command = commands.find(command => command.name === action);

            if (command) {
                command.execute(bot, { user, userID, channelID });
            }
    }
}


function doesMatchPrefixExecutor(message) {
    return message[0] === PREFIX_EXECUTOR;
}

function getAction(message) {
    const args = message.substring(PREFIX_EXECUTOR.length).split(' ');
    
    return args[0];
}