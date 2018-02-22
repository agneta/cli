const config = require('../../../lib/config');

module.exports = function(options) {

  options.config = config[options.type];
  var yargs = options.yargs;

  yargs.command('config', 'Set and get configuration variables', function(yargs) {

    yargs.command('get', 'Get a configuration value', require('./get')(options));
    yargs.command('set', 'Set a configuration value', require('./set')(options));

    yargs.command('*', 'Show all configuration values',require('./show')(options) );

  });

};
