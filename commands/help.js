const helpMessage = `
\`\`\`
NvN Bot Commands

[!register] to register for the league.
[!challenge @user] to challenge someone.
[!update {your score} {their score}] to report the score for the current challenge.
[!stats @user] to get the stats for that user.
[!stats] to get the stat of yourself.
[!pending] to see your pending challenge.
[!pending @user] to see the pending challenge for that user.
[!pending all] to see all pending challenges.
[!leaderboard] to get the leaderboard.
[!history] to see your game history.
[!history @user] to see the user history.
[!history all] to see the league history.
[!concede] to concede from your challenge.
[!drop] to drop from the league.
[!help] to see available commands.

Shortcuts:
!challenge or !c
!update or !u
!stats or !s
!pending or !p
!leaderboard or !lb
!history or !h
\`\`\`
`;

export default {
    name: 'help',
    description: 'Get available commands',
    execute(message, args, bot, apollo) {
        return message.channel.send(helpMessage);
    }
};