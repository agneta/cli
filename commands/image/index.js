module.exports = function(yargs) {

  yargs
    .command('image', 'Manage agneta images', function(yargs) {

      yargs.command('build', 'Build the an image of the agneta project', require('./build'));
      yargs.command('init', 'Init project with docker files', require('./init').cmd);
      yargs.command('base', 'Generate files for the base image', require('./base'));
      yargs.command('proxy', 'Generate files for the proxy and start the image', require('./proxy'));

      yargs.command('start <service>', 'Start running the image built', builder,require('./start.js'));
      yargs.command('stop <service>', 'Stop running the image', builder,require('./stop.js').cmd);
      yargs.command('restart <service>', 'Restart the image', builder,require('./restart.js'));

      yargs.command('terminal <service> <command>', 'Open terminal with specified service', builder,require('./terminal.js'));

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
