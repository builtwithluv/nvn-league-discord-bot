/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getChallenge = `query GetChallenge($id: ID!) {
  getChallenge(id: $id) {
    id
    challenger_id
    defender_id
    status
    challenger_reported_score {
      own
      opponent
    }
    defender_reported_score {
      own
      opponent
    }
    winner
    loser
    started_at
    completed_at
    is_ego
    challenger_rank
    defender_rank
    is_conceded
    leaderboard_id
  }
}
`;
export const listChallenges = `query ListChallenges(
  $filter: TableChallengeFilterInput
  $limit: Int
  $nextToken: String
) {
  listChallenges(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      challenger_id
      defender_id
      status
      challenger_reported_score {
        own
        opponent
      }
      defender_reported_score {
        own
        opponent
      }
      winner
      loser
      started_at
      completed_at
      is_ego
      challenger_rank
      defender_rank
      is_conceded
      leaderboard_id
    }
    nextToken
  }
}
`;
export const getLeaderboard = `query GetLeaderboard($leaderboard_id: String!) {
  getLeaderboard(leaderboard_id: $leaderboard_id) {
    id
    ranks
  }
}
`;
export const getRank = `query GetRank($leaderboard_id: String!, $player_id: String!) {
  getRank(leaderboard_id: $leaderboard_id, player_id: $player_id)
}
`;
export const getUser = `query GetUser($player_id: String!) {
  getUser(player_id: $player_id) {
    id
    leaderboard_stats {
      leaderboard_id
    }
  }
}
`;
