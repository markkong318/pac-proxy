import { api, program, view } from 'rg-commander';

const action = async (gameId, version, options) => {
  if (isNaN(version)) {
    throw new Error('Please type integer for version');
  }

  version = parseInt(version);

  const result = await api.setDeploy({
    gameId,
    version,
  });

  await view.gameDeploy.render({ result });
};

const install = (path) => program
  .pathCommand(path)
  .description('deploy game')
  .argument('<game_id>', 'Game id')
  .argument('<version>', 'Version Number')
  .option('--org <org>', 'Organization')
  .option('--uri <uri>', 'Uri')
  .option('--token <token>', 'Access token')
  .option('--output <output>', 'Output target')
  .action(action);

export default {
  action,
  install,
};
