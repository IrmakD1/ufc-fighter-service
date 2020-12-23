const uuid = require('uuid/v1');
const onFinished = require('on-finished');
const { get } = require('lodash');
const Logger = require('../logger');

const logRequestInfo = (req, res) => ({
  ...global.logInfo,
  internalUser: req.get('x-caf-api-key'),
  component: 'BM_API',
  reqIp: req.ip || get(global, 'logInfo.reqIp'),
  reqUrl: req.originalUrl || get(global, 'logInfo.reqUrl'),
  eventClass: 'REQUEST',
  httpVerb: req.method || get(global, 'logInfo.httpVerb'),
  statusCode: res.statusCode || get(global, 'logInfo.statusCode'),
  protocol: req.protocol || get(global, 'logInfo.protocol'),
  httpVersion: req.httpVersion || get(global, 'logInfo.httpVersion'),
  userAgent: req.get('user-agent') || get(global, 'logInfo.userAgent'),
});

const loggerMiddleware = (
  msg = '',
  level = 'info',
  stackTrace,
  exceptionType
) => (req, res, next) => {
  const metricsRegEx = RegExp(/metrics|health|^\/$/);
  req.startAt = process.hrtime();

  let cid = req.get('x-caf-cid');
  if (!cid) {
    cid = uuid();
    req.headers['x-caf-cid'] = cid;
  }

  const logRequest = () => {
    let responseTime;

    if (req.startAt) {
      const endAt = process.hrtime();
      responseTime =
        (endAt[0] - req.startAt[0]) * 1e9 + (endAt[1] - req.startAt[1]);
    }
    const log = Logger(cid, logRequestInfo(req, res), {
      responseTime,
      stackTrace,
      exceptionType,
    });

    // drop level for metrics
    const reportLevel = metricsRegEx.test(req.originalUrl) ? 'verbose' : level;
    log.log(reportLevel, msg);
  };

  onFinished(res, logRequest);

  next();
};

module.exports = loggerMiddleware;
