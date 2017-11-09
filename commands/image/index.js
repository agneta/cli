module.exports = function(yargs) {

  yargs
    .command('image', 'Manage agneta images', function(yargs) {

      yargs.command('build', 'Build the an image of the agneta project', require('./build'));
      yargs.command('setup', 'Setup the image when building', require('./setup'));
      yargs.command('init', 'Init project with docker files', require('./init').cmd);

      yargs.command('start <service>', 'Start running the image built', require('./start.js'));
      yargs.command('stop <service>', 'Stop running the image', require('./stop.js').cmd);
      yargs.command('restart <service>', 'Restart the image', require('./restart.js'));

    });
};
