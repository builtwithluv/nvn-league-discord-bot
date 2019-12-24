/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createChallenge = `mutation CreateChallenge($input: CreateChallengeInput!) {
  createChallenge(input: $input) {
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
  }
}
`;
export const updateReportedScore = `mutation UpdateReportedScore($input: UpdateReportedScoreInput!) {
  updateReportedScore(input: $input) {
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
export const register = `mutation Register($player_id: String) {
  register(player_id: $player_id) {
    id
    ranks
  }
}
`;
