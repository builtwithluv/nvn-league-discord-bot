/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getChallenge = `query GetChallenge($id: ID!) {
  getChallenge(id: $id) {
    id
    challenger
    defender
    challenger_score
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
      challenger
      defender
      challenger_score
    }
    nextToken
  }
}
`;
