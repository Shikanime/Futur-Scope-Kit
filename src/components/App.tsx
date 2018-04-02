/**
 * Futur Scope Kit
 *
 * Copyright © 2018-present Deva All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

interface Context {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: (...styles: Array<string>) => void;
  // Universal HTTP client
  fetch: (url: string, options: object) => Promise<object>;
  pathname: string;
  query: object;
}

interface Props {
  context: Context;
  children: JSX.Element;
}

interface State {}

/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   );
 */
class App extends React.PureComponent<Props, State> {
  static childContextTypes = {
    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    insertCss: PropTypes.func.isRequired,
    // Universal HTTP client
    fetch: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    query: PropTypes.object,
  };

  public getChildContext(): Context {
    return this.props.context;
  }

  public render(): JSX.Element {
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    return React.Children.only(this.props.children);
  }
}

export default App;
