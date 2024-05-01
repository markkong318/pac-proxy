import { api, program, view } from 'rg-commander';

const action = async (gameId, options) => {
  const game = await api.getGame({
    gameId,
  });

  await view.gameDescribe.render({ game });
};

const install = (path) => program
  .pathCommand(path)
  .description('print game info')
  .argument('<game_id>', 'Game id')
  .option('--org <org>', 'Organization')
  .option('--uri <uri>', 'Uri')
  .option('--token <token>', 'Access token')
  .option('--output <output>', 'Output target')
  .action(action);

export default {
  action,
  install,
};
