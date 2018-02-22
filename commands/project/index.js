module.exports = function(yargs) {

  yargs.command('project', 'Run commands for your project', function(yargs) {

    yargs.command('ps', 'List all the agneta processes running', require('./ps'));

    yargs.command('start', 'Start running agneta', require('./start').command);
    yargs.command('stop', 'Stop running agneta', require('./stop').command);
    yargs.command('restart', 'Restart agneta', require('./restart'));

    yargs.command('errors', 'Log errors', require('./log').errors);
    yargs.command('output', 'Log output', require('./log').output);

    yargs.command('init', 'Start a new agneta project', require('./init'));

    require('../common/config')({
      yargs: yargs,
      type: 'project'
    });
    require('../default')(yargs);
  });
};
