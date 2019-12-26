import { ErrorCode, LeaderboardId } from '../constants';

import gql from 'graphql-tag';
import { concede } from '../src/graphql/mutations';
import createMentionFromUserId from '../helpers/createMentionFromUserId';

export default {
    name: 'concede',
    description: 'Concede from the current challenge',
    execute(message, args, bot, apollo) {
        if (!args[0]) {
            return message.channel.send('Are you sure you want to concede from your match? Type `!concede confirm` to concede.');
        }

        if (args[0] === 'confirm') {
            return apollo.mutate({
                mutation: gql(concede),
                variables: {
                    leaderboard_id: LeaderboardId,
                    player_id: message.author.id
                }
            })
                .then(res => {
                    const challenge = res.data.concede;
                    const winner = createMentionFromUserId(challenge.winner);

                    return message.channel.send(`You have conceded from your challenge with ${winner}.`);
                })
                .catch(err => {
                    let errorMessage;

                    switch (err.graphQLErrors[0].errorInfo.errorCode) {
                        case ErrorCode.UserHasNoPendingChallenge: {
                            errorMessage = 'You cannot concede because you have no pending challenge.';
                            break;
                        }

                        case ErrorCode.UserNotRegistered: {
                            errorMessage = 'You are not registered for the league! You can register by sending `!register`.';
                            break;
                        }
                    }

                    return message.channel.send(errorMessage);
                });
        }
    }
};
