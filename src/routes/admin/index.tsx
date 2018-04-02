/**
 * Futur Scope Kit
 *
 * Copyright © 2018-present Deva All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout/Layout';
import Admin from './Admin';

const title = 'Admin Page';
const isAdmin = false;

function action() {
  if (!isAdmin) {
    return { redirect: '/login' };
  }

  return {
    chunks: ['admin'],
    title,
    component: (
      <Layout>
        <Admin title={title} />
      </Layout>
    ),
  };
}

export default action;
