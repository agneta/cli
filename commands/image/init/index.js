const app = require('./app');
const proxy = require('./proxy');

function promise(argv) {
  return app(argv)
    .then(function() {
      return proxy(argv);
    });
}

module.exports = {
  cmd: function(yargs) {

    var argv = yargs
      .options({
        mode: {
          alias: 'm',
          describe: 'Select mode',
          choices: ['development', 'portal'],
          default: 'development'
        }
      }).argv;

    promise(argv);

  },
  promise: promise
};
