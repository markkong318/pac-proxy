import { logger } from 'rg-commander';

const render = ({ output, key, value }) => {
  switch (output) {
    case 'json':
      logger.info(JSON.stringify({
        result: 'ok',
        key,
        value,
      }));
      break;
    default:
      logger.info('Success');
  }
};

export default {
  render,
};
