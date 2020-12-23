const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');

const {
  auth,
  cors,
  errorHandler,
  serverStatus,
  logger,
} = require('./middleware');

module.exports = apiRouter => {
  const app = express();
  // parse http post body JSON into req.body
  app.use(bodyParser.json({ limit: '10mb' }));
  // helmet adds various http headers as a secuirty feature
  app.use(helmet());
  // checks cors requests against a whitelist
  app.use(cors());
  // logs request-level information
  app.use(logger());
  // exports a liveness endpoint on '/'
  const started = new Date();
  app.use(serverStatus(started));
  // authentication
  // app.use(auth());
  // main application router
  app.use('/', apiRouter);
  // error handler - app router should next() errors down to here
  app.use(errorHandler());

  return app;
};
