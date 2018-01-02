const path = require('path');
const agnetaPlatform = path.join(process.cwd(), 'node_modules/agneta-platform');

function promise() {

  // Default is portal
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.MODE = process.env.MODE || 'portal';
  process.env.PORT = process.env.PORT || 8383;
  process.env.PORT_HTTP = process.env.PORT_HTTP || 8181;

  return Promise.resolve()
    .then(function() {
      return require('../secret/key/get').promise();
    })
    .then(function() {
      return require(agnetaPlatform);
    });

}

module.exports = {
  promise: promise,
  command: function(yargs){

    var argv = yargs
      .alias('m', 'mode')
      .describe('m', 'Select build mode')
      .choices('m', ['sftp', 'services'])
      .help('help')
      .argv;

    switch (argv.m) {

      case 'sftp':

        process.env.MODE = 'sftp';
        process.env.PORT = process.env.PORT || 8282;
        break;

      case 'services':

        process.env.MODE = 'services';
        process.env.PORT = process.env.PORT || 8484;
        break;

    }

    promise()
      .then(function() {
        console.log('Process started');
        console.log('View the logs by entering the following command:');
        console.log('agneta process [errors/output]');
        process.exit();
      })
      .catch(console.error);

  }
};
