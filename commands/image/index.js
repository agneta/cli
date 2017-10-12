module.exports = function(yargs) {

  yargs
    .command('image', 'Manage agneta images', function(yargs) {

      yargs.command('build', 'Build the an image of the agneta project', require('./build.js'));
      yargs.command('start', 'Start running the image built', require('./start.js'));
      yargs.command('stop', 'Stop running the image', require('./stop.js'));
      yargs.command('restart', 'Restart the image', require('./restart.js'));
      yargs.command('init', 'Restart the image', require('./init'));

    });
};
