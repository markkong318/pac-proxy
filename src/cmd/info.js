import { program, view } from 'rg-commander';

const action = async (options, logger) => {
  await view.info.render({});
};

const install = (path) => program
  .pathCommand(path)
  .description('Print the user info')
  .option('--token <token>', 'Access token')
  .option('--output <output>', 'Output target')
  .action(action);

export default {
  action,
  install,
};
