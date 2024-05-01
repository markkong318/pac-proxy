import request from '../app/net/request.js';

export default async ({ uri, gameId, authorization }) => {
  const kind = 'game';

  const statement = `
    query {
      ${kind} (gameId: "${gameId}") {
        gameId
        name
        deployment {
          deployedVersion
        }
        versions {
          version
          createdAt
        }
      }
    }
  `;

  const data = await request.send({ uri, statement, authorization });

  return data[kind];
};
