import gql from 'graphql-tag';
import table from 'markdown-table';
import { getRank, listChallenges } from '../src/graphql/queries';
import getUserFromMention from '../helpers/getUserFromMention';
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
            .then(challengesRes => {
                apollo.query({
                    query: gql(getRank),
                    variables: {
                        player_id: user.id
                    },
                    fetchPolicy: 'no-cache'
                })
                    .then(rankRes => {
                        const rank = rankRes.data.getRank;
                        const challenges = challengesRes.data.listChallenges.items;
                        const numOfChallenges = challenges.filter(challenge => challenge.status === 'completed').length;
                        const numOfVictories = challenges.filter(challenge => challenge.winner === user.id).length;
                        const numOfLosses = challenges.filter(challenge => challenge.loser === user.id).length;
                        const numOfDefendingTitles = challenges.filter(challenge => challenge.is_ego && challenge.winner === user.id && challenge.challenger_id === user.id).length;

                        const stats = table(
                            [
                                ['Property', user.username],
                                ['Rank', rank],
                                ['Defending Titles', numOfDefendingTitles],
                                ['# of Challenges', numOfChallenges],
                                ['# of Victories', numOfVictories],
                                ['Win/Lose Ratio', `${(numOfVictories / numOfChallenges) * 100}%`],
                                ['# of Losses', numOfLosses]
                            ],
                            {
                                align: ['l', 'c']
                            }
                        );
        
                        message.channel.send(`\`\`\`${stats}\`\`\``);
                    })
                    .catch(err => {
                        message.channel.send(formatGraphQLError(err.message));
                    });
            })
            .catch(err => {
                message.channel.send(formatGraphQLError(err.message));
            });
    }
};
