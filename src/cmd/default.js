import { createPacResolver } from 'pac-resolver';
import { getQuickJS } from 'quickjs-emscripten';
import loadProxy from '../api/load-proxy.js';
import startServer from '../api/start-server.js';
import wrapper from '../util/wrapper.js';

export const action = async ({ args, options, logger }) => {
  const { file } = args;
  const { port } = options;

  const content = await loadProxy({ file });
  const quickJS = await getQuickJS();

  const createFindProxyAsync = ((quickJS, content) => {
    return async () => {
      return createPacResolver(quickJS, content);
    }
  })(quickJS, content);

  const findProxy = await wrapper(createFindProxyAsync);

  await startServer({
    findProxy,
    port,
    logger,
  })
};

export const install = (program) => program
  .version('1.0.0')
  .description('Map pac file as a proxy to local port')
  .argument('<file>', 'Path to the PAC file (local or remote)')
  .option('--port <port>', 'Local port to use', {
    validator: program.NUMBER,
    default: 8080
  });
