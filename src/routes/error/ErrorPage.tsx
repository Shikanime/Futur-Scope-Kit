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
import s from './ErrorPage.scss';

interface Error {
  title: string;
  message: string;
  stack: string;
}

interface Props {
  error?: Error;
}

interface State {}

class ErrorPage extends React.Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    error: null,
  };

  public render(): JSX.Element {
    if (__DEV__ && this.props.error) {
      return (
        <div>
          <h1>{this.props.error.title}</h1>
          <pre>{this.props.error.stack}</pre>
        </div>
      );
    }

    return (
      <div>
        <h1>Error</h1>
        <p>Sorry, a critical error occurred on this page.</p>
      </div>
    );
  }
}

export { ErrorPage as ErrorPageWithoutStyle };
export default withStyles(s)(ErrorPage);
