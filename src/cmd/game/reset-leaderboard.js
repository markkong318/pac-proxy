import { api, program, view } from 'rg-commander';

const action = async (gameId, leaderboardId, options) => {
  const result = await api.setResetLeaderboard({
    gameId,
    leaderboardId,
  });

  await view.gameResetLeaderboard.render({ result });
};

const install = (path) => program
  .pathCommand(path)
  .description('reset leaderboard')
  .argument('<game_id>', 'Game id')
  .argument('<leaderboard_id>', 'Leaderboard id')
  .option('--org <org>', 'Organization')
  .option('--uri <uri>', 'Uri')
  .option('--token <token>', 'Access token')
  .option('--output <output>', 'Output target')
  .action(action);

export default {
  action,
  install,
};
