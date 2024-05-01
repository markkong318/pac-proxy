import { api, program, view } from 'rg-commander';

const action = async (gameId, options, logger) => {
  const games = await api.getGames({
    gameId,
  });

  await view.gameList.render({ games });
};

const install = (path) => program
  .pathCommand(path)
  .description('print game list')
  .option('--org <org>', 'Organization')
  .option('--uri <uri>', 'Uri')
  .option('--token <token>', 'Access token')
  .option('--output <output>', 'Output target')
  .action(action);

export default {
  action,
  install,
};
