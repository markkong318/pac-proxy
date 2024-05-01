import request from '../app/net/request.js';

export default async ({ uri, gameId, authorization, version }) => {
  const kind = 'deployGameVersion';

  const statement = `
    mutation ($gameId: ID!, $input: DeployGameVersionInput!){
      ${kind} (
        gameId: $gameId,
        input: $input) {
        deployedVersion
      }
    }
  `;

  const variables = {
    gameId,
    input: {
      deployedVersion: version,
    }
  };

  const data = await request.send({ uri, statement, variables, authorization });

  return data[kind];
};
