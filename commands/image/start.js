const Promise = require('bluebird');
const { spawn } = require('child_process');

module.exports = function(argv) {

  return Promise.resolve()
    .then(function() {
      return require('../../lib/check')();
    })
    .then(function() {
      return require('./init').promise();
    })
    .then(function() {
      return require('./machine')();
    })
    .then(function() {
      return spawn('docker-compose',['up', '-d' ,'--force-recreate',argv.service],{ stdio: 'inherit' });
    })
    .then(function() {
      return new Promise(function() {

      });
    });


};
