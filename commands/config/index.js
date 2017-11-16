module.exports = function(yargs) {

  yargs.command('config', 'Set and get configuration variables', function(yargs) {

    yargs.command('get', 'Get a configuration value', require('./get'));
    yargs.command('set', 'Set a configuration value', require('./set'));
    require('../default')(yargs);

  });

};
