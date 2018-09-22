const fs = require('fs-extra');
const Promise = require('bluebird');
const config = require('../config');
const { spawn } = require('child_process');

module.exports = function(argv) {
  return Promise.resolve()
    .then(function() {
      return require('../machine')();
    })
    .then(function() {
      return fs.ensureDir('tmp');
    })
    .then(function() {
      return require('../../secret/key/get').promise();
    })
    .then(function(secretKey) {
      var child = spawn(
        'docker',
        [
          'build',
          '--build-arg',
          `AGNETA_SECRET_KEY=${secretKey}`,
          '--tag',
          `${argv.tag || config.image.app}`,
          '--file',
          `${config.image.file}`,
          '.'
        ],
        {
          stdio: 'inherit'
        }
      );

      return new Promise(function(resolve, reject) {
        child.on('error', function(err) {
          reject(err);
        });

        child.on('disconnect', function() {
          resolve();
        });

        child.on('close', function() {
          resolve();
        });
      });
    });
};
