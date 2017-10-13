module.exports = function(yargs) {

  yargs
    .command('image', 'Manage agneta images', function(yargs) {

      yargs.command('build', 'Build the an image of the agneta project', require('./build'));
      yargs.command('start', 'Start running the image built', require('./start.js'));
      yargs.command('stop', 'Stop running the image', require('./stop.js').cmd);
      yargs.command('restart', 'Restart the image', require('./restart.js'));
      yargs.command('setup', 'Setup the image when building', require('./setup'));

    });
};
