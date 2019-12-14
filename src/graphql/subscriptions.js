/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateChallenge = `subscription OnCreateChallenge(
  $id: ID
  $challenger_id: String
  $defender_id: String
  $status: ChallengeStatus
  $winner: String
) {
  onCreateChallenge(
    id: $id
    challenger_id: $challenger_id
    defender_id: $defender_id
    status: $status
    winner: $winner
  ) {
    id
    challenger_id
    defender_id
    status
    winner
    loser
    challenger_reported_score
    defender_reported_score
    score
  }
}
`;
export const onUpdateChallenge = `subscription OnUpdateChallenge(
  $id: ID
  $challenger_id: String
  $defender_id: String
  $status: ChallengeStatus
  $winner: String
) {
  onUpdateChallenge(
    id: $id
    challenger_id: $challenger_id
    defender_id: $defender_id
    status: $status
    winner: $winner
  ) {
    id
    challenger_id
    defender_id
    status
    winner
    loser
    challenger_reported_score
    defender_reported_score
    score
  }
}
`;
export const onDeleteChallenge = `subscription OnDeleteChallenge(
  $id: ID
  $challenger_id: String
  $defender_id: String
  $status: ChallengeStatus
  $winner: String
) {
  onDeleteChallenge(
    id: $id
    challenger_id: $challenger_id
    defender_id: $defender_id
    status: $status
    winner: $winner
  ) {
    id
    challenger_id
    defender_id
    status
    winner
    loser
    challenger_reported_score
    defender_reported_score
    score
  }
}
`;
