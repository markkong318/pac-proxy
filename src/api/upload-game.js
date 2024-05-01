import zip from 'is-zip-file';

import request from '../app/net/request.js';

export default async (
  {
    uri,
    gameId,
    authorization,
    bundle,
    comment,
    onProgress = () => {}
  }) => {

  if (!zip.isZipSync(bundle)) {
    throw new Error(`${bundle} is not a valid zip file`);
  }

  const kind = 'createGameVersion';

  const statement = `
    mutation ($gameId: ID!, $input: CreateGameVersionInput!){
      ${kind} (
        gameId: $gameId, 
        input: $input) {
        signedUrl,
        version
      }
    }
  `;

  const variables = {
    gameId,
    input: {
      description: comment || "Upload via lgputil",
    },
  };

  const data = await request.send({ uri, statement, variables, authorization });

  const { signedUrl: url } = data[kind];

  await request.upload({
    url,
    bundle,
    onProgress,
  });

  return data[kind];
};
