/**
 * Futur Scope Kit
 *
 * Copyright © 2018-present Deva All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

function renderUniversalRoutes(routes, currentRoute) {
  if (Array.isArray(currentRoute.children)) {
    return currentRoute.children
      .map(el => ({
        ...el,
        path: `${currentRoute.path}${el.path}`,
      }))
      .reduce(flatRoutes, routes);
  }

  return [...routes, currentRoute.path];
}

export default renderUniversalRoutes;
