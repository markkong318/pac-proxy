import apolloClient from '@apollo/client/core/core.cjs';
import fetch from 'cross-fetch';
import fs from 'fs';
import gql from 'graphql-tag';
import { logger } from 'rg-commander';
import superagent from 'superagent';

const { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } = apolloClient;

const send = async ({ uri, statement, variables, authorization }) => {
  logger.debug(`uri: ${uri}`);

  logger.debug('statement:');
  logger.debug(statement);

  const httpLink = createHttpLink({
    uri,
    fetch,
  })

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        authorization,
      }
    });

    return forward(operation);
  });

  const loggerLink = new ApolloLink((operation, forward) => {
    return forward(operation).map(result => {
      const context = operation.getContext();

      Object.keys(context.headers).forEach((key) => {
        if (key === 'authorization') {
          context.headers[key] = `${context.headers[key].substring(0, 7)}${context.headers[key].substring(7).replace(/./g, '*')}`;
        }
      });

      logger.debug(context.headers)

      logger.debug(`status: ${context.response.status}`);

      logger.debug(`response:`);
      logger.debug(JSON.parse(JSON.stringify(result)));

      return result
    })
  });

  const client = new ApolloClient({
    link: ApolloLink.from([
      authLink,
      loggerLink,
      httpLink,
    ]),
    cache: new InMemoryCache({
      addTypename: false,
    })
  })

  let result;

  const action = statement.split(/[\s\n]+/).filter((el) => el.length !== 0)[0];

  if (action === 'query') {
    const query = gql`${statement}`

    logger.debug('query:');
    logger.debug(query);

    result = await client.query({
      query
    });
  } else if (action === 'mutation') {
    const mutation = gql`${statement}`

    logger.debug('mutation:');
    logger.debug(mutation);
    logger.debug('variables:');
    logger.debug(variables);

    result = await client.mutate({
      mutation,
      variables,
    });
  }

  return result.data;
}

const upload = async ({ url, bundle, onProgress = () => {} }) => {
  logger.debug(`url: ${url}`);
  logger.debug(`bundle: ${bundle}`);

  const file = fs.readFileSync(bundle);

  const result = await superagent
    .put(url)
    .set('Content-Type', 'application/zip')
    .on('progress', onProgress)
    .send(file);

  logger.debug(`status: ${result.status}`);
}

export default {
  send,
  upload,
};
