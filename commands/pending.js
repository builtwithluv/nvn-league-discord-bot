import gql from 'graphql-tag';
import { listChallenges } from '../src/graphql/queries';
import getUserFromMention from '../helpers/getUserFromMention';
import createMention from '../helpers/createMentionFromUserId';
import formatGraphQLError from '../helpers/formatGraphQLError';

export default {
    name: 'pending',
    description: 'Get user pending challenge',
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
                    and: [{
                        or: [{
                            challenger_id: {
                                eq: user.id
                            }
                        }, {
                            defender_id: {
                                eq: user.id
                            }
                        }]
                    }, {
                        status: {
                            eq: 'pending_scores'
                        }
                    }]
                }
            },
            fetchPolicy: 'no-cache'
        })
            .then(res => {
                const challenge = res.data.listChallenges.items[0];

                if (!challenge) {
                    return message.channel.send('You don\'t have any pending challenge. Start one by using \`!challenge {mention}\!`');
                }

                return message.channel.send(`${user === message.author ? 'You have' : `${createMention(user.id)} has`} a pending challenge with ${user.id === challenge.challenger_id ? createMention(challenge.defender_id) : createMention(challenge.challenger_id)}`);
            })
            .catch(err => {
                message.channel.send(formatGraphQLError(err.message));
            });
    }
};
