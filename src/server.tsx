/**
 * Futur Scope Kit
 *
 * Copyright © 2018-present Deva All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import leStoreCertbot from 'le-store-certbot';
import leChallengeFs from 'le-challenge-fs';
import redirectHttps from 'redirect-https';
import http from 'http';
import https from 'https';
import greenlock from 'greenlock-express';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import nodeFetch from 'node-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import compression from 'compression';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.scss';
import createFetch from './createFetch';
import router from './router';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import config from './config';

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  // send entire app down. Process manager will restart it
  process.exit(1);
});

const app = express();

//
// If you are using proxy from external machine, you can set TRUST_PROXY env
// Default is to trust proxy headers only from loopback interface.
// -----------------------------------------------------------------------------
app.set('trust proxy', config.trustProxy);

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(compression());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token,
  }),
);
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    const insertCss = (...styles) => {
      // eslint-disable-next-line no-underscore-dangle
      styles.forEach(style => css.add(style._getCss()));
    };

    // Universal HTTP client
    const fetch = createFetch(nodeFetch, {
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
    });

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      insertCss,
      fetch,
      // The twins below are wild, be careful!
      pathname: req.path,
      query: req.query,
    };

    const route = await router.resolve(context);

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(
      <App context={context}>{route.component}</App>,
    );
    data.styles = [{ id: 'css', cssText: [...css].join('') }];
    data.scripts = [assets.vendor.js];
    if (route.chunks) {
      data.scripts.push(...route.chunks.map(chunk => assets[chunk].js));
    }
    data.scripts.push(assets.client.js);
    data.app = {
      apiUrl: config.api.clientUrl,
    };

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(
        <ErrorPageWithoutStyle
          error={{
            title: err.name,
            message: err.message,
            stack: err.stack,
          }}
        />,
      )}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
if (!module.hot) {
  if (__DEV__) {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  } else {
    const lex = greenlock.create({
      // There are a number of common problems related to system configuration
      // - firewalls, ports, permissions, etc - that you are likely to run up
      // against when using greenlock for your first time.
      server: __DEV__
        ? 'staging'
        : 'https://acme-v01.api.letsencrypt.org/directory',

      challenges: {
        'http-01': leChallengeFs.create({
          webrootPath: '/tmp/acme-challenges',
        }),
      },
      store: leStoreCertbot.create({ webrootPath: '/tmp/acme-challenges' }),

      // You probably wouldn't need to replace the default sni handler
      // See https://git.daplie.com/Daplie/le-sni-auto if you think you do

      // If you don't do proper checks in approveDomains(opts, certs, cb)
      // an attacker will spoof SNI packets with bad hostnames and that
      // will cause you to be rate-limited and or blocked from the ACME server.
      approveDomains(opts, certs, cb) {
        // This is where you check your database and associated
        // email addresses with domains and agreements and such

        const options = opts;

        // The domains being approved for the first time are listed in opts.domains
        // Certs being renewed are listed in certs.altnames
        if (certs) {
          options.domains = certs.altnames;
        } else {
          options.email = config.letsencryptEmail;
          options.agreeTos = true;
        }

        // NOTE: you can also change other options such as `challengeType` and `challenge`
        // opts.challengeType = 'http-01';
        // opts.challenge = require('le-challenge-fs').create({});

        cb(null, { options, certs });
      },
    });

    // Redirect all unsecure connection
    http.createServer(lex.middleware(redirectHttps())).listen(80, () => {
      console.info('Listening for ACME http-01 challenges');
    });

    https
      .createServer(lex.httpsOptions, lex.middleware(app))
      .listen(config.port, () => {
        console.info('Listening for ACME tls-sni-01 challenges and serve app');
      });
  }
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
