import { ErrorCode } from '../constants';

import gql from 'graphql-tag';
import { drop } from '../src/graphql/mutations';

export default {
    name: 'drop',
    description: 'Drop from the league',
    execute(message, args, bot, apollo) {
        if (!args[0]) {
            return message.channel.send('Are you sure you want to drop from the league? You will concede from your pending challenges. Type `!drop confirm` to drop.');
        }

        if (args[0] === 'confirm') {
            return apollo.mutate({
                mutation: gql(drop),
                variables: {
                    leaderboard_id: message.guild.id,
                    player_id: message.author.id
                }
            })
                .then(() => message.channel.send('Sad to see you go! You are always welcomed back. =\)'))
                .catch(err => {
                    if (err.graphQLErrors[0].errorInfo.errorCode === ErrorCode.UserNotRegistered) {
                        return message.channel.send('You cannot drop from the league since you are not even registered!');
                    }
                });
        }
    }
};
