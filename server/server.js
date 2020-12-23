const logger = require('./logger');
const App = require('./app');

logger.setLogInfo();
const { PORT = 9000 } = process.env;

module.exports = router => {
  try {
    const app = App(router);
    app.listen(PORT, () =>
      logger('start', global.logInfo).info(`App listening on port ${PORT}`)
    );
  } catch (e) {
    logger().error(e.message);
    process.exit(1);
  }
};
