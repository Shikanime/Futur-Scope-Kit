/**
 * Futur Scope Kit
 *
 * Copyright © 2018-present Deva All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import webpack from 'webpack';
import logger from './logger';
import webpackConfig from './webpack.config';

/**
 * Creates application bundles from the source files.
 */
function bundle() {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      logger.info(stats.toString(webpackConfig[0].stats));
      if (stats.hasErrors()) {
        return reject(new Error('Webpack compilation errors'));
      }

      return resolve();
    });
  });
}

export default bundle;
