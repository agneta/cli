module.exports = function(yargs) {

  yargs
    .command('image', 'Manage agneta images', function(yargs) {

      require('../../lib/check').project();

      yargs.command('build', 'Build the an image of the agneta project', require('./build'));
      yargs.command('setup', 'Setup the image when building', require('./setup'));
      yargs.command('init', 'Init project with docker files', require('./init').cmd);
      yargs.command('base', 'Generate files for the base image', require('./base'));
      yargs.command('proxy', 'Generate files for the proxy and start the image', require('./proxy'));

      yargs.command('start <service>', 'Start running the image built', builder,require('./start.js'));
      yargs.command('stop <service>', 'Stop running the image', builder,require('./stop.js').cmd);
      yargs.command('restart <service>', 'Restart the image', builder,require('./restart.js'));

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
