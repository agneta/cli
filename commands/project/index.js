module.exports = function(yargs) {

  yargs.command('project', 'Run commands for your project', function(yargs) {

    yargs.command('init', 'Start a new agneta project', require('./init'));

    require('../default')(yargs);
  });
};
