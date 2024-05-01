import { api, program, view } from 'rg-commander';

const action = async (gameId, bundle, options) => {
  const comment = options.comment;

  const onProgress = await view.gameUpload.onProgress();

  const result = await api.uploadGame({
    gameId,
    bundle,
    comment,
    onProgress,
  });

  await view.gameUpload.render({ result });
};

const install = (path) => program
  .pathCommand(path)
  .description('upload game bundle')
  .argument('<game_id>', 'Game id')
  .argument('<bundle>', 'Bundle')
  .option('--org <org>', 'Organization')
  .option('--uri <uri>', 'Uri')
  .option('--comment <comment>', 'Comment')
  .option('--token <token>', 'Access token')
  .option('--output <output>', 'Output target')
  .action(action);

export default {
  action,
  install,
};
