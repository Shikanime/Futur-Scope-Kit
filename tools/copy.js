/**
 * Futur Scope Kit
 *
 * Copyright © 2018-present Deva All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import chokidar from 'chokidar';
import { writeFile, copyFile, makeDir, copyDir, cleanDir } from './lib/fs';
import pkg from '../package.json';
import logger from './logger';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy() {
  await makeDir('build');
  await Promise.all([
    writeFile(
      'build/package.json',
      JSON.stringify(
        {
          app: pkg.app,
          private: true,
          engines: pkg.engines,
          dependencies: pkg.dependencies,
          scripts: {
            start: 'node server.js',
          },
        },
        null,
        2,
      ),
    ),
    copyFile('LICENSE.txt', 'build/LICENSE.txt'),
    copyFile('Dockerfile', 'build/Dockerfile'),
    copyFile('docker-compose.yml', 'build/docker-compose.yml'),
    copyFile('manager.js', 'build/manager.js'),
    copyFile('yarn.lock', 'build/yarn.lock'),
    copyDir('public', 'build/public'),
  ]);

  if (process.argv.includes('--watch')) {
    const watcher = chokidar.watch(['public/**/*'], { ignoreInitial: true });

    watcher.on('all', async (event, filePath) => {
      const start = new Date();
      const src = path.relative('./', filePath);
      const dist = path.join(
        'build/',
        src.startsWith('src') ? path.relative('src', src) : src,
      );
      switch (event) {
        case 'add':
        case 'change':
          await makeDir(path.dirname(dist));
          await copyFile(filePath, dist);
          break;
        case 'unlink':
        case 'unlinkDir':
          cleanDir(dist, { nosort: true, dot: true });
          break;
        default:
          return;
      }
      const end = new Date();
      const time = end.getTime() - start.getTime();
      logger.info(`${event} '${dist}' after ${time} ms`);
    });
  }
}

export default copy;
