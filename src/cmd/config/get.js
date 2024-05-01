import { configStore, program, view } from 'rg-commander';

const action = async (key, options) => {
  const value = configStore.get(key);
  if (value === undefined) {
    throw new Error('Key is not existed')
  }

  await view.configGet.render({
    key,
    value,
  });
};

const install = (path) => program
  .pathCommand(path)
  .description('get config value from key')
  .argument('<key>', 'key')
  .option('--output <output>', 'output target')
  .action(action);

export default {
  action,
  install,
};
