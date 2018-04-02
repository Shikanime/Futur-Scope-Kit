/**
 * Futur Scope Kit
 *
 * Copyright © 2018-present Deva All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout/Layout';

async function action() {
  return {
    title: 'Futur Scope Kit',
    component: (
      <Layout>
        <Home news={[]} />
      </Layout>
    ),
  };
}

export default action;
