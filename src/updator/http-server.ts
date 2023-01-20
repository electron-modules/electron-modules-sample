'use strict';

import http from 'http';
import detectPort from 'detect-port';

module.exports = async (options = {}) => {
  const { port: _port, data = {} } = options;
  const port = await detectPort(_port);
  http.createServer((_, response) => {
    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    response.end(JSON.stringify(data));
  }).listen(port);
  console.log('http server start: %s', `http://localhost:${port}`);
};
