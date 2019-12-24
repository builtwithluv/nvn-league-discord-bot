import gql from 'graphql-tag';
import table from 'markdown-table';
import { getLeaderboard } from '../src/graphql/queries';
import getUserFromId from '../helpers/getUserFromId';
import formatGraphQLError from '../helpers/formatGraphQLError';

export default {
    name: ['leaderboard', 'lb'],
    description: 'Get the leaderboard',
    execute(message, args, bot, apollo) {
        apollo.query({
            query: gql(getLeaderboard),
            fetchPolicy: 'no-cache'
        })
            .then(res => {
                if (!res.data.getLeaderboard) {
                    return message.channel.send('There is no one on the leaderboards.');
                }

                const ranks = res.data.getLeaderboard.ranks;

                const tableRanks = ranks.map((playerId, i) => [getUserFromId(playerId, bot).username, i + 1]);

                const leaderboard = table(
                    [
                        ['Player', 'Rank'],
                        ...tableRanks
                    ],
                    {
                        align: ['l', 'c']
                    }
                );

                message.channel.send(`\`\`\`${leaderboard}\`\`\``);
            })
            .catch(err => {
                message.channel.send(formatGraphQLError(err.message));
            });
    }
};
