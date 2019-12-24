import gql from 'graphql-tag';
import table from 'markdown-table';
import { listChallenges } from '../src/graphql/queries';
import getUserFromMention from '../helpers/getUserFromMention';
import getUserFromId from '../helpers/getUserFromId';
import formatGraphQLError from '../helpers/formatGraphQLError';

export default {
    name: ['history', 'h'],
    description: 'Get game history',
    execute(message, args, bot, apollo) {
        const createHistoryTable = (challenges = []) => {
            return table(
                [
                    ['Challenger', 'Defender', 'Score'],
                    ...challenges.map(c => {
                        const isChallengerWinner = c.winner === c.challenger_id;
                        const challenger = getUserFromId(c.challenger_id, bot);
                        const defender = getUserFromId(c.defender_id, bot);
                        const challengeReportedScore = c.challenger_reported_score;
                        const row = [challenger.username, defender.username, `${challengeReportedScore.own}-${challengeReportedScore.opponent}`];

                        if (isChallengerWinner) {
                            row[0] = `*${row[0]}*`;
                        } else {
                            row[1] = `*${row[1]}*`;
                        }

                        return row;
                    })
                ],
                {
                    align: ['l', 'l', 'c']
                }
            );
        };

        if (args[0] === 'all') {
            return apollo.query({
                query: gql(listChallenges),
                variables: {
                    filter: {
                        status: {
                            eq: 'completed'
                        }
                    }
                },
                fetchPolicy: 'no-cache'
            })
                .then(res => {
                    const completeChallenges = res.data.listChallenges.items;

                    if (completeChallenges.length === 0) {
                        return message.channel.send('There are no completed challenges.');
                    }

                    return message.channel.send(`\`\`\`${createHistoryTable(completeChallenges)}\`\`\``);
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
                            eq: 'completed'
                        }
                    }
                    ]
                }
            },
            fetchPolicy: 'no-cache'
        })
            .then(res => {
                const challenges = res.data.listChallenges.items;

                if (challenges.length === 0) {
                    if (user === message.author) {
                        return message.channel.send('You have not completed any duels yet.');
                    }

                    return message.channel.send('That player has not completed any duels yet.');
                }

                return message.channel.send(`\`\`\`${createHistoryTable(challenges)}\`\`\``);
            })
            .catch(err => {
                message.channel.send(formatGraphQLError(err.message));
            });
    }
};
