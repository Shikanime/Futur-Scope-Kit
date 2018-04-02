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
import normalize from '../../assets/normalize.css';
import s from './Layout.scss';

interface Props {
  children: JSX.Element;
}

interface State {}

class Layout extends React.Component<Props, State> {
  public render(): JSX.Element {
    return <div>{this.props.children}</div>;
  }
}

export default withStyles(normalize, s)(Layout);
