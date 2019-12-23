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
