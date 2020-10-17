const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');

const {
  errorHandler, cors
} = require('../middleware');

module.exports = apiRouter => {
  const app = express();
  // checks cors requests against a whitelist
  app.use(cors());
  // parse http post body JSON into req.body
  app.use(bodyParser.json({ limit: '10mb' }));
  // helmet adds various http headers as a secuirty feature
  app.use(helmet());
  // main application router
  app.use('/', apiRouter);
  // error handler - app router should next() errors down to here
  app.use(errorHandler());

  return app;
};
