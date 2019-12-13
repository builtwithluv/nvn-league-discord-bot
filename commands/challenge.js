import gql from 'graphql-tag';
import { createChallenge } from '../src/graphql/mutations';
import getUserFromMention from '../helpers/getUserFromMention';

export default {
    name: 'challenge',
    description: 'Challenge a friendly foe',
    execute(message, args, bot, apollo) {
        const challenger = message.author;
        const mention = args[0];

        if (!mention) {
            message.channel.send('Make sure you mention who you want to challenge!');

            return;
        }

        const defender = getUserFromMention(mention, bot);

        if (!defender) {
            message.channel.send('I did not recognize who you wanted to challenge. Use the @{mention} syntax');

            return;
        }

        if (defender.bot) {
            message.channel.send('Dodged.');

            return;
        }

        if (challenger === defender) {
            message.channel.send('Haha. You can\'t duel yourself silly.');
            
            return;
        }

        const mutation = gql(createChallenge);
        const variables = {
            input: {
                challenger: challenger.id,
                defender: defender.id
            }
        };

        apollo.mutate({ mutation, variables })
            .then(function logData(data) {
                console.log('results of query: ', data);
            })
            .catch(console.error);

        message.channel.send(`<@${challenger.id}> has challenged <@${defender.id}> to a duel!`);
    }
};
