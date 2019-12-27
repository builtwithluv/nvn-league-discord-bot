import gql from 'graphql-tag';
import { register } from '../src/graphql/mutations';
import formatGraphQLError from '../helpers/formatGraphQLError';

export default {
    name: 'register',
    description: 'Register for the league',
    execute(message, args, bot, apollo) {
        apollo.mutate({
            mutation: gql(register),
            variables: {
                leaderboard_id: message.guild.id,
                player_id: message.author.id
            }
        })
            .then(() => {
                message.channel.send("You are now part of the league! Start a challenge by sending the command `!c {mention}`.");
            })
            .catch(err => {
                message.channel.send(formatGraphQLError(err.message));
            });
    }
};
