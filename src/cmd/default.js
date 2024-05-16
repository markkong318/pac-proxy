import fs from 'fs';
import { program, api } from 'rg-commander';
import { createPacResolver } from 'pac-resolver';
import { getQuickJS } from 'quickjs-emscripten';

const action = async (file, options) => {
  const content = await api.loadProxy({file});

  console.log(content)

  const quickJS = await getQuickJS();
  const findProxy = createPacResolver(quickJS, content);

  const port = options.port || 8080;

  await api.startServer({
    findProxy,
    port,
  })
};

const install = (path) => program
  .pathCommand(path)
  .description('hellow')
  .argument('Pac file')
  .option('--port <port>', 'Port')
  .action(action);

export default {
  action,
  install,
};
