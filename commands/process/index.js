module.exports = function(yargs) {

  yargs
    .command('process', 'Manage agneta processes', function(yargs) {

      yargs.command('list', 'List all the agneta processes running', require('./list'));

      yargs.command('start', 'Start running agneta', require('./start').command);
      yargs.command('stop', 'Stop running agneta', require('./stop').command);
      yargs.command('restart', 'Restart agneta', require('./restart'));

      yargs.command('errors', 'Log errors', require('./log').errors);
      yargs.command('output', 'Log output', require('./log').output);

    });
};
