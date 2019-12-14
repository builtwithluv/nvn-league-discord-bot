import gql from 'graphql-tag';
import { listChallenges } from '../src/graphql/queries';
import { createChallenge } from '../src/graphql/mutations';
import getUserFromMention from '../helpers/getUserFromMention';
import createMention from '../helpers/createMentionFromUserId';

const createFilterChallengeQuery = userId => ({
    and: [{
        or: [{
            challenger_id: {
                eq: userId
            }
        },
        {
            defender_id: {
                eq: userId
            }
        }]
    },
    {
        or: [{
            status: {
                eq: "pending_results"
            }
        },
        {
            status: {
                eq: "pending_acceptance"
            }
        }]
    }]
});

export default {
    name: 'challenge',
    description: 'Challenge a friendly foe',
    execute(message, args, bot, apollo) {
        const challenger = message.author;
        const mention = args[0];

        if (!mention) {
            message.channel.send('Make sure you mention who you want to challenge!');

            return;
        }

        const defender = getUserFromMention(mention, bot);

        if (!defender) {
            message.channel.send('I did not recognize who you wanted to challenge. Use the @{mention} syntax');

            return;
        }

        if (defender.bot) {
            message.channel.send('Dodged.');

            return;
        }

        if (challenger === defender) {
            message.channel.send('Haha. You can\'t duel yourself silly.');

            return;
        }

        /**
         * A long promise chain since await is not supported yet but flow is
         *  1. check if challenger has a pending challenge
         *  2. check if defender has a pending challenge
         *  3. create challenge if above passes
         * */

        // Check if challenger has a pending challenge
        apollo.query({
            query: gql(listChallenges),
            variables: {
                filter: createFilterChallengeQuery(challenger.id)
            },
            fetchPolicy: 'no-cache'
        })
            .then(res => {
                const pendingChallengerChallenges = res.data.listChallenges.items;

                if (pendingChallengerChallenges.length > 0) {
                    const pendingChallenge = pendingChallengerChallenges[0];

                    let defenderId;

                    if (pendingChallenge.challenger_id === challenger.id) {
                        defenderId = pendingChallenge.defender_id;
                    } else {
                        defenderId = pendingChallenge.challenger_id;
                    }

                    message.channel.send(`You need to wrap up your challenge with ${createMention(defenderId)}`);

                    return;
                }

                // Check if defender has a pending challenge
                apollo.query({
                    query: gql(listChallenges),
                    variables: {
                        filter: createFilterChallengeQuery(defender.id)
                    },
                    fetchPolicy: 'no-cache'
                })
                    .then(res => {
                        const pendingDefenderChallenges = res.data.listChallenges.items;

                        if (pendingDefenderChallenges.length > 0) {
                            const pendingChallenge = pendingDefenderChallenges[0];

                            let defenderChallengerId;

                            if (pendingChallenge.defender_id === defender.id) {
                                defenderChallengerId = pendingChallenge.challenger_id;
                            } else {
                                defenderChallengerId = pendingChallenge.defender_id;
                            }

                            message.channel.send(`${createMention(defender.id)} needs to wrap up his challenge with ${createMention(defenderChallengerId)} first`);

                            return;
                        }

                        apollo.mutate({
                            mutation: gql(createChallenge),
                            variables: {
                                input: {
                                    challenger_id: challenger.id,
                                    defender_id: defender.id,
                                    status: 'pending_acceptance'
                                }
                            }
                        })
                            .then(() => {
                                message.channel.send(`${createMention(challenger.id)} has challenged ${createMention(defender.id)} to a duel!`);
                            });
                    });
            })
            .catch(err => {
                console.error(err);
                message.channel.send('Hmm... For some reason, I couldn\'t create that challenge.');
            });
    }
};
