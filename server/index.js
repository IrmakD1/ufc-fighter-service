const app = require('./app');
const server = require('./server');
const middleware = require('./middleware');
const logger = require('./logger');
const auth = require('./auth');
const secrets = require('./secrets');

module.exports = { app, server, middleware, logger, auth, secrets };
