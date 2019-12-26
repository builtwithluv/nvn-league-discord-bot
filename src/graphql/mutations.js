/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createChallenge = `mutation CreateChallenge($leaderboard_id: ID!, $input: CreateChallengeInput!) {
  createChallenge(leaderboard_id: $leaderboard_id, input: $input) {
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
export const updateReportedScore = `mutation UpdateReportedScore(
  $leaderboard_id: ID!
  $input: UpdateReportedScoreInput!
) {
  updateReportedScore(leaderboard_id: $leaderboard_id, input: $input) {
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
export const createLeaderboard = `mutation CreateLeaderboard {
  createLeaderboard {
    id
    ranks
  }
}
`;
export const register = `mutation Register($leaderboard_id: ID!, $player_id: String!) {
  register(leaderboard_id: $leaderboard_id, player_id: $player_id) {
    id
    ranks
  }
}
`;
export const concede = `mutation Concede($leaderboard_id: ID!, $player_id: String!) {
  concede(leaderboard_id: $leaderboard_id, player_id: $player_id) {
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
export const drop = `mutation Drop($leaderboard_id: ID!, $player_id: String!) {
  drop(leaderboard_id: $leaderboard_id, player_id: $player_id) {
    id
    ranks
  }
}
`;
