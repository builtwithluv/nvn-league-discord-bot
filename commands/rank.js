import gql from 'graphql-tag';
import { getRank } from '../src/graphql/queries';
import getUserFromMention from '../helpers/getUserFromMention';
import formatGraphQLError from '../helpers/formatGraphQLError';

export default {
    name: ['rank', 'r'],
    description: 'Get ranking',
    execute(message, args, bot, apollo) {
        const mention = args[0];

        let user;

        if (!mention) {
            user = message.author;
        } else {
            user = getUserFromMention(mention, bot)
        }

        if (!user) {
            message.channel.send('Sorry, I couldn\'t find that mentioned dueler.');

            return;
        }

        const isUserAuthor = user === message.author;

        apollo.query({
            query: gql(getRank),
            variables: {
                leaderboard_id: message.guild.id,
                player_id: user.id
            },
            fetchPolicy: 'no-cache'
        })
            .then(rankRes => {
                const rank = rankRes.data.getRank;

                return message.channel.send(`${isUserAuthor ? 'You are' : `\`${user.username}\` is`} ranked \`${rank}\`.`);
            })
            .catch(err => {
                if (user === message.author) {
                    return message.channel.send('You are not registered for the league. You can register by sending the command `!register`.')
                }

                return message.channel.send(formatGraphQLError(err.message));
            });
    }
};
