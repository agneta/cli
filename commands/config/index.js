const config = require('../../lib/config');

module.exports = function(yargs) {

  init({
    command: 'config',
    yargs: yargs,
    type: 'project'
  });

  function init(options) {

    options.config = config[options.type];
    var yargs = options.yargs;

    yargs.command(options.command, 'Set and get configuration variables', function(yargs) {

      yargs.command('get', 'Get a configuration value', require('./get')(options));
      yargs.command('delete', 'Delete a configuration value', require('./delete')(options));
      yargs.command('set', 'Set a configuration value', require('./set')(options));
      yargs.command('edit', 'Open config file with an editor', require('./edit')(options));

      init({
        command: 'global',
        yargs: yargs,
        type: 'agneta'
      });

      yargs.command('*', 'Show all configuration values', require('./show')(options));

    });

  }

};
