import { logger } from 'rg-commander';

const render = ({ output, result }) => {
  switch (output) {
    case 'json':
      logger.info(JSON.stringify({
        result: 'ok',
      }));
      break;
    default:
      logger.info(`Success`);
  }
};

export default {
  render,
};
