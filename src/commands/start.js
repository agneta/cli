const path = require('path');
const pm2 = require('pm2');
const config = require('../lib/config');
const fs = require('fs-extra');
const chalk = require('chalk');

function promise() {
  // Default is portal
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.MODE = process.env.MODE || 'portal';
  process.env.PORT = process.env.PORT || 8383;
  process.env.PORT_HTTP = process.env.PORT_HTTP || 8181;

  if (!global.pathPlatform) {
    console.warn(
      chalk.yellow('Agneta platform is needed to start an application.')
    );
    return;
  }

  return Promise.resolve()
    .then(function() {
      return require('./secret/key/get').promise();
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
        var base = path.join(process.env.HOME, '.pm2/logs');
        var outputPath = path.join(base, `${config.processName}-out.log`);
        var errorPath = path.join(base, `${config.processName}-err.log`);

        var scriptPath = path.join(
          global.pathPlatform,
          'dist',
          'main',
          'server',
          'index.js'
        );

        if (!fs.existsSync(scriptPath)) {
          scriptPath = path.join(
            global.pathPlatform,
            'main',
            'server',
            'index.js'
          );
        }

        if (!fs.existsSync(scriptPath)) {
          throw new Error(`Could not find script path: ${scriptPath}`);
        }

        var pm2Options = {
          name: config.processName,
          script: scriptPath,
          sourceMapSupport: true,
          min_uptime: '1m',
          max_restarts: 10,
          exec_mode: 'fork',
          color: true,
          output: outputPath,
          error: errorPath,
          cwd: process.cwd()
        };

        pm2.start(pm2Options, function(err) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      }).then(function() {
        return true;
      });
    });
}

module.exports = {
  promise: promise,
  command: function(yargs) {
    var argv = yargs
      .alias('m', 'mode')
      .describe('m', 'Select build mode')
      .choices('m', ['sftp', 'services'])
      .help('help').argv;

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
        // Do not exit the process since it is needed for docker to run properly
        //process.exit();
      })
      .catch(console.error);
  }
};
