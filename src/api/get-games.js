import request from '../app/net/request.js';

export default async ({ uri, organization, authorization }) => {
  const kind = 'listGames';

  const statement = `
    query {
      ${kind} (orgId: "${organization}") {
        gameId
        name
      }
    }
  `;

  const data = await request.send({ uri, statement, authorization });

  return data[kind];
};
