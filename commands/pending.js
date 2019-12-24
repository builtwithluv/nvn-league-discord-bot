import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import gql from 'graphql-tag';
import table from 'markdown-table';
import { listChallenges } from '../src/graphql/queries';
import getUserFromMention from '../helpers/getUserFromMention';
import getUserFromId from '../helpers/getUserFromId';
import createMention from '../helpers/createMentionFromUserId';
import formatGraphQLError from '../helpers/formatGraphQLError';

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo('en-US');

export default {
    name: ['pending', 'p'],
    description: 'Get user pending challenge',
    execute(message, args, bot, apollo) {
        if (args[0] === 'all') {
            return apollo.query({
                query: gql(listChallenges),
                variables: {
                    filter: {
                        status: {
                            eq: 'pending_scores'
                        }
                    }
                },
                fetchPolicy: 'no-cache'
            })
                .then(res => {
                    const pendingChallenges = res.data.listChallenges.items;

                    if (pendingChallenges.length === 0) {
                        return message.channel.send('There are no pending challenges. Start one by sending the command `!c {mention}`.');
                    }

                    const pendingChallengesTable = table([
                        ['Challenger', 'Defender'],
                        ...pendingChallenges.map(pc => [getUserFromId(pc.challenger_id, bot).username, getUserFromId(pc.defender_id, bot).username])
                    ]);

                    return message.channel.send(`\`\`\`${pendingChallengesTable}\`\`\``);
                })
                .catch(err => message.channel.send(formatGraphQLError(err.message)));
        }

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

                const ms = new Date(challenge.started_at).getTime();

                return message.channel.send(`${user === message.author ? 'You have' : `${createMention(user.id)} has`} ${challenge.is_ego ? 'an ego' : 'a pending'} challenge with ${user.id === challenge.challenger_id ? createMention(challenge.defender_id) : createMention(challenge.challenger_id)} that started ${timeAgo.format(ms)}.`);
            })
            .catch(err => {
                message.channel.send(formatGraphQLError(err.message));
            });
    }
};
