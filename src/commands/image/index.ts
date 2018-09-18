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

    yargs.command(
      'log',
      'View info and errors from a running container',
      require('./log')
    );

    yargs.command(
      'start',
      'Start running a container with the built image',
      require('./start')
    );

    yargs.command('stop', 'Stop running a container', require('./stop'));
    yargs.command(
      'bash',
      'Create a bash session in a container',
      require('./bash')
    );

    require('../default')(yargs);
  });
};
