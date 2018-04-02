/**
 * Futur Scope Kit
 *
 * Copyright © 2017-present Deva. All rights reserved.
 *
 * This source code is licensed
 * LICENSE.txt file in the root directory of this source tree.
 */

import pino from 'pino';

const logger = pino({
  level: 'debug',
  timestamp: true,
  prettyPrint: true,
  forceColor: true,
});

export default logger;
