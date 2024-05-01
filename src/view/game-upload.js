import cliProgress from 'cli-progress';
import { logger } from 'rg-commander';

const render = ({ output, result }) => {
  const {
    version,
  } = result;

  switch (output) {
    case 'json':
      logger.info(JSON.stringify({
        result: 'ok',
        version,
      }));
      break;
    default:
      logger.info(`Upload successfully to version ${version}`);
  }
};

const onProgress = ({ output }) => {
  let bar;

  return (event) => {
    if (output) {
      return;
    }

    const {
      loaded,
      total,
    } = event;

    if (!bar) {
      bar = new cliProgress.SingleBar({
        format: 'Uploading... [{bar}] {percentage}% | {value}/{total}'
      });
      bar.start(total, 0);
    }

    bar.update(loaded);

    if (loaded === total) {
      bar.stop();
      logger.info('Processing...')
    }
  };
};

export default {
  render,
  onProgress,
};
