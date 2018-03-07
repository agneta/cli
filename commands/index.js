var yargs = require('yargs');

module.exports = function(){


  require('./default')(yargs);
  require('./config')(yargs);
  require('./version')(yargs);
  require('./image')(yargs);
  require('./generate')(yargs);
  require('./secret')(yargs);

  yargs.command('ps', 'List all the agneta processes running', require('./ps'));
  yargs.command('start', 'Start running agneta', require('./start').command);
  yargs.command('stop', 'Stop running agneta', require('./stop').command);
  yargs.command('restart', 'Restart agneta', require('./restart'));
  yargs.command('errors', 'Log errors', require('./log').errors);
  yargs.command('output', 'Log output', require('./log').output);
  yargs.command('setup', 'Start a new agneta project', require('./setup'));

  require('./common/config')({
    yargs: yargs,
    type: 'project'
  });

  yargs
    .help('h')
    .alias('h', 'help')
    .argv;

};
