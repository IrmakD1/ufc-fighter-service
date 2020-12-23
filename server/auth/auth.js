const Boom = require('@hapi/boom');
const _ = require('lodash');
const logger = require('../logger');

const logAndThrow = (session, message) => {
  logger(session.cid).info({
    version: session.version,
    user: _.get(session, 'user.sub'),
    error: message,
  });

  throw Boom.forbidden(message);
};

const validateArray = accesses => {
  if (_.isString(accesses)) return [accesses];
  if (_.isArray(accesses) && !_.isEmpty(accesses)) return accesses;
  throw Error('invalid input');
};

const addToCombinations = (source, newArray, keyName) =>
  _.flatMap(newArray, element =>
    _.map(source, srcObj => {
      const { ...outObj } = srcObj;
      outObj[keyName] = element;
      return outObj;
    })
  );

const getCombinations = (productIds, resources, accesses) => {
  let combinations = [{}];
  combinations = addToCombinations(combinations, productIds, 'productId');
  combinations = addToCombinations(combinations, resources, 'resource');
  combinations = addToCombinations(combinations, accesses, 'access');

  return combinations;
};

const checkAccess = (session, productId, resource, access) =>
  !!_.find(
    _.get(session.user.products, `${productId}.${resource}`),
    a => a.toLowerCase() === access.toLowerCase()
  );

const checkAccessMapper = session => ({ productId, resource, access }) =>
  checkAccess(session, productId, resource, access);

const checkAllAccesses = (
  session,
  productIds,
  resources,
  accesses,
  options
) => {
  const access = _.map(
    getCombinations(productIds, resources, accesses),
    checkAccessMapper(session)
  );

  switch (options.searchType) {
    case 'AND':
      if (_.includes(access, false))
        logAndThrow(session, 'cannot access target action');
      break;
    case 'OR':
      if (!_.includes(access, true))
        logAndThrow(session, 'cannot access target action');
      break;
    default:
      logAndThrow(session, 'cannot access target action');
  }

  return true;
};

const authenticate = (
  session,
  inProductIds,
  inResources,
  inAccesses,
  options = { searchType: 'AND' }
) => {
  // validates and decodes token with secret and expiry
  const productIds = validateArray(inProductIds);
  const resources = validateArray(inResources);
  const accesses = validateArray(inAccesses);

  logger(session.cid).info({
    version: session.version,
    user: _.get(session, 'user.sub'),
    products: productIds.join(','),
    resource: resources.join(','),
    accesses: accesses.join(','),
  });

  const ultra = _.get(session, 'user.ultra');
  if (ultra) return session;

  const accessFound = checkAllAccesses(
    session,
    productIds,
    resources,
    accesses,
    options
  );
  // audit log
  // if access is found, return true else throw unauthorised error
  if (accessFound) return session;
  throw Boom.forbidden();
};

module.exports = authenticate;
