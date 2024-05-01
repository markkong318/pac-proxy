import http from 'http';
import url from 'url';
import net from 'net';
import { appStore, envStore, logger } from 'rg-commander';

export default async ({findProxy, port}) => {
  const HTTP_PORT = port || 8080;  // internal proxy server port
  // const PROXY_URL = process.argv[3] || null;  // external proxy server URL
  // const PROXY_HOST = PROXY_URL ? url.parse(PROXY_URL).hostname : null;
  // const PROXY_PORT = PROXY_URL ? (url.parse(PROXY_URL).port || 80) : null;

  const server = http.createServer(function(cliReq, cliRes) {
    let svrSoc;

    const cliSoc = cliReq.socket;
    const x = url.parse(cliReq.url);

    const svrReq = http.request({
      host: x.hostname,
      port: x.port,
      path: x.path,
      method: cliReq.method,
      headers: cliReq.headers,
      agent: cliSoc.$agent
    }, function(svrRes) {
      svrSoc = svrRes.socket;
      cliRes.writeHead(svrRes.statusCode, svrRes.headers);
      svrRes.pipe(cliRes);
    });

    cliReq.pipe(svrReq);

    svrReq.on('error', function(err) {
      cliRes.writeHead(400, err.message, {'content-type': 'text/html'});
      cliRes.end('<h1>' + err.message + '<br/>' + cliReq.url + '</h1>');
      onErr(err, 'svrReq', x.hostname + ':' + (x.port || 80), svrSoc);
    });
  })
    .on('clientError', (err, soc) => onErr(err, 'cliErr', '', soc))
    .on('connect', async function onCliConn(cliReq, cliSoc, cliHead) {

      console.log(cliReq.url);

      const x = url.parse('https://' + cliReq.url);

      const host = cliReq.url.split(':')[0];

      const proxyUrl = await findProxy("http://127.0.0.1", host);
      console.log(`Proxying ${cliReq.url} through ${proxyUrl}`);

      const match = proxyUrl.match(/^PROXY\s+(.+):(\d+);?$/i);

      let svrSoc;
      if (match) {
        console.log('match -> ' + match[1]);
        const svrReq = http.request({
          host: match[1], port: match[2],
          path: cliReq.url, method: cliReq.method, headers: cliReq.headers,
          agent: cliSoc.$agent
        });
        svrReq.end();
        svrReq.on('connect', function onSvrConn(svrRes, svrSoc2, svrHead) {
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
        svrSoc = net.connect(x.port || 443, x.hostname, function onSvrConn() {
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
    .listen(port, () =>
      console.log('http proxy server started on port ' + port));

  function onErr(err, msg, url, soc) {
    if (soc) soc.end();
    console.log('%s %s: %s', new Date().toLocaleTimeString(), msg, url, err + '');
  }
};
