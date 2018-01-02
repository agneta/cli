const path = require('path');
const pm2 = require('pm2');

function promise() {

  // Default is portal
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.MODE = process.env.MODE || 'portal';
  process.env.PORT = process.env.PORT || 8383;
  process.env.PORT_HTTP = process.env.PORT_HTTP || 8181;

  return Promise.resolve()
    .then(function() {
      console.log('key');

      return require('../secret/key/get').promise();
    })
    .then(function() {

      return new Promise(function(resolve, reject) {
        pm2.connect(function(err) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    })
    .then(function() {
      return new Promise(function(resolve, reject) {
        var name = 'agneta';
        var base = path.join(process.env.HOME, '.pm2/logs');
        var outputPath = path.join(base, `${name}-output.log`);
        var errorPath = path.join(base, `${name}-error.log`);

        pm2.start({
          name: name,
          script: path.join(global.pathPlatform,'main', 'server', 'index.js'),
          exec_mode: 'fork',
          logDateFormat: '>> YYYY-MM-DD HH:mm:ss Z :',
          output: outputPath,
          error: errorPath,
          cwd: process.cwd()
        }, function(err) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });

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
