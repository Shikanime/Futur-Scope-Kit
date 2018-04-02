/**
 * Futur Scope Kit
 *
 * Copyright © 2018-present Deva All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import React from 'react';
import renderer from 'react-test-renderer';
import App from '../../App';
import Layout from '../Layout';

describe('Layout', () => {
  test('renders children correctly', () => {
    const wrapper = renderer
      .create(
        <App
          context={{
            insertCss: (...styles: Array<string>) => {}, // eslint-disable-line no-unused-vars
            fetch: (url: string, options: object) => Promise.resolve({}), // eslint-disable-line no-unused-vars
            pathname: '',
            query: {},
          }}
        >
          <Layout>
            <div className="child" />
          </Layout>
        </App>,
      )
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
