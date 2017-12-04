const Promise = require('bluebird');

function promise(argv) {
  argv = argv || {};

  return Promise.resolve()
    .then(function() {
      return require('./check')();
    })
    .then(function() {
      return require('./app')(argv);
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
