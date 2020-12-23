const readPkg = require('read-pkg');

module.exports = started => async (req, res, next) => {
  try {
    if (req.path === '/') {
      const uptime = (Date.now() - started.getTime()) / 1000;

      const { version, name } = await readPkg();

      return res.send({ name, started, uptime, version });
    }
  } catch (err) {
    /* eslint-disable no-empty */
  }

  return next();
};
