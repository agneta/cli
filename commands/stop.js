const pm2 = require('pm2');
const config = require('../lib/config');
const Promise = require('bluebird');

function promise() {
  return Promise.resolve()
    .then(function() {
      return new Promise(function(resolve, reject) {
        pm2.describe(config.processName, function(err, result) {
          if (err) {
            reject(err);
          }

          resolve(result);
        });
      });
    })
    .then(function(result) {
      if (!result[0]) {
        console.log('Process is not running');
        return;
      }

      return new Promise(function(resolve, reject) {
        pm2.delete(config.processName, function(err, list) {
          if (err) {
            reject(err);
          }

          resolve(list);
        });
      }).then(function() {
        console.log('process stopped');
      });
    });
}

module.exports = {
  promise: promise,
  command: function() {
    promise()
      .then(function() {
        process.exit();
      })
      .catch(console.error);
  }
};
