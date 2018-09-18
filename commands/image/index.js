module.exports = function(yargs) {
  yargs.command('image', 'Manage agneta images', function(yargs) {
    yargs.command(
      'build',
      'Build the an image of the agneta project',
      require('./build')
    );

    yargs.command('setup', 'Setup the project to be ready', require('./setup'));

    yargs.command(
      'init',
      'Init project with docker files',
      require('./init').cmd
    );

    yargs.command('start', 'Start running the image built', require('./start'));

    require('../default')(yargs);
  });
};
