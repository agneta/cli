module.exports = function(yargs) {

  yargs
    .command('process', 'Manage agneta processes', function(yargs) {

      yargs.command('list', 'List all the agneta processes running', require('./list.js'))
        .command('start', 'Start running agneta', require('./start.js'))
        .command('stop', 'Stop running agneta', require('./stop.js'))
        .command('restart', 'Restart agneta', require('./restart.js'));

    });
};
