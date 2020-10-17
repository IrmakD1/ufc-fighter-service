const App = require('./app');

const { PORT = 9000 } = process.env;

module.exports = router => {
  try {
    const app = App(router);
    app.listen(PORT, () =>
      console.log(`App listening on port ${PORT}`)
    );
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};
