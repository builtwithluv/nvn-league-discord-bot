import gql from 'graphql-tag';
import { updateReportedScore } from '../src/graphql/mutations';
import createMention from '../helpers/createMentionFromUserId';
import formatGraphQLError from '../helpers/formatGraphQLError';

export default {
    name: 'update',
    description: 'Update a challenge score',
    execute(message, args, bot, apollo) {
        const ownScore = args[0];
        const opponentScore = args[1];

        if (ownScore === undefined || opponentScore === undefined) {
            return message.channel.send('Report the score as [yours] [opponents]. Ex: \`!update 5 0\`');
        }

        apollo.mutate({
            mutation: gql(updateReportedScore),
            variables: {
                input: {
                    reporter: message.author.id,
                    score: {
                        own: ownScore,
                        opponent: opponentScore
                    }
                }
            }
        })
            .then(res => {
                const challenge = res.data.updateReportedScore;

                if (challenge.status === 'pending_scores') {
                    if (!challenge.challenger_reported_score) {
                        return message.channel.send(`We still need to wait for ${createMention(challenge.challenger_id)} to update his score.`);
                    } else if (!challenge.defender_reported_score) {
                        return message.channel.send(`We still need to wait for ${createMention(challenge.defender_id)} to update his score.`);
                    } else {
                        const authorIsChallenger = message.author.id === challenge.challenger_id;
                        const authorReportedScore = authorIsChallenger ? challenge.challenger_reported_score : challenge.defender_reported_score;
                        const opponentReportedScore = authorIsChallenger ? challenge.defender_reported_score : challenge.challenger_reported_score;

                        return message.channel.send(`There is a mismatch in the score reporting. You reported the score as \`${authorReportedScore.own}-${authorReportedScore.opponent}\` and your opponent reported the score as \`${opponentReportedScore.opponent}-${opponentReportedScore.own}\` [you-opponent]. Please come to an agreement and update the score accordingly.`)
                    }
                }

                return message.channel.send('GG');
            })
            .catch(err => {
                message.channel.send(formatGraphQLError(err.message));
            });
    }
};
