import gql from 'graphql-tag';
import { listChallenges } from '../src/graphql/queries';
import getUserFromMention from '../helpers/getUserFromMention';
import createMention from '../helpers/createMentionFromUserId';
import formatGraphQLError from '../helpers/formatGraphQLError';

export default {
    name: 'stats',
    description: 'Get stats about a user',
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

        apollo.query({
            query: gql(listChallenges),
            variables: {
                filter: {
                    or: [{
                        challenger_id: {
                            eq: user.id
                        }
                    }, {
                        defender_id: {
                            eq: user.id
                        }
                    }]
                }
            },
            fetchPolicy: 'no-cache'
        })
            .then(res => {
                const challenges = res.data.listChallenges.items;
                const numOfChallenges = challenges.length;
                const numOfVictories = challenges.filter(challenge => challenge.winner === user.id).length;
                const numOfLosses = challenges.filter(challenge => challenge.loser === user.id).length;

                message.channel.send(`${createMention(user.id)}: \`\`\`{ challenges: ${numOfChallenges}, victories: ${numOfVictories}, losses: ${numOfLosses} }\`\`\``);
            })
            .catch(err => {
                message.channel.send(formatGraphQLError(err.message));
            });
    }
};
