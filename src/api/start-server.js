import http from 'http';
import net from 'net';
import { logger } from 'rg-commander';

export default async ({findProxy, port}) => {
  const server = http.createServer();

  server
    .on('clientError', (err, soc) => onErr(err, 'cliErr', '', soc))
    .on('connect', async function (cliReq, cliSoc, cliHead) {
      const [host, port] = cliReq.url.split(':');

      const proxyUrl = await findProxy((port === 443 ? 'https' : 'http') + '://' + cliReq.url, host);
      const match = proxyUrl.match(/^PROXY\s+(.+):(\d+);?$/i);

      let svrSoc;
      if (match) {
        logger.debug(`Proxy ${cliReq.url} -> ${match[1]}`);

        const svrReq = http.request({
          host: match[1], port: match[2],
          path: cliReq.url, method: cliReq.method, headers: cliReq.headers,
          agent: cliSoc.$agent
        });

        svrReq.end();
        svrReq.on('connect', function (svrRes, svrSoc2, svrHead) {
          svrSoc = svrSoc2;
          cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
          if (cliHead && cliHead.length) svrSoc.write(cliHead);
          if (svrHead && svrHead.length) cliSoc.write(svrHead);
          svrSoc.pipe(cliSoc);
          cliSoc.pipe(svrSoc);
          svrSoc.on('error', err => onErr(err, 'svrSoc', cliReq.url, cliSoc));
        });
        svrReq.on('error', err => onErr(err, 'svrRq2', cliReq.url, cliSoc));
      } else {
        logger.debug(`Direct ${cliReq.url}`);

        svrSoc = net.connect(port || 443, host, function () {
          cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
          if (cliHead && cliHead.length) svrSoc.write(cliHead);
          cliSoc.pipe(svrSoc);
        });

        svrSoc.pipe(cliSoc);
        svrSoc.on('error', err => onErr(err, 'svrSoc', cliReq.url, cliSoc));
      }
      cliSoc.on('error', err => onErr(err, 'cliSoc', cliReq.url, svrSoc));
    })
    .on('connection', function onConn(cliSoc) {
      cliSoc.$agent = new http.Agent({keepAlive: true});
      cliSoc.$agent.on('error', err => console.log('agent:', err));
    })
    .listen(port, () => logger.info('http proxy server started on port ' + port));

  function onErr(err, msg, url, soc) {
    if (soc) soc.end();
    logger.error(msg, url, err + '');
  }
};
