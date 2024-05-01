import { appStore, envStore, logger } from 'rg-commander';

const URI = appStore.uri;

export default async (fn, ...args) => {
  // const token = envStore.get('token');
  // const org = envStore.get('org');
  //
  // if (!token) {
  //   throw new Error('No value on token in config');
  // }
  //
  // if (!org) {
  //   throw new Error('No value on org in config');
  // }
  //
  // const uri = envStore.get('uri') || URI;
  // const organization = org;
  // const authorization = `Bearer ${token}`;
  //
  // logger.debug(`uri: ${uri}`);
  // logger.debug(`organization: ${organization}`);
  // logger.debug(`authorization: ${authorization.substring(0, 7)}${authorization.substring(7).replace(/./g, '*')}`);
  //
  // args[0] = {
  //   organization,
  //   authorization,
  //   uri,
  //   ...args[0],
  // };

  return await fn(...args);
}
