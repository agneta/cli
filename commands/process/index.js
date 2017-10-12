module.exports = function(yargs) {

  yargs
    .command('process', 'Manage agneta processes', function(yargs) {

      yargs.command('list', 'List all the agneta processes running', require('./list.js'));
      yargs.command('start', 'Start running agneta', require('./start.js'));
      yargs.command('stop', 'Stop running agneta', require('./stop.js'));
      yargs.command('restart', 'Restart agneta', require('./restart.js'));

    });
};
