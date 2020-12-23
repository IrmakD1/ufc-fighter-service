const auth = require('./auth');
const cors = require('./cors');
const errorHandler = require('./error-handler');
const logger = require('./logger');
const serverStatus = require('./server-status');
const validateBody = require('./validate-body');
const swagger = require('./swagger');

module.exports = {
  auth,
  cors,
  errorHandler,
  logger,
  serverStatus,
  validateBody,
  swagger,
};
