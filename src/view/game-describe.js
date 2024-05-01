import _ from 'lodash';
import moment from 'moment';
import { cliTable, logger } from 'rg-commander';

const render = ({ output, game }) => {
  switch (output) {
    case 'json':
      logger.info(JSON.stringify({
        result: 'ok',
        ...game,
      }));
      break;
    default:
      const table = cliTable.create({
        header: ['key', 'value'],
        width: [20,],
      });

      table.push('Name', _.get(game, 'name'));
      table.push('Game ID', _.get(game, 'gameId'));
      table.push('Version', _.get(game, 'deployment.deployedVersion'));
      table.push('Last Updated', renderLastUpdated(game));

      table.draw();
  }
};

const renderLastUpdated = (game) => {
  let str = '';

  const gameVersions = _.get(game, 'versions');
  const deployed = _.get(game, 'deployment.deployedVersion');

  const gameVersion = _.find(gameVersions, { 'version': deployed });

  if (!gameVersion) {
    return '';
  }

  str = moment(gameVersion.createdAt).format('YYYY-MM-DD HH:mm:ss');

  return str;
};

export default {
  render,
};
