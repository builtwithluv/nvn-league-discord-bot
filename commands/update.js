import gql from 'graphql-tag';
import { updateReportedScore } from '../src/graphql/mutations';
import createMention from '../helpers/createMentionFromUserId';
import formatGraphQLError from '../helpers/formatGraphQLError';

export default {
    name: ['update', 'u'],
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

                const getFinalScoreText = score => `The final score was \`${score.own}-${score.opponent}\``;

                if (challenge.winner === challenge.challenger_id && challenge.is_ego) {
                    return message.channel.send(`${createMention(challenge.winner)}'s ego gain another boost after defeating ${createMention(challenge.loser)}. ${getFinalScoreText(challenge.challenger_reported_score)}.`);
                }

                if (challenge.loser === challenge.challenger_id && challenge.is_ego) {
                    return message.channel.send(`${createMention(challenge.loser)}'s ego just dropped after losing to ${createMention(challenge.winner)} in an ego challenge. Hail to the new King of Necs! ${getFinalScoreText(challenge.challenger_reported_score)}.`);
                }

                if (challenge.winner === challenge.defender_id && challenge.defender_rank === 1) {
                    return message.channel.send(`${createMention(challenge.loser)} lost his chance for the #1 spot while ${createMention(challenge.winner)} defended his title. ${getFinalScoreText(challenge.challenger_reported_score)}.`);
                }

                if (challenge.winner === challenge.challenger_id && challenge.defender_rank === 1) {
                    return message.channel.send(`Hail to the new King of Necs - ${createMention(challenge.winner)}! The #${challenger_rank} spot now belongs to ${createMention(challenge.loser)}. ${getFinalScoreText(challenge.challenger_reported_score)}.`);
                }

                return message.channel.send(`GG. ${createMention(challenge.winner)} just defeated ${createMention(challenge.loser)}. ${challenge.winner === challenge.challenger_id ? getFinalScoreText(challenge.challenger_reported_score) : getFinalScoreText(challenge.defender_reported_score)}.`);
            })
            .catch(err => message.channel.send(formatGraphQLError(err.message)));
    }
};
