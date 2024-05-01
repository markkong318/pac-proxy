import moment from 'moment';
import { cliTable, logger } from 'rg-commander';

const render = ({ output }) => {
  switch (output) {
    case 'json':
      logger.info(JSON.stringify({
        result: 'ok',
      }));
      break;
    default:
      const table = cliTable.create({
        header: ['key', 'value'],
        width: [20,],
      });

      table.draw();
  }
};

const renderExpire = (jwt) => {
  if (!jwt.exp) {
    return 'No';
  }

  let str = '';

  const exp = moment.unix(jwt.exp);

  str += exp.format('YYYY-MM-DD HH:mm:ss');

  const now = moment();

  if (exp.isAfter(now)) {
    const diff = exp - now;
    const dur = moment.duration(diff);

    str += ` (${dur.hours()} hrs ${dur.minutes()} min ${dur.seconds()} sec left)`;
  }

  return str;
};

export default {
  render,
};
