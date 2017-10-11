const path = require('path');
const spawn = require('child_process').spawn;
module.exports = function(yargs) {

  var agnetaPlatform = path.join(process.cwd(),'node_modules/agneta-platform');

  yargs
    .command('start', 'Start the agneta project', function(yargs) {

      process.env.MODE = 'portal';

      yargs.command('sftp', 'Run in SFTP mode', function() {
        process.env.MODE = 'sftp';
        process.env.PORT = process.env.PORT || 8282;
      });

      yargs.command('portal', 'Run the portal', function() {
        process.env.NODE_ENV = 'development';
        process.env.MODE = 'portal';
        process.env.PORT = process.env.PORT || 8383;
      });

      yargs.command('services', 'Run the services', function() {
        process.env.MODE = 'services';
        process.env.PORT = process.env.PORT || 8484;
      });

      require(agnetaPlatform);

      spawn('pm2',['logs']).stdout.pipe(process.stdout);

    });
};
