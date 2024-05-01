import request from '../app/net/request.js';

export default async ({ uri, gameId, leaderboardId, authorization, version }) => {
  const kind = 'resetGameLeaderboard';

  const statement = `
    mutation ($gameId: ID!, $leaderboardId: ID!){
      ${kind}(gameId: $gameId, leaderboardId: $leaderboardId) {
        success
      }
    }
  `;

  const variables = {
    gameId,
    leaderboardId,
  };

  const data = await request.send({ uri, statement, variables, authorization });

  return data[kind];
};
