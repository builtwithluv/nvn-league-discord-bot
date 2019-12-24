import gql from 'graphql-tag';
import { createChallenge } from '../src/graphql/mutations';
import getUserFromMention from '../helpers/getUserFromMention';
import createMention from '../helpers/createMentionFromUserId';
import formatGraphQLError from '../helpers/formatGraphQLError';

export default {
    name: ['challenge', 'c'],
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

        apollo.mutate({
            mutation: gql(createChallenge),
            variables: {
                input: {
                    challenger_id: challenger.id,
                    defender_id: defender.id,
                }
            }
        })
            .then(res => {
                const challenge = res.data.createChallenge;

                message.channel.send(`${createMention(challenger.id)} has ${challenge.is_ego ? 'ego' : ''} challenged ${createMention(defender.id)} to a duel!`);
            })
            .catch(err => {
                message.channel.send(formatGraphQLError(err.message));
            });
    }
};
