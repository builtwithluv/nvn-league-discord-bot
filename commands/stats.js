import { LeaderboardId } from '../constants';

import gql from 'graphql-tag';
import table from 'markdown-table';
import { getRank, listChallenges } from '../src/graphql/queries';
import getUserFromMention from '../helpers/getUserFromMention';
import formatGraphQLError from '../helpers/formatGraphQLError';

export default {
    name: ['stats', 's'],
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
                        leaderboard_id: LeaderboardId,
                        player_id: user.id
                    },
                    fetchPolicy: 'no-cache'
                })
                    .then(rankRes => {
                        const rank = rankRes.data.getRank;
                        const challenges = challengesRes.data.listChallenges.items;
                        const numOfChallenges = challenges.filter(challenge => challenge.status === 'completed').length;
                        const numOfEgoChallenges = challenges.filter(challenge => challenge.is_ego).length;
                        const numOfEgoWins = challenges.filter(challenge => challenge.is_ego && challenge.winner === challenge.challenger_id).length;
                        const numOfEgoLosses = challenges.filter(challenge => challenge.is_ego && challenge.loser === challenge.challenger_id).length;
                        const numOfTotalWins = challenges.filter(challenge => challenge.winner === user.id).length;
                        const numOfTotalLosses = challenges.filter(challenge => challenge.loser === user.id).length;
                        const numOfDefendingTitles = challenges.filter(challenge => (challenge.winner === challenge.defender_id && challenge.defender_rank === 1) || (challenge.is_ego && challenge.winner === challenge.challenger_id)).length;

                        const stats = table(
                            [
                                ['Property', user.username],
                                ['Rank', rank],
                                ['# of Challenges', numOfChallenges],
                                ['# of Defending Titles', numOfDefendingTitles],
                                ['# of Ego Challenges', numOfEgoChallenges],
                                ['# of Ego Wins', numOfEgoWins],
                                ['# of Ego Loss', numOfEgoLosses],
                                ['Total # of Wins', numOfTotalWins],
                                ['Total # of Loss', numOfTotalLosses],
                                ['Win/Lose Ratio', numOfChallenges === 0 ? 'N/A' : `${Math.round((numOfTotalWins / numOfChallenges) * 100)}%`],
                            ],
                            {
                                align: ['l', 'c']
                            }
                        );

                        return message.channel.send(`\`\`\`${stats}\`\`\``);
                    })
                    .catch(err => {
                        if (user === message.author) {
                            return message.channel.send('You are not registered for the league. You can register by sending the command `!register`.')
                        }

                        return message.channel.send(formatGraphQLError(err.message));
                    });
            })
            .catch(err => {
                message.channel.send(formatGraphQLError(err.message));
            });
    }
};
