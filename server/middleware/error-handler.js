const { isError, get } = require('lodash');
const logmid = require('./logger');

module.exports = () => (err, req, res, next) => {
  if (isError(err)) {
    const { message, stack } = err;
    const statusCode = get(err, 'output.payload.statusCode', 500);
    const errorCode = get(err, 'data.errorCode', 'E000');

    logmid(message, 'error', stack, errorCode)(req, res, next);
    return res.status(statusCode).send({ message, errorCode });
  }

  return next();
};
