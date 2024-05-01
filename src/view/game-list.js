import chalk from 'chalk';
import { cliTable, logger } from 'rg-commander';

const render = ({ output, games }) => {
  switch (output) {
    case 'json':
      logger.info(JSON.stringify({
        result: 'ok',
        games,
      }));
      break;
    default:
      const table = cliTable.create({
        header: ['', 'name', 'id'],
        width: [4, 40, 40],
        style: [, , chalk.green],
      });

      for (let i = 0; i < games.length; i++) {
        const {
          gameId,
          name,
        } = games[i];

        table.push(`${(i + 1)}.`, name, gameId);
      }

      table.draw();
  }
};

export default {
  render,
};
