/**
 * Futur Scope Kit
 *
 * Copyright © 2018-present Deva All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.scss';

interface Props {
  news: Array<{
    title: string;
    link: string;
    content?: string;
  }>;
}

interface State {}

class Home extends React.Component<Props, State> {
  public render(): JSX.Element {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>React.js News</h1>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
