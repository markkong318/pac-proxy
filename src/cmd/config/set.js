import { configStore, program, view } from 'rg-commander';

const action = async (key, value, options) => {
  configStore.set(key, value);

  await view.configSet.render({
    key,
    value,
  });
};


const install = (path) => program
  .pathCommand(path)
  .description('set key-value to config')
  .argument('<key>', 'key')
  .argument('[value]', 'value')
  .option('--output <output>', 'output target')
  .action(action);

export default {
  action,
  install,
};
