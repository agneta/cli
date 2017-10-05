const path = require('path');

module.exports = function(yargs) {

  var agnetaPlatform = path.join(process.cwd(),'node_modules/agneta-platform');

  yargs
    .command('start', 'Start the agneta project', function(yargs) {

      yargs.command('sftp', 'Run in SFTP mode', function() {
        process.env.MODE = 'sftp';
        process.env.PORT = 8282;
        require(agnetaPlatform);
      });

    });
};
