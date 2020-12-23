const boom = require('@hapi/boom');
const Ajv = require('ajv');

const validateBody = schemas => {
  if (!schemas) {
    throw boom.internal('No schemas provided');
  }

  const ajv = new Ajv({ schemas });

  if (Array.isArray(schemas) && schemas.length === 0) {
    throw boom.internal('Empty schemas provided');
  }

  return (req, res, next) => {
    const validate = ajv.getSchema();
    const valid = validate(req.body);

    if (valid) {
      return next();
    }

    throw boom.badRequest('Request body is not valid', validate.errors);
  };
};

module.exports = validateBody;
