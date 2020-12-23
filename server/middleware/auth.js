const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const { find, get } = require('lodash');
const logger = require('../logger');

const validateJwt = req => {
  const { JWT_SECRET: jwtSecret } = process.env;

  if (!jwtSecret) {
    logger('validateApiKey').error(
      'JWT_SECRET environment variable requested and missing.'
    );
    throw Boom.badRequest('Unsupported authorization type');
  }

  const authorization = req.get('authorization');
  const token = authorization
    ? (authorization.trim().split('Bearer ')[1] || '').trim()
    : null;

  if (!authorization || !token) {
    throw Boom.unauthorized('No authorization token provided.');
  }

  try {
    req.session.user = jwt.verify(token, jwtSecret);

    // log
    logger('validateJwtPass').info(
      `{ user: '${get(req, 'session.user.sub')}', route: '${req.url}'}`
    );
  } catch (err) {
    logger('validateJwtFail').info(`{ error: '${err.message}' }`);
    throw Boom.unauthorized('Bad authorization token provided.');
  }
};

const validateApiKey = req => {
  const { ALLOWED_KEYS: allowedKeysVar } = process.env;

  if (!allowedKeysVar) {
    logger('validateApiKey').error(
      'ALLOWED_KEYS environment variable requested and missing.'
    );
    throw Boom.badRequest('Unsupported authorization type');
  }

  const allowedKeys = JSON.parse(allowedKeysVar);

  if (!Array.isArray(allowedKeys)) {
    throw Boom.badRequest('allowedKeys parameter should be an array.');
  }

  const key = req.get('x-caf-api-key');
  const secret = req.get('x-caf-api-secret');

  if (find(allowedKeys, { key, secret })) {
    req.session.user = { sub: 'system', name: 'system', ultra: true };

    logger('validateApiPass').debug(`{ key: '${key}', route: '${req.url}'}`);
  } else throw Boom.unauthorized('Invalid API key provided.');
};

const validateCredentials = () => {
  return function middleware(req, res, next) {
    if (req.get('x-caf-api-key') && req.get('authorization')) {
      throw Boom.badRequest('please provide only one form of authentication');
    }

    if (!req.get('x-caf-api-key') && !req.get('authorization')) {
      throw Boom.badRequest('please provide one form of authentication');
    }

    req.session = {
      cid: req.get('x-caf-cid') || 'none',
      version: req.get('x-caf-cbaas-version') || 'unknown',
    };

    if (req.get('x-caf-api-key')) validateApiKey(req);

    if (req.get('authorization')) validateJwt(req);

    return next();
  };
};

module.exports = validateCredentials;
