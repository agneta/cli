var yargs = require('yargs');

module.exports = function() {
  require('./cert')(yargs);
  require('./config')(yargs);
  require('./image')(yargs);
  require('./kube')(yargs);
  require('./generate')(yargs);
  require('./secret')(yargs);

  yargs.command('ps', 'List all the agneta processes running', require('./ps'));
  yargs.command('start', 'Start running agneta', require('./start').command);
  yargs.command('stop', 'Stop running agneta', require('./stop').command);
  yargs.command('restart', 'Restart agneta', require('./restart'));
  yargs.command('errors', 'Log errors', require('./log').errors);
  yargs.command('output', 'Log output', require('./log').output);
  yargs.command(
    'setup <location>',
    'Start a new agneta project',
    require('./setup')
  );

  var argv = yargs
    .recommendCommands()
    .strict()
    .version(false)
    .help(false).argv;
  if (argv && !argv._[0]) {
    yargs.showHelp();
  }
};
