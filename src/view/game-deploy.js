import { logger } from 'rg-commander';

const render = ({ output, result }) => {
  const {
    deployedVersion,
  } = result;

  switch (output) {
    case 'json':
      logger.info(JSON.stringify({
        result: 'ok',
        current_version: deployedVersion,
      }));
      break;
    default:
      logger.info(`Deploy successfully to ${deployedVersion}`);
  }
};

export default {
  render,
};
