/**
 * Futur Scope Kit
 *
 * Copyright © 2018-present Deva All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import fetch from 'node-fetch';
import { writeFile, makeDir } from './lib/fs';
import logger from './logger';
import runServer from './runServer';
import renderUniversalRoutes from './lib/renderUniversalRoutes';
import pkg from '../package.json';

// Render routes
const routes = pkg.app.routes.reduce(renderUniversalRoutes, []);

async function render() {
  const server = await runServer();

  // add dynamic routes
  // const products = await fetch(`http://${server.host}/api/products`).then(res => res.json());
  // products.forEach(product => routes.push(
  //   `/product/${product.uri}`,
  //   `/product/${product.uri}/specs`
  // ));

  await Promise.all(
    routes.map(async (route, index) => {
      const url = `http://${server.host}${route}`;
      const fileName = route.endsWith('/')
        ? 'index.html'
        : `${path.basename(route, '.html')}.html`;
      const dirName = path.join(
        'build/public',
        route.endsWith('/') ? route : path.dirname(route),
      );
      const dist = path.join(dirName, fileName);
      const timeStart = new Date();
      const response = await fetch(url);
      const timeEnd = new Date();
      const text = await response.text();
      await makeDir(dirName);
      await writeFile(dist, text);
      const time = timeEnd.getTime() - timeStart.getTime();
      logger.info(
        `#${index + 1} ${dist} => ${response.status} ${
          response.statusText
        } (${time} ms)`,
      );
    }),
  );

  server.kill('SIGTERM');
}

export default render;
