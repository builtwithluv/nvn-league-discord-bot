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
      winner
      loser
    }
    nextToken
  }
}
`;
export const getLeaderboard = `query GetLeaderboard {
  getLeaderboard {
    id
    ranks
  }
}
`;
export const getRank = `query GetRank($player_id: String!) {
  getRank(player_id: $player_id)
}
`;
