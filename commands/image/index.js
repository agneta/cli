module.exports = function(yargs) {
  yargs.command('image', 'Manage agneta images', function(yargs) {
    yargs.command(
      'build',
      'Build the an image of the agneta project',
      require('./build')
    );
    yargs.command(
      'init',
      'Init project with docker files',
      require('./init').cmd
    );
    yargs.command(
      'proxy',
      'Generate files for the proxy and start the image',
      require('./proxy')
    );

    yargs.command(
      'start <service>',
      'Start running the image built',
      builder,
      require('./start')
    );
    yargs.command(
      'stop <service>',
      'Stop running the image',
      builder,
      require('./stop').cmd
    );
    yargs.command(
      'restart <service>',
      'Restart the image',
      builder,
      require('./restart')
    );

    var exec = require('./exec');
    yargs.command(
      'output <service>',
      'Open output log of the running image',
      builder,
      exec.output
    );
    yargs.command(
      'error <service>',
      'Open error log of the running image',
      builder,
      exec.error
    );
    yargs.command(
      'terminal <service>',
      'Open a terminal of the running image',
      builder,
      exec.terminal
    );

    require('../default')(yargs);

    function builder(yargs) {
      yargs.positional('service', {
        describe: 'The name of the service in the docker-compose.yml',
        type: 'string',
        required: true
      });
    }
  });
};
